import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import AuthLayout from './AuthLayout'
import FormField from './FormField'
import {
    UserIcon,
    MailIcon,
    LockIcon,
    EyeIcon,
    CheckIcon
} from './icons'

import AuthService from '../services/authService'


export default function CrearCuenta() {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        tipoDocumento: 'CC',
        documento: '',
        correo: '',
        telefono: '',
        direccion: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [errors, setErrors] = useState({})
    const [errorGeneral, setErrorGeneral] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)


    // ==========================================
    // CAMBIAR CAMPOS
    // ==========================================

    const handleChange = (field) => (e) => {

        setForm((prev) => ({
            ...prev,
            [field]: e.target.value
        }))

        if (errors[field]) {

            setErrors((prev) => {

                const next = { ...prev }

                delete next[field]

                return next
            })
        }

        setErrorGeneral('')
    }


    // ==========================================
    // VALIDAR FORMULARIO
    // ==========================================

    const validate = () => {

        const newErrors = {}


        if (!form.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio.'
        }


        if (!form.apellido.trim()) {
            newErrors.apellido = 'El apellido es obligatorio.'
        }


        if (!form.tipoDocumento) {
            newErrors.tipoDocumento =
                'Selecciona un tipo de documento.'
        }


        if (!form.documento.trim()) {
            newErrors.documento =
                'El documento es obligatorio.'
        }


        if (!form.correo.trim()) {

            newErrors.correo =
                'El correo es obligatorio.'

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.correo.trim()
            )
        ) {

            newErrors.correo =
                'Ingresa un correo válido.'
        }


        if (!form.telefono.trim()) {
            newErrors.telefono =
                'El teléfono es obligatorio.'
        }


        if (!form.direccion.trim()) {
            newErrors.direccion =
                'La dirección es obligatoria.'
        }


        if (!form.password) {

            newErrors.password =
                'La contraseña es obligatoria.'

        } else if (form.password.length < 6) {

            newErrors.password =
                'Mínimo 6 caracteres.'
        }


        if (!form.confirmPassword) {

            newErrors.confirmPassword =
                'Confirma tu contraseña.'

        } else if (
            form.password !== form.confirmPassword
        ) {

            newErrors.confirmPassword =
                'Las contraseñas no coinciden.'
        }


        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }


    // ==========================================
    // REGISTRAR CLIENTE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault()

        setErrorGeneral('')


        if (!validate()) {
            return
        }


        setLoading(true)


        try {

            const datos = {

                nombre: form.nombre.trim(),

                apellido: form.apellido.trim(),

                tipoDocumento: form.tipoDocumento,

                documento: form.documento.trim(),

                correo: form.correo.trim().toLowerCase(),

                password: form.password,

                telefono: form.telefono.trim(),

                direccion: form.direccion.trim()

            }


            console.log(
                'Datos enviados para crear cliente:',
                datos
            )


            const respuesta =
                await AuthService.register(datos)


            console.log(
                'Respuesta del registro:',
                respuesta
            )


            setSuccess(true)


            setTimeout(() => {
                navigate('/login')
            }, 2500)


        } catch (error) {

            console.error(
                'Error registrando cliente:',
                error
            )


            setErrorGeneral(
                error.response?.data?.message ||
                'No fue posible crear la cuenta.'
            )

        } finally {

            setLoading(false)

        }
    }


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

                <div className="flex flex-col items-center gap-4 text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B768E]/20 text-[#1B768E]">

                        <CheckIcon />

                    </div>


                    <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">

                        ¡Cuenta creada!

                    </h2>


                    <p className="text-sm text-[#FCEFEF]/60">

                        Tu registro fue exitoso.
                        Serás redirigido al inicio de sesión.

                    </p>


                    <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">

                        <div className="h-full w-1/3 animate-pulse rounded-full bg-[#FB9833]" />

                    </div>

                </div>

            </AuthLayout>
        )
    }


    // ==========================================
    // FORMULARIO
    // ==========================================

    return (

        <AuthLayout
            image={loginBackground}
            eyebrow="Mi Conductor"
            imageSide="right"
        >

            <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">

                Crear cuenta

            </h2>


            <p className="mt-1 text-sm text-[#FCEFEF]/60">

                Completa tus datos para registrarte como cliente.

            </p>


            {errorGeneral && (

                <div className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">

                    {errorGeneral}

                </div>

            )}


            <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={handleSubmit}
                noValidate
            >

                {/* NOMBRE */}

                <FormField
                    label="Nombre"
                    icon={<UserIcon />}
                    type="text"
                    placeholder="Tu nombre"
                    autoComplete="given-name"
                    value={form.nombre}
                    onChange={handleChange('nombre')}
                    error={errors.nombre}
                />


                {/* APELLIDO */}

                <FormField
                    label="Apellido"
                    icon={<UserIcon />}
                    type="text"
                    placeholder="Tu apellido"
                    autoComplete="family-name"
                    value={form.apellido}
                    onChange={handleChange('apellido')}
                    error={errors.apellido}
                />


                {/* TIPO DOCUMENTO */}

                <div className="flex flex-col gap-1">

                    <label className="text-sm text-[#FCEFEF]/70">

                        Tipo de documento

                    </label>


                    <select
                        value={form.tipoDocumento}
                        onChange={handleChange('tipoDocumento')}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#FCEFEF] outline-none"
                    >

                        <option value="CC">
                            Cédula de ciudadanía
                        </option>

                        <option value="TI">
                            Tarjeta de identidad
                        </option>

                        <option value="CE">
                            Cédula de extranjería
                        </option>

                    </select>


                    {errors.tipoDocumento && (

                        <span className="text-xs text-red-400">

                            {errors.tipoDocumento}

                        </span>

                    )}

                </div>


                {/* DOCUMENTO */}

                <FormField
                    label="Número de documento"
                    icon={<UserIcon />}
                    type="text"
                    placeholder="Número de documento"
                    value={form.documento}
                    onChange={handleChange('documento')}
                    error={errors.documento}
                />


                {/* CORREO */}

                <FormField
                    label="Correo electrónico"
                    icon={<MailIcon />}
                    type="email"
                    placeholder="nombre@empresa.com"
                    autoComplete="email"
                    value={form.correo}
                    onChange={handleChange('correo')}
                    error={errors.correo}
                />


                {/* TELÉFONO */}

                <FormField
                    label="Teléfono"
                    icon={<UserIcon />}
                    type="tel"
                    placeholder="3001234567"
                    autoComplete="tel"
                    value={form.telefono}
                    onChange={handleChange('telefono')}
                    error={errors.telefono}
                />


                {/* DIRECCIÓN */}

                <FormField
                    label="Dirección"
                    icon={<UserIcon />}
                    type="text"
                    placeholder="Ej: Calle 10 # 20-30"
                    autoComplete="street-address"
                    value={form.direccion}
                    onChange={handleChange('direccion')}
                    error={errors.direccion}
                />


                {/* CONTRASEÑA */}

                <FormField
                    label="Contraseña"
                    icon={<LockIcon />}
                    type={
                        showPassword
                            ? 'text'
                            : 'password'
                    }
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange('password')}
                    error={errors.password}
                    action={

                        <button
                            type="button"
                            className="shrink-0 text-[#FCEFEF]/50 transition hover:text-[#FB9833]"
                            onClick={() =>
                                setShowPassword(
                                    (current) => !current
                                )
                            }
                            aria-label={
                                showPassword
                                    ? 'Ocultar contraseña'
                                    : 'Mostrar contraseña'
                            }
                        >

                            <EyeIcon
                                open={showPassword}
                            />

                        </button>

                    }
                />


                {/* CONFIRMAR CONTRASEÑA */}

                <FormField
                    label="Confirmar contraseña"
                    icon={<LockIcon />}
                    type={
                        showConfirmPassword
                            ? 'text'
                            : 'password'
                    }
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    error={errors.confirmPassword}
                    action={

                        <button
                            type="button"
                            className="shrink-0 text-[#FCEFEF]/50 transition hover:text-[#FB9833]"
                            onClick={() =>
                                setShowConfirmPassword(
                                    (current) => !current
                                )
                            }
                            aria-label={
                                showConfirmPassword
                                    ? 'Ocultar contraseña'
                                    : 'Mostrar contraseña'
                            }
                        >

                            <EyeIcon
                                open={showConfirmPassword}
                            />

                        </button>

                    }
                />


                {/* BOTÓN */}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 rounded-xl bg-[#FB9833] py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {loading
                        ? 'Creando cuenta...'
                        : 'Crear cuenta'
                    }

                </button>

            </form>


            <p className="mt-6 text-center text-sm text-[#FCEFEF]/60">

                ¿Ya tienes una cuenta?{' '}

                <Link
                    to="/login"
                    className="text-[#1B768E] transition hover:text-[#FB9833]"
                >

                    Iniciar sesión

                </Link>

            </p>

        </AuthLayout>
    )
}