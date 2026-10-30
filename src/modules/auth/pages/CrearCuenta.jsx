import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import AuthLayout from './AuthLayout'
import FormField from './FormField'
import PushAlertContainer from '../../../components/common/Toast/PushAlert.jsx'
import {
    UserIcon,
    MailIcon,
    LockIcon,
    EyeIcon,
    CheckIcon,
    PhoneIcon,
    MapPinIcon,
    IdCardIcon
} from './icons'

import AuthService from '../services/authService'
import {
    NAME_REGEX,
    ONLY_DIGITS_REGEX,
    DOCUMENT_TYPE_OPTIONS,
    normalizeTipoDocumento,
    normalizeDocumento,
    validateTipoDocumento,
    validateDocumento,
    validateCorreo,
    validatePassword
} from '../../../utils/validators'

// ==========================================
// REGLAS Y FUNCIONES DE VALIDACIÓN PURAS
// ==========================================

function validateNombre(val) {
    const trimmed = (val || '').trim()
    if (!trimmed) {
        return 'El nombre es obligatorio.'
    }
    if (trimmed.length < 2) {
        return 'El nombre debe tener al menos 2 caracteres.'
    }
    if (trimmed.length > 100) {
        return 'El nombre no puede superar los 100 caracteres.'
    }
    if (!NAME_REGEX.test(trimmed)) {
        return 'El nombre no puede contener números ni caracteres especiales.'
    }
    return ''
}

function validateApellido(val) {
    const trimmed = (val || '').trim()
    if (!trimmed) {
        return 'El apellido es obligatorio.'
    }
    if (trimmed.length < 2) {
        return 'El apellido debe tener al menos 2 caracteres.'
    }
    if (trimmed.length > 100) {
        return 'El apellido no puede superar los 100 caracteres.'
    }
    if (!NAME_REGEX.test(trimmed)) {
        return 'El apellido no puede contener números ni caracteres especiales.'
    }
    return ''
}

function validateTelefono(val) {
    const trimmed = (val || '').trim()
    if (!trimmed) {
        return 'El teléfono es obligatorio.'
    }
    if (!ONLY_DIGITS_REGEX.test(trimmed)) {
        return 'El teléfono solo debe contener números.'
    }
    if (trimmed.length < 7 || trimmed.length > 10) {
        return 'El teléfono debe tener entre 7 y 10 dígitos.'
    }
    return ''
}

function validateDireccion(val) {
    const trimmed = (val || '').trim()
    if (!trimmed) {
        return 'La dirección es obligatoria.'
    }
    if (trimmed.length < 5) {
        return 'La dirección debe tener al menos 5 caracteres.'
    }
    if (trimmed.length > 200) {
        return 'La dirección no puede superar los 200 caracteres.'
    }
    return ''
}

function validateConfirmPassword(val, originalPassword) {
    if (!val) {
        return 'Confirma tu contraseña.'
    }
    if (val !== originalPassword) {
        return 'Las contraseñas no coinciden.'
    }
    return ''
}

