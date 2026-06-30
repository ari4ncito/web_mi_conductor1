import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import './Login.css'

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

export default function Login() {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)

	const handleSubmit = (event) => {
		event.preventDefault()
		navigate('/dashboard')
	}

	return (
		<section className="login-shell">
			<div className="login-card">
				<div className="login-visual">
					<img className="login-visual__image" src={loginBackground} alt="" aria-hidden="true" />
				</div>

				<div className="login-form-panel">
					<div className="login-form-panel__inner">
						<h2>Bienvenido</h2>
						<p>Ingresa tus credenciales para acceder al portal.</p>

						<form className="login-form" onSubmit={handleSubmit}>
							<label>
								<span>Correo Electrónico</span>
								<div className="login-field">
									<span className="login-field__icon"><MailIcon /></span>
									<input type="email" placeholder="nombre@empresa.com" autoComplete="email" />
								</div>
							</label>

							<label>
								<span>Contraseña</span>
								<div className="login-field login-field--password">
									<span className="login-field__icon"><LockIcon /></span>
									<input type={showPassword ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password" />
									<button type="button" className="login-field__toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
										<EyeIcon />
									</button>
								</div>
							</label>

							<div className="login-options">
								<label className="login-checkbox">
									<input type="checkbox" />
									<span>Recordarme</span>
								</label>
								<Link to="/recover-password">¿Olvidaste tu contraseña?</Link>
							</div>

							<button type="submit" className="login-submit">Iniciar Sesión</button>
						</form>

						<p className="login-footer">
							¿No tienes una cuenta? <button type="button">Crear una</button>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
