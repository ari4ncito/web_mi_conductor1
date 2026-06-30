import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginBackground from '../../../assets/fondo_login.png'
import './RecoverPassword.css'

function MailIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<rect x="4.5" y="6" width="15" height="12" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
			<path d="M5.5 8l6.5 4.8L18.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function ArrowLeftIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path d="M10 6 4 12l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M5 12h15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	)
}

export default function RecoverPassword() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [sent, setSent] = useState(false)

	const handleSubmit = (event) => {
		event.preventDefault()
		setSent(true)
	}

	return (
		<section className="recover-shell">
			<div className="recover-card">
				<div className="recover-visual">
					<img className="recover-visual__image" src={loginBackground} alt="" aria-hidden="true" />
				</div>

				<div className="recover-panel">
					<div className="recover-panel__inner">
						{sent ? (
							<div className="recover-success">
								<h2>Revisa tu correo</h2>
								<p>Si la dirección está registrada, recibirás un enlace para restablecer tu contraseña.</p>
								<button type="button" className="recover-primary" onClick={() => navigate('/login')}>
									<ArrowLeftIcon />
									Volver al inicio
								</button>
							</div>
						) : (
							<>
								<div className="recover-eyebrow">Recuperación de acceso</div>
								<h1>Recuperar contraseña</h1>
								<p className="recover-copy">Ingresa el correo asociado a tu cuenta y te enviaremos un enlace seguro para crear una nueva contraseña.</p>

								<form className="recover-form" onSubmit={handleSubmit}>
									<label>
										<span>Correo Electrónico</span>
										<div className="recover-field">
											<span className="recover-field__icon"><MailIcon /></span>
											<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@empresa.com" autoComplete="email" />
										</div>
									</label>

									<button type="submit" className="recover-primary">Enviar enlace</button>
								</form>

								<div className="recover-links">
									<Link to="/login">Regresar al inicio de sesión</Link>
									<button type="button" onClick={() => navigate('/login')}>Cancelar</button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}