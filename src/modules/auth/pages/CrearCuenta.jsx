import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import AuthLayout from './AuthLayout'
import FormField from './FormField'
import { UserIcon, MailIcon, LockIcon, EyeIcon, CheckIcon } from './icons'

const STORAGE_KEY = 'mi_conductor_registered_users'

function getUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveUser(user) {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function CrearCuenta() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.'
    }

    if (!form.email.trim()) {
      newErrors.email = 'El correo es obligatorio.'
    } else if (!isValidEmail(form.email.trim())) {
      newErrors.email = 'Ingresa un correo válido.'
    } else if (getUsers().some((u) => u.email === form.email.trim().toLowerCase())) {
      newErrors.email = 'Este correo ya está registrado.'
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria.'
    } else if (form.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres.'
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña.'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const newUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      createdAt: new Date().toISOString(),
    }

    saveUser(newUser)
    setSuccess(true)
    setTimeout(() => navigate('/login'), 2500)
  }

  if (success) {
    return (
      <AuthLayout image={loginBackground} eyebrow="Mi Conductor">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B768E]/20 text-[#1B768E]">
            <CheckIcon />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">¡Cuenta creada!</h2>
          <p className="text-sm text-[#FCEFEF]/60">
            Tu registro fue exitoso. Serás redirigido al inicio de sesión.
          </p>
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-[#FB9833]" />
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout image={loginBackground} eyebrow="Mi Conductor">
      <h2 className="font-display text-2xl font-semibold text-[#FCEFEF]">Crear cuenta</h2>
      <p className="mt-1 text-sm text-[#FCEFEF]/60">Completa tus datos para registrarte en la plataforma.</p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Nombre completo"
          icon={<UserIcon />}
          type="text"
          placeholder="Tu nombre completo"
          autoComplete="name"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
        />

        <FormField
          label="Correo electrónico"
          icon={<MailIcon />}
          type="email"
          placeholder="nombre@empresa.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
        />

        <FormField
          label="Contraseña"
          icon={<LockIcon />}
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
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

        <FormField
          label="Confirmar contraseña"
          icon={<LockIcon />}
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
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

        <button
          type="submit"
          className="mt-2 rounded-xl bg-[#FB9833] py-3 text-sm font-semibold text-[#012538] shadow-lg shadow-[#FB9833]/20 transition hover:bg-[#e2872c] active:scale-[0.99]"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#FCEFEF]/60">
        <Link to="/login" className="text-[#1B768E] transition hover:text-[#FB9833]">
          Volver al inicio de sesión
        </Link>
      </p>
    </AuthLayout>
  )
}