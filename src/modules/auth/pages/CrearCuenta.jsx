import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
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
    IdCardIcon,
    CalendarIcon
} from './icons'

import AuthService from '../services/authService'
import {
    NAME_REGEX,
    FIELD_LIMITS,
    DOCUMENT_RULES,
    CLIENT_DOCUMENT_TYPE_OPTIONS,
    normalizeTipoDocumento,
    normalizeDocumento,
    validateTipoDocumento,
    validateDocumento,
    validateCorreo,
    validateFechaNacimiento,
    getTodayIsoDate,
    validateTelefonoColombiano,
    validateDireccionColombiana,
    getPasswordRequirements,
    validateRegistrationPassword
} from '../../../utils/validators'

// ==========================================
// REGLAS Y FUNCIONES DE VALIDACIÓN PURAS
// ==========================================

function validateNombre(val) {
    const trimmed = (val || '').trim()
    if (!trimmed) {
        return 'El nombre es obligatorio.'
    }
    if (trimmed.length < FIELD_LIMITS.nombre.min) {
        return `El nombre debe tener al menos ${FIELD_LIMITS.nombre.min} caracteres.`
    }
    if (trimmed.length > FIELD_LIMITS.nombre.max) {
        return `El nombre no puede superar los ${FIELD_LIMITS.nombre.max} caracteres.`
    }
    if (!NAME_REGEX.test(trimmed)) {
        return 'Solo letras, tildes y espacios.'
    }
    return ''
}