export default function CrearCuenta() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        tipoDocumento: 'CC',
        documento: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: '',
        confirmPassword: ''
    })

    // Rastreo de campos interactuados (onBlur o corregidos)
    const [touched, setTouched] = useState({})

    // Errores síncronos de formato
    const [errors, setErrors] = useState({})

    // Errores asíncronos de duplicidad (correo / documento)
    const [asyncErrors, setAsyncErrors] = useState({})

    // Estado de comprobación asíncrona en curso
    const [validating, setValidating] = useState({
        correo: false,
        documento: false
    })

    // Disponibilidad confirmada por backend (true = libre, false = ocupado, null = sin validar)
    const [serverAvailability, setServerAvailability] = useState({
        correo: null,
        documento: null
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)

    const [errorGeneral, setErrorGeneral] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // ==========================================
    // SISTEMA DE NOTIFICACIONES PUSH TOAST
    // ==========================================
    const [alerts, setAlerts] = useState([])

    const addAlert = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 9)
        setAlerts((prev) => [...prev, { id, type, title, message, duration }])
    }, [])

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id))
    }, [])

    // Refs para temporizadores de debounce y cancelación de peticiones obsoletas
    const correoDebounceRef = useRef(null)
    const documentoDebounceRef = useRef(null)
    const correoAbortRef = useRef(null)
    const documentoAbortRef = useRef(null)

    // Limpieza al desmontar
    useEffect(() => {
        return () => {
            if (correoDebounceRef.current) clearTimeout(correoDebounceRef.current)
            if (documentoDebounceRef.current) clearTimeout(documentoDebounceRef.current)
            if (correoAbortRef.current) correoAbortRef.current.abort()
            if (documentoAbortRef.current) documentoAbortRef.current.abort()
        }
    }, [])

    // ==========================================
    // VALIDACIÓN ASÍNCRONA DE CORREO (DEBOUNCE 500MS)
    // ==========================================
    const checkEmailAvailability = useCallback((correoValue) => {
        if (correoDebounceRef.current) clearTimeout(correoDebounceRef.current)
        if (correoAbortRef.current) correoAbortRef.current.abort()

        const trimmed = (correoValue || '').trim()
        const syncErr = validateCorreo(trimmed)

        if (syncErr || !trimmed) {
            setValidating((prev) => ({ ...prev, correo: false }))
            setAsyncErrors((prev) => {
                const next = { ...prev }
                delete next.correo
                return next
            })
            setServerAvailability((prev) => ({ ...prev, correo: null }))
            return
        }

        setValidating((prev) => ({ ...prev, correo: true }))
        setAsyncErrors((prev) => {
            const next = { ...prev }
            delete next.correo
            return next
        })

        correoDebounceRef.current = setTimeout(async () => {
            const controller = new AbortController()
            correoAbortRef.current = controller

            try {
                const res = await AuthService.checkEmail(trimmed.toLowerCase(), controller.signal)
                const exists = res?.data?.exists ?? res?.exists ?? false

                if (exists) {
                    setAsyncErrors((prev) => ({
                        ...prev,
                        correo: 'Este correo electrónico ya está registrado.'
                    }))
                    setServerAvailability((prev) => ({ ...prev, correo: false }))
                } else {
                    setAsyncErrors((prev) => {
                        const next = { ...prev }
                        delete next.correo
                        return next
                    })
                    setServerAvailability((prev) => ({ ...prev, correo: true }))
                }
            } catch (err) {
                if (err.name === 'CanceledError' || err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
                    return
                }
                if (err.response?.status === 409) {
                    setAsyncErrors((prev) => ({
                        ...prev,
                        correo: 'Este correo electrónico ya está registrado.'
                    }))
                    setServerAvailability((prev) => ({ ...prev, correo: false }))
                } else {
                    console.warn('No se pudo verificar el correo en el servidor:', err.message)
                }
            } finally {
                setValidating((prev) => ({ ...prev, correo: false }))
            }
        }, 500)
    }, [])

    // ==========================================
    // VALIDACIÓN ASÍNCRONA DE DOCUMENTO (DEBOUNCE 500MS)
    // ==========================================
    const checkDocumentAvailability = useCallback((docValue, tipoDoc) => {
        if (documentoDebounceRef.current) clearTimeout(documentoDebounceRef.current)
        if (documentoAbortRef.current) documentoAbortRef.current.abort()

        const trimmed = (docValue || '').trim()
        const syncErr = validateDocumento(trimmed, tipoDoc)

        if (syncErr || !trimmed) {
            setValidating((prev) => ({ ...prev, documento: false }))
            setAsyncErrors((prev) => {
                const next = { ...prev }
                delete next.documento
                return next
            })
            setServerAvailability((prev) => ({ ...prev, documento: null }))
            return
        }

        setValidating((prev) => ({ ...prev, documento: true }))
        setAsyncErrors((prev) => {
            const next = { ...prev }
            delete next.documento
            return next
        })

        const normalizedTipo = normalizeTipoDocumento(tipoDoc)
        const normalizedDoc = normalizeDocumento(trimmed, normalizedTipo)

        documentoDebounceRef.current = setTimeout(async () => {
            const controller = new AbortController()
            documentoAbortRef.current = controller

            try {
                const res = await AuthService.checkDocument(normalizedDoc, controller.signal, normalizedTipo)
                const exists = res?.data?.exists ?? res?.exists ?? false

                if (exists) {
                    setAsyncErrors((prev) => ({
                        ...prev,
                        documento: 'Este número de documento ya está registrado.'
                    }))
                    setServerAvailability((prev) => ({ ...prev, documento: false }))
                } else {
                    setAsyncErrors((prev) => {
                        const next = { ...prev }
                        delete next.documento
                        return next
                    })
                    setServerAvailability((prev) => ({ ...prev, documento: true }))
                }
            } catch (err) {
                if (err.name === 'CanceledError' || err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
                    return
                }
                if (err.response?.status === 409) {
                    setAsyncErrors((prev) => ({
                        ...prev,
                        documento: 'Este número de documento ya está registrado.'
                    }))
                    setServerAvailability((prev) => ({ ...prev, documento: false }))
                } else {
                    console.warn('No se pudo verificar el documento en el servidor:', err.message)
                }
            } finally {
                setValidating((prev) => ({ ...prev, documento: false }))
            }
        }, 500)
    }, [])

    // ==========================================
    // CÁLCULO DE REQUISITOS Y FORTALEZA DE CONTRASEÑA
    // ==========================================
    const passwordRequirements = useMemo(() => {
        const pwd = form.password || ''
        return [
            { id: 'length', label: 'Mínimo 6 caracteres', valid: pwd.length >= 6 },
            { id: 'uppercase', label: 'Al menos una mayúscula (A-Z)', valid: /[A-Z]/.test(pwd) },
            { id: 'lowercase', label: 'Al menos una minúscula (a-z)', valid: /[a-z]/.test(pwd) },
            { id: 'number', label: 'Al menos un número (0-9)', valid: /\d/.test(pwd) }
        ]
    }, [form.password])

    const passwordStrength = useMemo(() => {
        const pwd = form.password || ''
        if (!pwd) return { label: '', color: 'bg-white/10', width: 'w-0', score: 0 }

        const fulfilled = passwordRequirements.filter((r) => r.valid).length

        if (fulfilled <= 1) {
            return { label: 'Muy débil', color: 'bg-rose-500', width: 'w-1/4', score: 1 }
        }
        if (fulfilled === 2) {
            return { label: 'Débil', color: 'bg-amber-500', width: 'w-2/4', score: 2 }
        }
        if (fulfilled === 3) {
            return { label: 'Aceptable', color: 'bg-[#FB9833]', width: 'w-3/4', score: 3 }
        }
        return { label: 'Fuerte y segura', color: 'bg-emerald-400', width: 'w-full', score: 4 }
    }, [form.password, passwordRequirements])

    // ==========================================
    // CAMBIO DE CAMPOS (EN TIEMPO REAL)
    // ==========================================
    const handleChange = (field) => (e) => {
        const val = e.target.value

        setForm((prev) => ({
            ...prev,
            [field]: val
        }))

        setErrorGeneral('')

        // Si se cambia la contraseña, actualizar inmediatamente la validación de confirmación
        if (field === 'password' && (touched.confirmPassword || form.confirmPassword)) {
            const confirmErr = validateConfirmPassword(form.confirmPassword, val)
            setErrors((errs) => {
                const next = { ...errs }
                if (confirmErr) next.confirmPassword = confirmErr
                else delete next.confirmPassword
                return next
            })
        }

        // Si se cambia el tipo de documento, revalidar dinámicamente el número de documento ingresado
        if (field === 'tipoDocumento') {
            setTouched((prev) => ({
                ...prev,
                tipoDocumento: true,
                ...(form.documento.trim().length > 0 ? { documento: true } : {})
            }))

            if (touched.documento || form.documento.trim().length > 0) {
                const docErr = validateDocumento(form.documento, val)
                setErrors((errs) => {
                    const next = { ...errs }
                    if (docErr) next.documento = docErr
                    else delete next.documento
                    return next
                })
                checkDocumentAvailability(form.documento, val)
            }
        }

        // Si el campo ya fue tocado o contiene valor, validar síncronamente al instante
        if (touched[field] || val.length > 0) {
            let syncErr = ''
            if (field === 'nombre') syncErr = validateNombre(val)
            else if (field === 'apellido') syncErr = validateApellido(val)
            else if (field === 'tipoDocumento') syncErr = validateTipoDocumento(val)
            else if (field === 'documento') syncErr = validateDocumento(val, form.tipoDocumento)
            else if (field === 'correo') syncErr = validateCorreo(val)
            else if (field === 'telefono') syncErr = validateTelefono(val)
            else if (field === 'direccion') syncErr = validateDireccion(val)
            else if (field === 'password') syncErr = validatePassword(val)
            else if (field === 'confirmPassword') syncErr = validateConfirmPassword(val, form.password)

            setErrors((prev) => {
                const next = { ...prev }
                if (syncErr) next[field] = syncErr
                else delete next[field]
                return next
            })
        }

        // Si es correo o documento, disparar verificación con debounce
        if (field === 'correo') {
            checkEmailAvailability(val)
        } else if (field === 'documento') {
            checkDocumentAvailability(val, form.tipoDocumento)
        }
    }

    // ==========================================
    // PERDER FOCO (ONBLUR)
    // ==========================================
    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }))

        let syncErr = ''
        if (field === 'nombre') syncErr = validateNombre(form.nombre)
        else if (field === 'apellido') syncErr = validateApellido(form.apellido)
        else if (field === 'tipoDocumento') syncErr = validateTipoDocumento(form.tipoDocumento)
        else if (field === 'documento') syncErr = validateDocumento(form.documento, form.tipoDocumento)
        else if (field === 'correo') syncErr = validateCorreo(form.correo)
        else if (field === 'telefono') syncErr = validateTelefono(form.telefono)
        else if (field === 'direccion') syncErr = validateDireccion(form.direccion)
        else if (field === 'password') syncErr = validatePassword(form.password)
        else if (field === 'confirmPassword') syncErr = validateConfirmPassword(form.confirmPassword, form.password)

        setErrors((prev) => {
            const next = { ...prev }
            if (syncErr) next[field] = syncErr
            else delete next[field]
            return next
        })

        if (field === 'correo' && !syncErr && form.correo.trim()) {
            checkEmailAvailability(form.correo)
        }
        if (field === 'documento' && !syncErr && form.documento.trim()) {
            checkDocumentAvailability(form.documento, form.tipoDocumento)
        }
    }

    // ==========================================
    // DETERMINAR ESTADO VISUAL DE CADA CAMPO
    // ==========================================
    const getFieldState = (field) => {
        const isTouched = Boolean(touched[field])
        const rawValue = (form[field] || '').toString().trim()
        const syncErr = errors[field]
        const asyncErr = asyncErrors[field]
        const isVal = validating[field] || false

        const showFeedback = isTouched || rawValue.length > 0
        const effectiveError = showFeedback ? (syncErr || asyncErr || '') : ''
        const isValid = showFeedback && !effectiveError && !isVal && rawValue.length > 0

        return {
            error: effectiveError,
            isValid,
            isValidating: isVal
        }
    }

    // ==========================================
    // VALIDACIÓN INTEGRAL PREVIA AL ENVÍO
    // ==========================================
    const validateAll = () => {
        const newErrors = {}

        const tipoDocErr = validateTipoDocumento(form.tipoDocumento)
        if (tipoDocErr) newErrors.tipoDocumento = tipoDocErr

        const documentoErr = validateDocumento(form.documento, form.tipoDocumento)
        if (documentoErr) newErrors.documento = documentoErr

        const nombreErr = validateNombre(form.nombre)
        if (nombreErr) newErrors.nombre = nombreErr

        const apellidoErr = validateApellido(form.apellido)
        if (apellidoErr) newErrors.apellido = apellidoErr

        const correoErr = validateCorreo(form.correo)
        if (correoErr) newErrors.correo = correoErr

        const telefonoErr = validateTelefono(form.telefono)
        if (telefonoErr) newErrors.telefono = telefonoErr

        const direccionErr = validateDireccion(form.direccion)
        if (direccionErr) newErrors.direccion = direccionErr

        const passwordErr = validatePassword(form.password)
        if (passwordErr) newErrors.password = passwordErr

        const confirmErr = validateConfirmPassword(form.confirmPassword, form.password)
        if (confirmErr) newErrors.confirmPassword = confirmErr

        setErrors(newErrors)

        // Marcar todos como tocados
        setTouched({
            tipoDocumento: true,
            documento: true,
            nombre: true,
            apellido: true,
            correo: true,
            telefono: true,
            direccion: true,
            password: true,
            confirmPassword: true
        })

        const hasSyncErrors = Object.keys(newErrors).length > 0
        const hasAsyncErrors = Boolean(asyncErrors.correo || asyncErrors.documento)

        return !hasSyncErrors && !hasAsyncErrors
    }

    // Comprobar si el botón debe estar deshabilitado
    const isFormIncompleteOrInvalid = useMemo(() => {
        const hasEmptyFields =
            !form.tipoDocumento ||
            !form.documento.trim() ||
            !form.nombre.trim() ||
            !form.apellido.trim() ||
            !form.correo.trim() ||
            !form.telefono.trim() ||
            !form.direccion.trim() ||
            !form.password ||
            !form.confirmPassword

        const hasInvalidDocument =
            Boolean(validateTipoDocumento(form.tipoDocumento)) ||
            Boolean(validateDocumento(form.documento, form.tipoDocumento))

        const hasSyncErrors = Object.values(errors).some(Boolean) || hasInvalidDocument
        const hasAsyncErrors = Boolean(asyncErrors.correo || asyncErrors.documento)
        const isVerifying = validating.correo || validating.documento

        return hasEmptyFields || hasSyncErrors || hasAsyncErrors || isVerifying || loading
    }, [form, errors, asyncErrors, validating, loading])

    // ==========================================
    // REGISTRAR CLIENTE (SUBMIT)
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) {
            return
        }

        setErrorGeneral('')

        if (validating.correo || validating.documento) {
            addAlert({
                type: 'warning',
                title: 'Comprobaciones pendientes',
                message: 'Por favor espera a que finalice la verificación de tus datos.'
            })
            return
        }

        const isValid = validateAll()
        if (!isValid) {
            addAlert({
                type: 'warning',
                title: 'Campos requeridos o inválidos',
                message: 'Por favor revisa y corrige los campos marcados en rojo antes de continuar.'
            })
            return
        }

        setLoading(true)

        try {
            const tipoNormalizado = normalizeTipoDocumento(form.tipoDocumento)
            const documentoNormalizado = normalizeDocumento(form.documento, tipoNormalizado)

            const datos = {
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                tipoDocumento: tipoNormalizado,
                documento: documentoNormalizado,
                correo: form.correo.trim().toLowerCase(),
                password: form.password,
                telefono: form.telefono.trim(),
                direccion: form.direccion.trim()
            }

            await AuthService.register(datos)

            addAlert({
                type: 'success',
                title: '¡Registro exitoso!',
                message: 'Tu cuenta ha sido creada. Serás redirigido al inicio de sesión.'
            })

            setSuccess(true)

            setTimeout(() => {
                navigate('/login')
            }, 2300)
        } catch (error) {
            console.error('Error registrando cliente:', error)

            const status = error.response?.status
            const mensajeServidor =
                error.response?.data?.message ||
                'No fue posible completar el registro. Intenta nuevamente.'

            setErrorGeneral(mensajeServidor)

            // Manejo de duplicados del servidor (409) o validaciones de backend (400)
            if (status === 409 || mensajeServidor.toLowerCase().includes('ya existe')) {
                if (mensajeServidor.toLowerCase().includes('correo')) {
                    setAsyncErrors((prev) => ({
                        ...prev,
                        correo: 'Este correo electrónico ya está registrado.'
                    }))
                    setTouched((prev) => ({ ...prev, correo: true }))
                } else if (mensajeServidor.toLowerCase().includes('documento')) {
                    setAsyncErrors((prev) => ({
                        ...prev,
                        documento: 'Este número de documento ya está registrado.'
                    }))
                    setTouched((prev) => ({ ...prev, documento: true }))
                }
            } else if (Array.isArray(error.response?.data?.errors)) {
                const backendErrors = {}
                const touchedFields = {}
                error.response.data.errors.forEach((err) => {
                    if (err.campo && !backendErrors[err.campo]) {
                        backendErrors[err.campo] = err.mensaje
                        touchedFields[err.campo] = true
                    }
                })
                setErrors((prev) => ({ ...prev, ...backendErrors }))
                setTouched((prev) => ({ ...prev, ...touchedFields }))
            }

            addAlert({
                type: 'error',
                title: 'Error al registrar',
                message: mensajeServidor
            })
        } finally {
            setLoading(false)
        }
    }

    // Estados visuales por campo
    const tipoDocState = getFieldState('tipoDocumento')
    const documentoState = getFieldState('documento')
    const nombreState = getFieldState('nombre')
    const apellidoState = getFieldState('apellido')
    const correoState = getFieldState('correo')
    const telefonoState = getFieldState('telefono')
    const direccionState = getFieldState('direccion')
    const passwordState = getFieldState('password')
    const confirmPasswordState = getFieldState('confirmPassword')

    // ==========================================
    // PANTALLA DE ÉXITO
    // ==========================================
    if (success) {
        return (
            <AuthLayout
                image={loginBackground}
                eyebrow="Mi Conductor"
                imageSide="right"
            >
                <PushAlertContainer alerts={alerts} onDismiss={removeAlert} />

                <div className="flex flex-col items-center gap-4 text-center py-8 animate-fadeIn">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20 animate-bounce">
                        <CheckIcon />
                    </div>

                    <h2 className="font-display text-2xl font-bold text-[#FCEFEF]">
                        ¡Cuenta creada exitosamente!
                    </h2>

                    <p className="max-w-sm text-sm text-[#FCEFEF]/70">
                        Tu registro como cliente en Mi Conductor ha sido completado. Serás redirigido al inicio de sesión en unos momentos.
                    </p>

                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/10 mt-2">
                        <div className="h-full w-full animate-pulse rounded-full bg-[#FB9833]" />
                    </div>

                    <Link
                        to="/login"
                        className="mt-4 text-sm font-semibold text-[#1B768E] hover:text-[#FB9833] transition-colors"
                    >
                        Ir al inicio de sesión ahora →
                    </Link>
                </div>
            </AuthLayout>
        )
    }

    // ==========================================
    // FORMULARIO PRINCIPAL
    // ==========================================
    return (
        <AuthLayout
            image={loginBackground}
            eyebrow="Mi Conductor"
            imageSide="right"
        >
            {/* Contenedor flotante de notificaciones toast */}
            <PushAlertContainer alerts={alerts} onDismiss={removeAlert} />

            <header>
                <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">
                    Crear cuenta
                </h2>
                <p className="mt-1 text-sm text-[#FCEFEF]/60">
                    Completa tus datos para registrarte como cliente. Todos los campos son obligatorios.
                </p>
            </header>

            {/* Alerta general del formulario */}
            {errorGeneral && (
                <div
                    className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300 flex items-start gap-2.5"
                    role="alert"
                >
                    <svg className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errorGeneral}</span>
                </div>
            )}

            <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* 1. TIPO DE DOCUMENTO Y 2. NÚMERO DE DOCUMENTO */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* TIPO DE DOCUMENTO */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="tipoDocumento"
                            className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#FCEFEF]/60"
                        >
                            <span>
                                Tipo de documento
                                <span className="ml-1 text-rose-400">*</span>
                            </span>
                        </label>
                        <div
                            className={`flex items-center gap-3 rounded-xl border bg-[#04141f] px-4 py-3 transition focus-within:ring-2 ${
                                tipoDocState.error
                                    ? 'border-rose-500/70 focus-within:ring-rose-500/30'
                                    : tipoDocState.isValid
                                    ? 'border-emerald-500/60 focus-within:ring-emerald-500/20'
                                    : 'border-white/10 focus-within:border-[#1B768E] focus-within:ring-[#1B768E]/30'
                            }`}
                        >
                            <span className="shrink-0 text-[#1B768E]">
                                <IdCardIcon />
                            </span>
                            <select
                                id="tipoDocumento"
                                value={form.tipoDocumento}
                                onChange={handleChange('tipoDocumento')}
                                onBlur={() => handleBlur('tipoDocumento')}
                                className="w-full bg-transparent text-sm text-[#FCEFEF] outline-none cursor-pointer [&>option]:bg-[#04141f] [&>option]:text-[#FCEFEF]"
                            >
                                {DOCUMENT_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {tipoDocState.error && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400" role="alert">
                                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{tipoDocState.error}</span>
                            </p>
                        )}
                    </div>

                    {/* NÚMERO DE DOCUMENTO */}
                    <FormField
                        id="documento"
                        label="Número de documento"
                        requiredMark
                        icon={<IdCardIcon />}
                        type="text"
                        placeholder={form.tipoDocumento === 'PA' ? 'Ej: AB123456' : 'Ej: 1020304050'}
                        value={form.documento}
                        onChange={handleChange('documento')}
                        onBlur={() => handleBlur('documento')}
                        error={documentoState.error}
                        isValid={documentoState.isValid}
                        isValidating={documentoState.isValidating}
                        action={
                            serverAvailability.documento === true && !documentoState.error && !documentoState.isValidating ? (
                                <span className="text-[11px] font-medium text-emerald-400 shrink-0" title="Documento disponible">
                                    Disponible
                                </span>
                            ) : null
                        }
                    />
                </div>

                {/* NOMBRES Y APELLIDOS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        id="nombre"
                        label="Nombres"
                        requiredMark
                        icon={<UserIcon />}
                        type="text"
                        placeholder="Ej: Carlos Eduardo"
                        autoComplete="given-name"
                        value={form.nombre}
                        onChange={handleChange('nombre')}
                        onBlur={() => handleBlur('nombre')}
                        error={nombreState.error}
                        isValid={nombreState.isValid}
                    />

                    <FormField
                        id="apellido"
                        label="Apellidos"
                        requiredMark
                        icon={<UserIcon />}
                        type="text"
                        placeholder="Ej: Pérez Gómez"
                        autoComplete="family-name"
                        value={form.apellido}
                        onChange={handleChange('apellido')}
                        onBlur={() => handleBlur('apellido')}
                        error={apellidoState.error}
                        isValid={apellidoState.isValid}
                    />
                </div>

                {/* CORREO ELECTRÓNICO */}
                <FormField
                    id="correo"
                    label="Correo electrónico"
                    requiredMark
                    icon={<MailIcon />}
                    type="email"
                    placeholder="nombre@correo.com"
                    autoComplete="email"
                    value={form.correo}
                    onChange={handleChange('correo')}
                    onBlur={() => handleBlur('correo')}
                    error={correoState.error}
                    isValid={correoState.isValid}
                    isValidating={correoState.isValidating}
                    action={
                        serverAvailability.correo === true && !correoState.error && !correoState.isValidating ? (
                            <span className="text-[11px] font-medium text-emerald-400 shrink-0" title="Correo disponible">
                                Disponible
                            </span>
                        ) : null
                    }
                />

                {/* TELÉFONO Y DIRECCIÓN */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                        id="telefono"
                        label="Teléfono"
                        requiredMark
                        icon={<PhoneIcon />}
                        type="tel"
                        placeholder="Ej: 3001234567"
                        autoComplete="tel"
                        value={form.telefono}
                        onChange={handleChange('telefono')}
                        onBlur={() => handleBlur('telefono')}
                        error={telefonoState.error}
                        isValid={telefonoState.isValid}
                    />

                    <FormField
                        id="direccion"
                        label="Dirección"
                        requiredMark
                        icon={<MapPinIcon />}
                        type="text"
                        placeholder="Ej: Calle 10 # 20-30"
                        autoComplete="street-address"
                        value={form.direccion}
                        onChange={handleChange('direccion')}
                        onBlur={() => handleBlur('direccion')}
                        error={direccionState.error}
                        isValid={direccionState.isValid}
                    />
                </div>

                {/* CONTRASEÑA */}
                <div>
                    <FormField
                        id="password"
                        label="Contraseña"
                        requiredMark
                        icon={<LockIcon />}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange('password')}
                        onBlur={() => {
                            handleBlur('password')
                            setIsPasswordFocused(false)
                        }}
                        onFocus={() => setIsPasswordFocused(true)}
                        error={passwordState.error}
                        isValid={passwordState.isValid}
                        action={
                            <button
                                type="button"
                                className="shrink-0 text-[#FCEFEF]/50 transition hover:text-[#FB9833]"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                <EyeIcon open={showPassword} />
                            </button>
                        }
                    />

                    {/* INDICADOR INTERACTIVO DE REQUISITOS Y FORTALEZA DE CONTRASEÑA */}
                    {(isPasswordFocused || form.password.length > 0) && (
                        <div className="mt-2.5 rounded-xl border border-white/10 bg-[#04141f]/70 p-3.5 transition-all animate-fadeIn">
                            {/* Barra de progreso de fortaleza */}
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="text-[#FCEFEF]/60">Seguridad:</span>
                                <span className="font-semibold text-[#FCEFEF]">
                                    {passwordStrength.label || 'Ingresa tu contraseña'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                <div
                                    className={`h-full transition-all duration-300 rounded-full ${passwordStrength.color} ${passwordStrength.width}`}
                                />
                            </div>

                            {/* Checklist de requisitos de seguridad */}
                            <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-xs">
                                {passwordRequirements.map((req) => (
                                    <div
                                        key={req.id}
                                        className={`flex items-center gap-2 transition-colors ${
                                            req.valid ? 'text-emerald-400 font-medium' : 'text-[#FCEFEF]/40'
                                        }`}
                                    >
                                        <span
                                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                                                req.valid
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-white/5 text-[#FCEFEF]/30'
                                            }`}
                                        >
                                            {req.valid ? '✓' : '○'}
                                        </span>
                                        <span>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CONFIRMAR CONTRASEÑA */}
                <FormField
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    requiredMark
                    icon={<LockIcon />}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onBlur={() => handleBlur('confirmPassword')}
                    error={confirmPasswordState.error}
                    isValid={confirmPasswordState.isValid}
                    action={
                        <button
                            type="button"
                            className="shrink-0 text-[#FCEFEF]/50 transition hover:text-[#FB9833]"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            <EyeIcon open={showConfirmPassword} />
                        </button>
                    }
                />

                {/* BOTÓN REGISTRARSE */}
                <button
                    type="submit"
                    id="btn-registrarse"
                    disabled={isFormIncompleteOrInvalid}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#FB9833] py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition-all hover:bg-[#e2872c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                    {loading ? (
                        <>
                            <svg className="h-4 w-4 animate-spin text-[#012538]" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span>Creando cuenta...</span>
                        </>
                    ) : validating.correo || validating.documento ? (
                        <>
                            <svg className="h-4 w-4 animate-spin text-[#012538]" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span>Verificando disponibilidad...</span>
                        </>
                    ) : (
                        <span>Crear cuenta</span>
                    )}
                </button>
            </form>

            <footer className="mt-6 text-center text-sm text-[#FCEFEF]/60">
                ¿Ya tienes una cuenta?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-[#1B768E] transition hover:text-[#FB9833]"
                >
                    Iniciar sesión
                </Link>
            </footer>
        </AuthLayout>
    )
}
