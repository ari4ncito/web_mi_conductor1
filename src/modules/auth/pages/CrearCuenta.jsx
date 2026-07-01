import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import './CrearCuenta.css'

const STORAGE_KEY = 'mi_conductor_registered_users'

function UserIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
			<path d="M4.5 21c0-4 3.4-7.2 7.5-7.2s7.5 3.2 7.5 7.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
		</svg>
	)
}

function MailIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<rect x="4.5" y="6" width="15" height="12" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
			<path d="M5.5 8l6.5 4.8L18.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function LockIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<rect x="5.5" y="10" width="13" height="9.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
			<path d="M8.5 10V8a3.5 3.5 0 0 1 7 0v2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
		</svg>
	)
}

function EyeIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path d="M2.8 12s3.3-5.8 9.2-5.8S21.2 12 21.2 12s-3.3 5.8-9.2 5.8S2.8 12 2.8 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
			<circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
		</svg>
	)
}

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
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
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
		} else {
			const existing = getUsers().find((u) => u.email === form.email.trim().toLowerCase())
			if (existing) {
				newErrors.email = 'Este correo ya está registrado.'
			}
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

		setTimeout(() => {
			navigate('/login')
		}, 2500)
	}

	if (success) {
		return (
			<section className="register-shell">
				<div className="register-card">
					<div className="register-visual">
						<img className="register-visual__image" src={loginBackground} alt="" aria-hidden="true" />
					</div>
					<div className="register-panel">
						<div className="register-panel__inner">
							<div className="register-success-overlay">
								<div className="register-success-icon">
									<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="20 6 9 17 4 12" />
									</svg>
								</div>
								<h2>¡Cuenta creada!</h2>
								<p>Tu registro fue exitoso. Serás redirigido al inicio de sesión.</p>
								<div className="register-spinner" />
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section className="register-shell">
			<div className="register-card">
				<div className="register-visual">
					<img className="register-visual__image" src={loginBackground} alt="" aria-hidden="true" />
				</div>

				<div className="register-panel">
					<div className="register-panel__inner">
						<h2>Crear Cuenta</h2>
						<p>Completa tus datos para registrarte en la plataforma.</p>

						<form className="register-form" onSubmit={handleSubmit} noValidate>
							<label>
								<span>Nombre Completo</span>
								<div className={`register-field ${errors.name ? 'register-field--error' : ''}`}>
									<span className="register-field__icon"><UserIcon /></span>
									<input
										type="text"
										placeholder="Tu nombre completo"
										autoComplete="name"
										value={form.name}
										onChange={handleChange('name')}
									/>
								</div>
								{errors.name && <p className="register-error-text">{errors.name}</p>}
							</label>

							<label>
								<span>Correo Electrónico</span>
								<div className={`register-field ${errors.email ? 'register-field--error' : ''}`}>
									<span className="register-field__icon"><MailIcon /></span>
									<input
										type="email"
										placeholder="nombre@empresa.com"
										autoComplete="email"
										value={form.email}
										onChange={handleChange('email')}
									/>
								</div>
								{errors.email && <p className="register-error-text">{errors.email}</p>}
							</label>

							<label>
								<span>Contraseña</span>
								<div className={`register-field register-field--password ${errors.password ? 'register-field--error' : ''}`}>
									<span className="register-field__icon"><LockIcon /></span>
									<input
										type={showPassword ? 'text' : 'password'}
										placeholder="••••••••"
										autoComplete="new-password"
										value={form.password}
										onChange={handleChange('password')}
									/>
									<button
										type="button"
										className="register-field__toggle"
										onClick={() => setShowPassword((current) => !current)}
										aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
									>
										<EyeIcon />
									</button>
								</div>
								{errors.password && <p className="register-error-text">{errors.password}</p>}
							</label>

							<label>
								<span>Confirmar Contraseña</span>
								<div className={`register-field register-field--password ${errors.confirmPassword ? 'register-field--error' : ''}`}>
									<span className="register-field__icon"><LockIcon /></span>
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder="••••••••"
										autoComplete="new-password"
										value={form.confirmPassword}
										onChange={handleChange('confirmPassword')}
									/>
									<button
										type="button"
										className="register-field__toggle"
										onClick={() => setShowConfirmPassword((current) => !current)}
										aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
									>
										<EyeIcon />
									</button>
								</div>
								{errors.confirmPassword && <p className="register-error-text">{errors.confirmPassword}</p>}
							</label>

							<button type="submit" className="register-submit">Crear Cuenta</button>
						</form>

						<p className="register-footer">
							<Link to="/login">Volver al inicio de sesión</Link>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