function validateApellido(val) {
    const trimmed = (val || '').trim()
    if (!trimmed) {
        return 'El apellido es obligatorio.'
    }
    if (trimmed.length < FIELD_LIMITS.apellido.min) {
        return `El apellido debe tener al menos ${FIELD_LIMITS.apellido.min} caracteres.`
    }
    if (trimmed.length > FIELD_LIMITS.apellido.max) {
        return `El apellido no puede superar los ${FIELD_LIMITS.apellido.max} caracteres.`
    }
    if (!NAME_REGEX.test(trimmed)) {
        return 'Solo letras, tildes y espacios.'
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
    const todayIso = useMemo(() => getTodayIsoDate(), [])

    const [form, setForm] = useState({
        tipoDocumento: 'CC',
        documento: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: '',
        confirmPassword: ''
    })

    const [aceptaTerminos, setAceptaTerminos] = useState(false)
    const [termsTouched, setTermsTouched] = useState(false)

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

    useEffect(() => {
        return () => {
            if (correoDebounceRef.current) clearTimeout(correoDebounceRef.current)
            if (documentoDebounceRef.current) clearTimeout(documentoDebounceRef.current)
            if (correoAbortRef.current) correoAbortRef.current.abort()
            if (documentoAbortRef.current) documentoAbortRef.current.abort()
        }
    }, [])

    const currentDocRule = useMemo(() => {
        const norm = normalizeTipoDocumento(form.tipoDocumento)
        return DOCUMENT_RULES[norm] || DOCUMENT_RULES.CC
    }, [form.tipoDocumento])

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
    const passwordRequirements = useMemo(
        () => getPasswordRequirements(form.password),
        [form.password]
    )

    const passwordStrength = useMemo(() => {
        const pwd = form.password || ''
        if (!pwd) return { label: 'Sin evaluar', color: 'bg-white/10', width: 'w-0', score: 0 }

        const fulfilled = passwordRequirements.filter((r) => r.valid).length
        const hasSpaces = /\s/.test(pwd)

        if (fulfilled <= 1 || hasSpaces) {
            return { label: 'Muy débil', color: 'bg-rose-500', width: 'w-1/5', score: 1 }
        }
        if (fulfilled === 2) {
            return { label: 'Débil', color: 'bg-rose-400', width: 'w-2/5', score: 2 }
        }
        if (fulfilled === 3) {
            return { label: 'Media', color: 'bg-amber-500', width: 'w-3/5', score: 3 }
        }
        if (fulfilled === 4) {
            return { label: 'Casi lista', color: 'bg-[#FB9833]', width: 'w-4/5', score: 4 }
        }
        return { label: 'Segura', color: 'bg-emerald-400 [.auth-light_&]:bg-[#1B768E]', width: 'w-full', score: 5 }
    }, [form.password, passwordRequirements])

    const runSyncValidation = (field, value, nextForm = form) => {
        if (field === 'nombre') return validateNombre(value)
        if (field === 'apellido') return validateApellido(value)
        if (field === 'tipoDocumento') return validateTipoDocumento(value)
        if (field === 'documento') return validateDocumento(value, nextForm.tipoDocumento)
        if (field === 'correo') return validateCorreo(value)
        if (field === 'fechaNacimiento') return validateFechaNacimiento(value)
        if (field === 'telefono') return validateTelefonoColombiano(value)
        if (field === 'direccion') return validateDireccionColombiana(value)
        if (field === 'password') return validateRegistrationPassword(value)
        if (field === 'confirmPassword') return validateConfirmPassword(value, nextForm.password)
        return ''
    }

    // ==========================================
    // CAMBIO DE CAMPOS (EN TIEMPO REAL CON LÍMITES ESTRICTOS)
    // ==========================================
    const handleChange = (field) => (e) => {
        let val = e.target.value

        // Aplicar límites estrictos y saneamiento según tipo de campo
        if (field === 'nombre') {
            val = val.slice(0, FIELD_LIMITS.nombre.max)
        } else if (field === 'apellido') {
            val = val.slice(0, FIELD_LIMITS.apellido.max)
        } else if (field === 'correo') {
            val = val.slice(0, FIELD_LIMITS.correo.max)
        } else if (field === 'telefono') {
            val = val.replace(/\D/g, '').slice(0, FIELD_LIMITS.telefono.max)
        } else if (field === 'direccion') {
            val = val.slice(0, FIELD_LIMITS.direccion.max)
        } else if (field === 'password' || field === 'confirmPassword') {
            val = val.slice(0, FIELD_LIMITS.password.max)
        } else if (field === 'documento') {
            const rule = currentDocRule
            if (rule.numericOnly) {
                val = val.replace(/\D/g, '').slice(0, rule.maxLength)
            } else {
                val = val.replace(/[^0-9A-Za-z]/g, '').toUpperCase().slice(0, rule.maxLength)
            }
        }

        const updatedForm = { ...form, [field]: val }

        // Si se cambia el tipo de documento, recortar documento si excede el nuevo máximo
        if (field === 'tipoDocumento') {
            const nextRule = DOCUMENT_RULES[normalizeTipoDocumento(val)] || DOCUMENT_RULES.CC
            let adjustedDoc = form.documento
            if (nextRule.numericOnly) {
                adjustedDoc = adjustedDoc.replace(/\D/g, '').slice(0, nextRule.maxLength)
            } else {
                adjustedDoc = adjustedDoc.replace(/[^0-9A-Za-z]/g, '').toUpperCase().slice(0, nextRule.maxLength)
            }
            updatedForm.documento = adjustedDoc
        }

        setForm(updatedForm)
        setErrorGeneral('')

        if (field === 'password' && (touched.confirmPassword || updatedForm.confirmPassword)) {
            const confirmErr = validateConfirmPassword(updatedForm.confirmPassword, val)
            setErrors((errs) => {
                const next = { ...errs }
                if (confirmErr) next.confirmPassword = confirmErr
                else delete next.confirmPassword
                return next
            })
        }

        if (field === 'tipoDocumento') {
            setTouched((prev) => ({
                ...prev,
                tipoDocumento: true,
                ...(updatedForm.documento.trim().length > 0 ? { documento: true } : {})
            }))

            if (touched.documento || updatedForm.documento.trim().length > 0) {
                const docErr = validateDocumento(updatedForm.documento, val)
                setErrors((errs) => {
                    const next = { ...errs }
                    if (docErr) next.documento = docErr
                    else delete next.documento
                    return next
                })
                checkDocumentAvailability(updatedForm.documento, val)
            }
        }

        if (touched[field] || val.length > 0) {
            const syncErr = runSyncValidation(field, val, updatedForm)
            setErrors((prev) => {
                const next = { ...prev }
                if (syncErr) next[field] = syncErr
                else delete next[field]
                return next
            })
        }

        if (field === 'correo') {
            checkEmailAvailability(val)
        } else if (field === 'documento') {
            checkDocumentAvailability(val, updatedForm.tipoDocumento)
        }
    }

    // ==========================================
    // PERDER FOCO (ONBLUR)
    // ==========================================
    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }))

        const syncErr = runSyncValidation(field, form[field], form)
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

        const fieldsToValidate = [
            'tipoDocumento',
            'documento',
            'nombre',
            'apellido',
            'correo',
            'fechaNacimiento',
            'telefono',
            'direccion',
            'password',
            'confirmPassword'
        ]

        fieldsToValidate.forEach((f) => {
            const err = runSyncValidation(f, form[f], form)
            if (err) newErrors[f] = err
        })

        setErrors(newErrors)

        setTouched({
            tipoDocumento: true,
            documento: true,
            nombre: true,
            apellido: true,
            fechaNacimiento: true,
            correo: true,
            telefono: true,
            direccion: true,
            password: true,
            confirmPassword: true
        })
        setTermsTouched(true)

        const hasSyncErrors = Object.keys(newErrors).length > 0
        const hasAsyncErrors = Boolean(asyncErrors.correo || asyncErrors.documento)

        return !hasSyncErrors && !hasAsyncErrors && aceptaTerminos
    }

    // Comprobar si el botón debe estar deshabilitado
    const isFormIncompleteOrInvalid = useMemo(() => {
        const hasEmptyFields =
            !form.tipoDocumento ||
            !form.documento.trim() ||
            !form.nombre.trim() ||
            !form.apellido.trim() ||
            !form.fechaNacimiento() ||
            !form.correo.trim() ||
            !form.telefono.trim() ||
            !form.direccion.trim() ||
            !form.password ||
            !form.confirmPassword ||
            !aceptaTerminos

        if (hasEmptyFields) return true

        const hasDirectErrors =
            Boolean(validateTipoDocumento(form.tipoDocumento)) ||
            Boolean(validateDocumento(form.documento, form.tipoDocumento)) ||
            Boolean(validateNombre(form.nombre)) ||
            Boolean(validateApellido(form.apellido)) ||
            Boolean(validateCorreo(form.correo)) ||
            Boolean(validateFechaNacimiento(form.fechaNacimiento)) ||
            Boolean(validateTelefonoColombiano(form.telefono)) ||
            Boolean(validateDireccionColombiana(form.direccion)) ||
            Boolean(validateRegistrationPassword(form.password)) ||
            Boolean(validateConfirmPassword(form.confirmPassword, form.password))

        const hasSyncErrors = Object.values(errors).some(Boolean) || hasDirectErrors
        const hasAsyncErrors = Boolean(asyncErrors.correo || asyncErrors.documento)
        const isVerifying = validating.correo || validating.documento

        return hasSyncErrors || hasAsyncErrors || isVerifying || loading
    }, [form, aceptaTerminos, errors, asyncErrors, validating, loading])

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
                title: 'Revisa el formulario',
                message: !aceptaTerminos
                    ? 'Debes aceptar los términos y condiciones y la política de tratamiento de datos personales.'
                    : 'Por favor revisa y corrige los campos marcados en rojo antes de continuar.'
            })
            return
        }

        setLoading(true)

        try {
            const tipoNormalizado = normalizeTipoDocumento(form.tipoDocumento)
            const documentoNormalizado = normalizeDocumento(form.documento, tipoNormalizado)

            const datos = {
                tipoDocumento: tipoNormalizado,
                documento: documentoNormalizado,
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                fechaNacimiento: form.fechaNacimiento,
                correo: form.correo.trim().toLowerCase(),
                password: form.password,
                telefono: form.telefono.trim(),
                direccion: form.direccion.trim(),
                aceptaTerminos: true,
                fechaAceptacionTerminos: new Date().toISOString()
            }

            await AuthService.register(datos)

            addAlert({
                type: 'success',
                title: '¡Registro exitoso!',
                message: 'Tu cuenta ha sido creada. Instala la aplicación móvil para iniciar sesión.'
            })

            setSuccess(true)
        } catch (error) {
            console.error('Error registrando cliente:', error)

            const status = error.response?.status
            const mensajeServidor =
                error.response?.data?.message ||
                'No fue posible completar el registro. Intenta nuevamente.'

            setErrorGeneral(mensajeServidor)

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
    const fechaNacimientoState = getFieldState('fechaNacimiento')
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

                <div className="flex flex-col items-center gap-5 text-center py-6 animate-fadeIn">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 [.auth-light_&]:bg-[#1B768E]/15 [.auth-light_&]:text-[#1B768E] shadow-lg shadow-emerald-500/20 [.auth-light_&]:shadow-[#1B768E]/15">
                        <CheckIcon />
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-display text-2xl font-bold text-[#FCEFEF] [.auth-light_&]:text-[#012538]">
                            ¡Cuenta creada exitosamente!
                        </h2>
                        <p className="max-w-md text-sm text-[#FCEFEF]/70 [.auth-light_&]:text-[#4D555B]">
                            Tu registro como cliente en <span className="font-semibold text-[#FCEFEF] [.auth-light_&]:text-[#012538]">Mi Conductor</span> ha sido completado.
                        </p>
                    </div>

                    <div className="w-full rounded-2xl border border-[#1B768E]/35 bg-[#012538]/70 [.auth-light_&]:border-[#1B768E]/25 [.auth-light_&]:bg-white p-5 text-left shadow-lg shadow-black/20 [.auth-light_&]:shadow-[#012538]/5">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FB9833]/15 text-[#FB9833] [.auth-light_&]:bg-[#FB9833]/20 [.auth-light_&]:text-[#012538]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-6 w-6"
                                >
                                    <rect x="6" y="2" width="12" height="20" rx="2.5" />
                                    <line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-[#FCEFEF] [.auth-light_&]:text-[#012538]">
                                    Instala la aplicación para iniciar sesión
                                </p>
                                <p className="text-xs leading-relaxed text-[#FCEFEF]/70 [.auth-light_&]:text-[#4D555B]">
                                    Para iniciar sesión con tu cuenta de cliente y solicitar tus servicios, debes descargar e instalar la aplicación móvil de Mi Conductor en tu dispositivo.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex w-full flex-col gap-3">
                        <Link
                            to="/"
                            className="w-full rounded-xl bg-[#FB9833] py-3 text-center text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c] active:scale-[0.99]"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    // ==========================================
    // FORMULARIO PRINCIPAL (COMPACTO SIN SCROLL)
    // ==========================================
    return (
        <AuthLayout
            image={loginBackground}
            eyebrow="Mi Conductor"
            imageSide="right"
            compact
        >
            <PushAlertContainer alerts={alerts} onDismiss={removeAlert} />

            <header className="mb-3">
                <h2 className="font-display text-xl font-semibold text-[#FCEFEF] [.auth-light_&]:text-[#012538]">
                    Crear cuenta
                </h2>
                <p className="mt-0.5 text-xs text-[#FCEFEF]/60 [.auth-light_&]:text-[#4D555B]">
                    Completa tus datos para registrarte como cliente. Todos los campos son obligatorios.
                </p>
            </header>

            {errorGeneral && (
                <div
                    className="mb-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 [.auth-light_&]:border-rose-500/30 [.auth-light_&]:bg-white/85 [.auth-light_&]:text-rose-600 px-3 py-2 text-xs flex items-start gap-2"
                    role="alert"
                >
                    <svg className="h-4 w-4 shrink-0 text-rose-400 [.auth-light_&]:text-rose-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{errorGeneral}</span>
                </div>
            )}

            <form
                className="flex flex-col gap-2.5"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* 1. TIPO DE DOCUMENTO Y NÚMERO DE DOCUMENTO */}
                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
                    <div className="flex flex-col">
                        <label
                            htmlFor="tipoDocumento"
                            className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#FCEFEF]/60 [.auth-light_&]:text-[#012538]/85"
                        >
                            <span>
                                Tipo de documento
                                <span className="ml-1 text-rose-400 [.auth-light_&]:text-[#FB9833]">*</span>
                            </span>
                        </label>
                        <div
                            className={`flex items-center gap-2 rounded-xl border bg-[#04141f] [.auth-light_&]:bg-white px-3 py-2 transition focus-within:ring-2 ${
                                tipoDocState.error
                                    ? 'border-rose-500/70 focus-within:ring-rose-500/30'
                                    : tipoDocState.isValid
                                    ? 'border-emerald-500/60 focus-within:ring-emerald-500/20 [.auth-light_&]:border-[#1B768E]'
                                    : 'border-white/10 [.auth-light_&]:border-[#4D555B]/25 focus-within:border-[#1B768E] focus-within:ring-[#1B768E]/30'
                            }`}
                        >
                            <span className="shrink-0 text-[#1B768E]">
                                <IdCardIcon className="h-4 w-4" />
                            </span>
                            <select
                                id="tipoDocumento"
                                value={form.tipoDocumento}
                                onChange={handleChange('tipoDocumento')}
                                onBlur={() => handleBlur('tipoDocumento')}
                                className="w-full bg-transparent text-[13px] text-[#FCEFEF] [.auth-light_&]:text-[#012538] outline-none cursor-pointer [&>option]:bg-[#04141f] [&>option]:text-[#FCEFEF] [.auth-light_&]:[&>option]:bg-white [.auth-light_&]:[&>option]:text-[#012538]"
                            >
                                {CLIENT_DOCUMENT_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {tipoDocState.error && (
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] leading-tight text-rose-400 [.auth-light_&]:text-rose-600" role="alert">
                                <span>{tipoDocState.error}</span>
                            </p>
                        )}
                    </div>

                    <FormField
                        compact
                        id="documento"
                        label="Número de documento"
                        requiredMark
                        icon={<IdCardIcon className="h-4 w-4" />}
                        type="text"
                        inputMode={currentDocRule.numericOnly ? 'numeric' : 'text'}
                        maxLength={currentDocRule.maxLength}
                        placeholder={form.tipoDocumento === 'PA' ? 'Ej: AB123456' : 'Ej: 1020304050'}
                        value={form.documento}
                        onChange={handleChange('documento')}
                        onBlur={() => handleBlur('documento')}
                        error={documentoState.error}
                        isValid={documentoState.isValid}
                        isValidating={documentoState.isValidating}
                        action={
                            serverAvailability.documento === true && !documentoState.error && !documentoState.isValidating ? (
                                <span className="text-[10px] font-medium text-emerald-400 [.auth-light_&]:text-[#1B768E] shrink-0" title="Documento disponible">
                                    OK
                                </span>
                            ) : null
                        }
                    />
                </div>

                {/* 2. NOMBRES Y APELLIDOS */}
                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
                    <FormField
                        compact
                        id="nombre"
                        label="Nombres"
                        requiredMark
                        icon={<UserIcon className="h-4 w-4" />}
                        type="text"
                        maxLength={FIELD_LIMITS.nombre.max}
                        placeholder="Ej: Carlos Eduardo"
                        autoComplete="given-name"
                        value={form.nombre}
                        onChange={handleChange('nombre')}
                        onBlur={() => handleBlur('nombre')}
                        error={nombreState.error}
                        isValid={nombreState.isValid}
                    />

                    <FormField
                        compact
                        id="apellido"
                        label="Apellidos"
                        requiredMark
                        icon={<UserIcon className="h-4 w-4" />}
                        type="text"
                        maxLength={FIELD_LIMITS.apellido.max}
                        placeholder="Ej: Pérez Gómez"
                        autoComplete="family-name"
                        value={form.apellido}
                        onChange={handleChange('apellido')}
                        onBlur={() => handleBlur('apellido')}
                        error={apellidoState.error}
                        isValid={apellidoState.isValid}
                    />
                </div>

                {/* 3. CORREO ELECTRÓNICO Y FECHA DE NACIMIENTO (INMEDIATAMENTE DESPUÉS) */}
                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
                    <FormField
                        compact
                        id="correo"
                        label="Correo electrónico"
                        requiredMark
                        icon={<MailIcon className="h-4 w-4" />}
                        type="email"
                        maxLength={FIELD_LIMITS.correo.max}
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
                                <span className="text-[10px] font-medium text-emerald-400 [.auth-light_&]:text-[#1B768E] shrink-0" title="Correo disponible">
                                    OK
                                </span>
                            ) : null
                        }
                    />

                    <FormField
                        compact
                        id="fechaNacimiento"
                        label="Fecha de nacimiento"
                        requiredMark
                        icon={<CalendarIcon className="h-4 w-4" />}
                        type="date"
                        min="1900-01-01"
                        max={todayIso}
                        value={form.fechaNacimiento}
                        onChange={handleChange('fechaNacimiento')}
                        onBlur={() => handleBlur('fechaNacimiento')}
                        error={fechaNacimientoState.error}
                        isValid={fechaNacimientoState.isValid}
                    />
                </div>

                {/* 4. TELÉFONO Y DIRECCIÓN */}
                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
                    <FormField
                        compact
                        id="telefono"
                        label="Teléfono celular"
                        requiredMark
                        icon={<PhoneIcon className="h-4 w-4" />}
                        type="tel"
                        inputMode="numeric"
                        maxLength={FIELD_LIMITS.telefono.max}
                        placeholder="Ej: 3001234567"
                        autoComplete="tel"
                        value={form.telefono}
                        onChange={handleChange('telefono')}
                        onBlur={() => handleBlur('telefono')}
                        error={telefonoState.error}
                        isValid={telefonoState.isValid}
                    />

                    <FormField
                        compact
                        id="direccion"
                        label="Dirección"
                        requiredMark
                        icon={<MapPinIcon className="h-4 w-4" />}
                        type="text"
                        maxLength={FIELD_LIMITS.direccion.max}
                        placeholder="Ej: Calle 10 # 20-30"
                        autoComplete="street-address"
                        value={form.direccion}
                        onChange={handleChange('direccion')}
                        onBlur={() => handleBlur('direccion')}
                        error={direccionState.error}
                        isValid={direccionState.isValid}
                    />
                </div>

                {/* 5. CONTRASEÑA Y CONFIRMAR CONTRASEÑA */}
                <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2">
                    <FormField
                        compact
                        id="password"
                        label="Contraseña"
                        requiredMark
                        icon={<LockIcon className="h-4 w-4" />}
                        type={showPassword ? 'text' : 'password'}
                        maxLength={FIELD_LIMITS.password.max}
                        placeholder="Mín. 8 caracteres"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleChange('password')}
                        onBlur={() => handleBlur('password')}
                        error={passwordState.error}
                        isValid={passwordState.isValid}
                        action={
                            <button
                                type="button"
                                className="shrink-0 text-[#FCEFEF]/50 [.auth-light_&]:text-[#4D555B]/75 transition hover:text-[#FB9833]"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                <EyeIcon open={showPassword} className="h-4 w-4" />
                            </button>
                        }
                    />

                    <FormField
                        compact
                        id="confirmPassword"
                        label="Confirmar contraseña"
                        requiredMark
                        icon={<LockIcon className="h-4 w-4" />}
                        type={showConfirmPassword ? 'text' : 'password'}
                        maxLength={FIELD_LIMITS.password.max}
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
                                className="shrink-0 text-[#FCEFEF]/50 [.auth-light_&]:text-[#4D555B]/75 transition hover:text-[#FB9833]"
                                onClick={() => setShowConfirmPassword((current) => !current)}
                                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                <EyeIcon open={showConfirmPassword} className="h-4 w-4" />
                            </button>
                        }
                    />
                </div>

                {/* INDICADOR COMPACTO DE SEGURIDAD DE CONTRASEÑA EN TIEMPO REAL */}
                <div className="rounded-xl border border-white/10 bg-[#04141f]/70 [.auth-light_&]:border-[#4D555B]/20 [.auth-light_&]:bg-white/85 px-3 py-2">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="text-[11px] text-[#FCEFEF]/60 [.auth-light_&]:text-[#4D555B]">
                            Seguridad de contraseña:{' '}
                            <strong className="text-[#FCEFEF] [.auth-light_&]:text-[#012538]">
                                {passwordStrength.label}
                            </strong>
                        </span>
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10 [.auth-light_&]:bg-[#4D555B]/15">
                            <div
                                className={`h-full transition-all duration-300 rounded-full ${passwordStrength.color} ${passwordStrength.width}`}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                        {passwordRequirements.map((req) => (
                            <span
                                key={req.id}
                                className={`inline-flex items-center gap-1 transition-colors ${
                                    req.valid
                                        ? 'text-emerald-400 [.auth-light_&]:text-[#1B768E] font-medium'
                                        : 'text-[#FCEFEF]/45 [.auth-light_&]:text-[#4D555B]/80'
                                }`}
                            >
                                <span
                                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                                        req.valid
                                            ? 'bg-emerald-500/20 text-emerald-400 [.auth-light_&]:bg-[#1B768E]/15 [.auth-light_&]:text-[#1B768E]'
                                            : 'bg-white/5 text-[#FCEFEF]/35 [.auth-light_&]:bg-[#4D555B]/10 [.auth-light_&]:text-[#4D555B]'
                                    }`}
                                >
                                    {req.valid ? '✓' : '○'}
                                </span>
                                {req.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ACEPTACIÓN DE TÉRMINOS Y CONDICIONES */}
                <div>
                    <label className="flex items-start gap-2.5 text-xs leading-snug text-[#FCEFEF]/75 [.auth-light_&]:text-[#4D555B] cursor-pointer select-none">
                        <input
                            id="aceptaTerminos"
                            type="checkbox"
                            checked={aceptaTerminos}
                            onChange={(e) => {
                                setAceptaTerminos(e.target.checked)
                                setTermsTouched(true)
                            }}
                            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-transparent [.auth-light_&]:border-[#4D555B]/35 [.auth-light_&]:bg-white accent-[#FB9833] cursor-pointer"
                        />
                        <span>
                            He leído y acepto los{' '}
                            <a
                                href="/terminos-servicio"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-semibold text-[#1B768E] underline decoration-[#1B768E]/50 hover:text-[#FB9833] transition-colors"
                            >
                                términos y condiciones
                            </a>{' '}
                            y la{' '}
                            <a
                                href="/politica-privacidad"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-semibold text-[#1B768E] underline decoration-[#1B768E]/50 hover:text-[#FB9833] transition-colors"
                            >
                                política de tratamiento de datos personales
                            </a>
                            <span className="ml-0.5 text-rose-400 [.auth-light_&]:text-[#FB9833]">*</span>
                        </span>
                    </label>
                    {termsTouched && !aceptaTerminos && (
                        <p className="mt-0.5 text-[11px] text-rose-400 [.auth-light_&]:text-rose-600" role="alert">
                            Debes aceptar los términos y condiciones y la política de tratamiento de datos personales para continuar.
                        </p>
                    )}
                </div>

                {/* BOTÓN REGISTRARSE */}
                <button
                    type="submit"
                    id="btn-registrarse"
                    disabled={isFormIncompleteOrInvalid}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#FB9833] py-2.5 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition-all hover:bg-[#e2872c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
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

            <footer className="mt-3 text-center text-xs text-[#FCEFEF]/60 [.auth-light_&]:text-[#4D555B]">
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
