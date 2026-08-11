import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import AuthLayout from './AuthLayout'
import FormField from './FormField'
import { MailIcon, LockIcon, EyeIcon } from './icons'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <AuthLayout image={loginBackground} eyebrow="Mi Conductor">
      <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">Bienvenido</h2>
      <p className="mt-1 text-sm text-[#FCEFEF]/60">Ingresa tus credenciales para acceder al portal.</p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormField
          label="Correo electrónico"
          icon={<MailIcon />}
          type="email"
          placeholder="nombre@empresa.com"
          autoComplete="email"
        />

        <FormField
          label="Contraseña"
          icon={<LockIcon />}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="current-password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[#FCEFEF]/60">
            <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#FB9833]" />
            Recordarme
          </label>
          <Link to="/recover-password" className="text-[#1B768E] transition hover:text-[#FB9833]">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          className="mt-2 rounded-xl bg-[#FB9833] py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c] active:scale-[0.99]"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#FCEFEF]/60">
        ¿No tienes una cuenta?{' '}
        <button
          type="button"
          className="font-medium text-[#1B768E] transition hover:text-[#FB9833]"
          onClick={() => navigate('/register')}
        >
          Crear una
        </button>
      </p>
    </AuthLayout>
  )
}