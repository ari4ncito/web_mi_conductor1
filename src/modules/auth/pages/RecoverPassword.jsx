import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import AuthLayout from './AuthLayout'
import FormField from './FormField'
import { MailIcon, ArrowLeftIcon } from './icons'
import AuthService from '../services/authService'
import { validateCorreo } from '../../../utils/validators'

const RESEND_COOLDOWN_SECONDS = 10

export default function RecoverPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendSeconds, setResendSeconds] = useState(0)
  const [resendMessage, setResendMessage] = useState('')

  useEffect(() => {
    if (resendSeconds <= 0) {
      return undefined
    }

    const timerId = setInterval(() => {
      setResendSeconds((prev) => (prev > 1 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timerId)
  }, [resendSeconds])

  const extractBackendError = (err) => {
    const backendErrors = err.response?.data?.errors
    if (Array.isArray(backendErrors) && backendErrors.length > 0) {
      const correoIssue = backendErrors.find((item) => item.campo === 'correo')
      if (correoIssue?.mensaje) {
        return correoIssue.mensaje
      }
      if (backendErrors[0]?.mensaje) {
        return backendErrors[0].mensaje
      }
    }

    if (err.response?.data?.message) {
      return err.response.data.message
    }

    if (!err.response) {
      return 'No fue posible conectar con el servidor. Verifica tu conexión e intenta nuevamente.'
    }

    return 'No fue posible procesar la solicitud.'
  }

  const handleEmailChange = (event) => {
    const val = event.target.value
    setEmail(val)

    if (touched || val.length > 0) {
      setError(validateCorreo(val))
    } else {
      setError('')
    }
  }

  const handleBlur = () => {
    setTouched(true)
    setError(validateCorreo(email))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setTouched(true)
    setResendMessage('')

    const validationError = validateCorreo(email)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)

    try {
      const correoNormalizado = email.trim().toLowerCase()
      const response = await AuthService.forgotPassword(correoNormalizado)

      if (response && response.success === false) {
        setError(response.message || 'No fue posible procesar la solicitud.')
        return
      }

      setSent(true)
      setResendSeconds(RESEND_COOLDOWN_SECONDS)
    } catch (err) {
      setError(extractBackendError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (loading || resendSeconds > 0) {
      return
    }

    const validationError = validateCorreo(email)
    if (validationError) {
      setSent(false)
      setError(validationError)
      return
    }

    setError('')
    setResendMessage('')
    setLoading(true)

    try {
      const correoNormalizado = email.trim().toLowerCase()
      const response = await AuthService.forgotPassword(correoNormalizado)

      if (response && response.success === false) {
        setError(response.message || 'No fue posible reenviar el correo.')
        return
      }

      setResendSeconds(RESEND_COOLDOWN_SECONDS)
      setResendMessage('Se ha enviado un nuevo enlace de recuperación.')
    } catch (err) {
      setError(extractBackendError(err))
    } finally {
      setLoading(false)
    }
  }

  const isEmailValid = (touched || email.trim().length > 0) && !error && !validateCorreo(email)

  return (
    <AuthLayout
      image={loginBackground}
      eyebrow="Mi Conductor"
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B768E]/20 text-[#1B768E]">
            <MailIcon />
          </div>

          <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">
            Revisa tu correo
          </h2>

          <p className="text-sm text-[#FCEFEF]/60">
            Hemos enviado un enlace a{' '}
            <span className="font-medium text-[#FCEFEF]">
              {email.trim().toLowerCase()}
            </span>{' '}
            para restablecer tu contraseña.
          </p>

          <p className="text-xs text-[#FCEFEF]/40">
            Revisa también la carpeta de spam o correo no deseado.
          </p>

          {error && (
            <p className="text-xs text-rose-400" role="alert">
              {error}
            </p>
          )}

          {resendMessage && !error && (
            <p className="text-xs text-emerald-400" role="status">
              {resendMessage}
            </p>
          )}

          <button
            type="button"
            disabled={loading || resendSeconds > 0}
            onClick={handleResend}
            className="mt-1 inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#04141f] px-5 py-2.5 text-sm font-semibold text-[#1B768E] transition hover:border-[#1B768E] hover:text-[#FB9833] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Enviando...'
              : resendSeconds > 0
              ? `Reenviar correo (${resendSeconds}s)`
              : 'Reenviar correo'}
          </button>

          <button
            type="button"
            className="mt-1 inline-flex items-center gap-2 rounded-xl bg-[#FB9833] px-5 py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c]"
            onClick={() => navigate('/login')}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver al inicio
          </button>
        </div>
      ) : (
        <>
          <span className="w-fit rounded-full bg-[#1B768E]/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1B768E]">
            Recuperación de acceso
          </span>

          <h1 className="font-display mt-3 text-2xl font-semibold text-[#FCEFEF]">
            Recuperar contraseña
          </h1>

          <p className="mt-1 text-sm text-[#FCEFEF]/60">
            Ingresa el correo asociado a tu cuenta y te enviaremos
            un enlace seguro para crear una nueva contraseña.
          </p>

          <form
            className="mt-6 flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <FormField
              id="recover-email"
              label="Correo electrónico"
              icon={<MailIcon />}
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              placeholder="nombre@empresa.com"
              autoComplete="email"
              error={error}
              isValid={isEmailValid}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-[#FB9833] py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              to="/login"
              className="text-[#1B768E] transition hover:text-[#FB9833]"
            >
              Regresar al inicio de sesión
            </Link>

            <button
              type="button"
              className="text-[#FCEFEF]/50 transition hover:text-[#FCEFEF]"
              onClick={() => navigate('/login')}
            >
              Cancelar
            </button>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
