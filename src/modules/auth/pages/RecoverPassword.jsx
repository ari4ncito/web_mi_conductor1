import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import AuthLayout from './AuthLayout'
import FormField from './FormField'
import { MailIcon, ArrowLeftIcon } from './icons'

export default function RecoverPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <AuthLayout image={loginBackground} eyebrow="Mi Conductor">
      {sent ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">Revisa tu correo</h2>
          <p className="text-sm text-[#FCEFEF]/60">
            Si la dirección está registrada, recibirás un enlace para restablecer tu contraseña.
          </p>
          <button
            type="button"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#FB9833] px-5 py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c]"
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
          <h1 className="font-display mt-3 text-2xl font-semibold text-[#FCEFEF]">Recuperar contraseña</h1>
          <p className="mt-1 text-sm text-[#FCEFEF]/60">
            Ingresa el correo asociado a tu cuenta y te enviaremos un enlace seguro para crear una nueva contraseña.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormField
              label="Correo electrónico"
              icon={<MailIcon />}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nombre@empresa.com"
              autoComplete="email"
            />

            <button
              type="submit"
              className="mt-2 rounded-xl bg-[#FB9833] py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c] active:scale-[0.99]"
            >
              Enviar enlace
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link to="/login" className="text-[#1B768E] transition hover:text-[#FB9833]">
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