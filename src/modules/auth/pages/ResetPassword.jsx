import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

import loginBackground from '../../../assets/fondo_login.png'
import AuthLayout from './AuthLayout'
import FormField from './FormField'
import { LockIcon, EyeIcon, CheckIcon, ArrowLeftIcon } from './icons'

import AuthService from '../services/authService'


export default function ResetPassword() {

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const token = searchParams.get('token')


    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)


    const handleSubmit = async (event) => {

        event.preventDefault()

        setError('')


        if (!token) {

            setError(
                'El enlace de recuperación no es válido.'
            )

            return
        }


        if (password.length < 6) {

            setError(
                'La contraseña debe tener mínimo 6 caracteres.'
            )

            return
        }


        if (password !== confirmPassword) {

            setError(
                'Las contraseñas no coinciden.'
            )

            return
        }


        setLoading(true)


        try {

            await AuthService.resetPassword({
                token,
                password
            })

            setSuccess(true)

        } catch (error) {

            console.error(
                'Error restableciendo contraseña:',
                error
            )

            setError(
                error.response?.data?.message ||
                'El enlace no es válido o ha expirado.'
            )

        } finally {

            setLoading(false)

        }

    }


    if (success) {

        return (

            <AuthLayout
                image={loginBackground}
                eyebrow="Mi Conductor"
            >

                <div className="flex flex-col items-center gap-4 text-center">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B768E]/20 text-[#1B768E]">
                        <CheckIcon />
                    </div>


                    <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">
                        ¡Contraseña actualizada!
                    </h2>


                    <p className="text-sm text-[#FCEFEF]/60">
                        Tu contraseña fue cambiada correctamente.
                    </p>


                    <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#FB9833] px-5 py-3 text-sm font-semibold text-[#012538]"
                        onClick={() => navigate('/login')}
                    >

                        <ArrowLeftIcon className="h-4 w-4" />

                        Ir al inicio de sesión

                    </button>

                </div>

            </AuthLayout>

        )

    }


    return (

        <AuthLayout
            image={loginBackground}
            eyebrow="Mi Conductor"
        >

            <span className="w-fit rounded-full bg-[#1B768E]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B768E]">
                Recuperación de acceso
            </span>


            <h1 className="font-display mt-3 text-2xl font-semibold text-[#FCEFEF]">
                Nueva contraseña
            </h1>


            <p className="mt-1 text-sm text-[#FCEFEF]/60">
                Crea una nueva contraseña para recuperar el acceso a tu cuenta.
            </p>


            <form
                className="mt-6 flex flex-col gap-4"
                onSubmit={handleSubmit}
            >

                <FormField
                    label="Nueva contraseña"
                    icon={<LockIcon />}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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

                            <EyeIcon open={showPassword} />

                        </button>

                    }
                />


                <FormField
                    label="Confirmar contraseña"
                    icon={<LockIcon />}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
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

                            <EyeIcon open={showConfirmPassword} />

                        </button>

                    }
                />


                {error && (

                    <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                        {error}
                    </p>

                )}


                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 rounded-xl bg-[#FB9833] py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c] disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {loading
                        ? 'Actualizando...'
                        : 'Cambiar contraseña'
                    }

                </button>

            </form>


            <p className="mt-6 text-center text-sm text-[#FCEFEF]/60">

                <Link
                    to="/login"
                    className="text-[#1B768E] transition hover:text-[#FB9833]"
                >
                    Volver al inicio de sesión
                </Link>

            </p>

        </AuthLayout>

    )

}