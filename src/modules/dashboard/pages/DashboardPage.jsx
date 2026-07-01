import './DashboardPage.css'

function StarIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path d="M12 3.8l2.7 5.47 6.03.88-4.36 4.24 1.03 5.99L12 17.55l-5.4 2.83 1.03-5.99-4.36-4.24 6.03-.88L12 3.8Z" fill="currentColor" />
		</svg>
	)
}

function ClockIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
			<path d="M12 8.2v4l2.8 2.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function CheckIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<rect x="4" y="4" width="16" height="16" rx="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
			<path d="M8 12.5l2.3 2.4L16.5 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function TrendIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path d="M4 18h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M6 15l4-4 3 2 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

function NotificationIcon() {
	return (
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path d="M12 5.3A4.7 4.7 0 0 0 7.3 10v2.7l-1.2 2A1 1 0 0 0 7 16.2h10a1 1 0 0 0 .9-1.5l-1.2-2V10A4.7 4.7 0 0 0 12 5.3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
			<path d="M10 18a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
		</svg>
	)
}

const metrics = [
	{ label: 'CALIF. PROM.', value: '4.88', unit: '/5.0', badge: '+2.4%', color: '#63bfe6', icon: StarIcon },
	{ label: 'TIEMPO ESPERA PROM.', value: '12.5', unit: 'min', badge: '-5 min', color: '#e3a55f', icon: ClockIcon },
	{ label: 'TASA DE COMPLETADO', value: '2,482', unit: 'Viajes', badge: '99.2%', color: '#9b9b9b', icon: CheckIcon },
	{ label: 'CRECIMIENTO INGRESOS', value: '$42.8k', unit: 'USD', badge: '+18%', color: '#6cc9e8', icon: TrendIcon },
]

const hotspots = [
	{ name: 'Centro', value: '42%', width: '42%', tone: 'warm' },
	{ name: 'Distrito Comercial', value: '28%', width: '28%', tone: 'cool' },
	{ name: 'Residencial de Lujo', value: '19%', width: '19%', tone: 'soft' },
]

const feedback = [
	{ initials: 'JD', name: 'Julian Delgado', time: 'hace 2h', rating: 5, text: 'Servicio extremadamente profesional. El conductor llegó 5 minutos antes y el vehículo estaba impecable.' },
	{ initials: 'AM', name: 'Ana Maria S.', time: 'hace 5h', rating: 5, text: 'Conducción segura en tráfico intenso. Un poco callado, pero navegación muy eficiente.' },
	{ initials: 'RC', name: 'Ricardo Caamaño', time: 'ayer', rating: 4, text: 'El servicio de atención durante el viaje fue fluido y bien coordinado.' },
]

const drivers = [
	{ name: 'Carlos Mendoza', trips: 142, rating: '4.96', status: 'En Ruta' },
	{ name: 'Elena Rodríguez', trips: 128, rating: '4.92', status: 'Disponible' },
	{ name: 'Miguel Torres', trips: 115, rating: '4.89', status: 'Disponible' },
]

function StatCard({ metric }) {
	const Icon = metric.icon

	return (
		<article className="dashboard-stat-card">
			<div className="dashboard-stat-card__top">
				<span className="dashboard-stat-card__icon" style={{ color: metric.color }}>
					<Icon />
				</span>
				<span className="dashboard-stat-card__badge">{metric.badge}</span>
			</div>
			<div>
				<div className="dashboard-stat-card__label">{metric.label}</div>
				<div className="dashboard-stat-card__value">
					{metric.value}
					<span>{metric.unit}</span>
				</div>
			</div>
		</article>
	)
}

function Avatar({ initials }) {
	return <span className="dashboard-avatar">{initials}</span>
}

export default function DashboardPage() {
	return (
		<div className="dashboard-page">
			<header className="dashboard-page__header">
					<div>
						<p className="dashboard-page__breadcrumb">Admin &rsaquo; Servicios &rsaquo; <span>Medición y Desempeño</span></p>
						<h1>Panel de Control — Medición y Desempeño</h1>
					</div>
				<button type="button" className="dashboard-page__notif" aria-label="Notificaciones">
					<NotificationIcon />
				</button>
			</header>

			<section className="dashboard-page__metrics">
				{metrics.map((metric) => (
					<StatCard key={metric.label} metric={metric} />
				))}
			</section>

			<section className="dashboard-page__content-grid">
				<article className="dashboard-panel dashboard-panel--chart">
					<div className="dashboard-panel__header">
						<div>
							<h2>Crecimiento Mensual de Servicios</h2>
							<p>Volumen de servicios comparado con el año anterior</p>
						</div>
							<div className="dashboard-legend">
								<span><i className="dot dot--orange" /> Año actual</span>
								<span><i className="dot dot--blue" /> Año anterior</span>
							</div>
					</div>
					<div className="dashboard-chart">
						<div className="dashboard-chart__grid" />
						<div className="dashboard-chart__line dashboard-chart__line--primary" />
						<div className="dashboard-chart__line dashboard-chart__line--secondary" />
						<div className="dashboard-chart__labels">
							{['JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'].map((month) => (
								<span key={month}>{month}</span>
							))}
						</div>
					</div>
				</article>

				<article className="dashboard-panel dashboard-panel--hotspots">
							<div className="dashboard-panel__header dashboard-panel__header--stacked">
								<h2>Zonas con Mayor Actividad</h2>
							</div>
					<div className="dashboard-hotspots">
						{hotspots.map((hotspot) => (
							<div key={hotspot.name} className="dashboard-hotspot">
								<div className={`dashboard-hotspot__thumb dashboard-hotspot__thumb--${hotspot.tone}`} />
								<div className="dashboard-hotspot__body">
									<div className="dashboard-hotspot__row">
										<div className="dashboard-hotspot__name">{hotspot.name}</div>
										<div className="dashboard-hotspot__value">{hotspot.value}</div>
									</div>
									<div className="dashboard-hotspot__bar">
										<span style={{ width: hotspot.width }} />
									</div>
								</div>
							</div>
						))}
					</div>
					<a className="dashboard-panel__link" href="/dashboard">Ver Mapa de Calor Detallado</a>
				</article>
			</section>

			<section className="dashboard-page__content-grid dashboard-page__content-grid--bottom">
				<article className="dashboard-panel dashboard-panel--feedback">
					<div className="dashboard-panel__header">
						<h2>Comentarios Recientes</h2>
						<p>Últimas 48 horas</p>
					</div>
					<div className="dashboard-feedback-list">
						{feedback.map((item) => (
							<div key={item.name} className="dashboard-feedback">
								<div className="dashboard-feedback__header">
									<Avatar initials={item.initials} />
									<div>
										<strong>{item.name}</strong>
										<div className="dashboard-stars">{'★★★★★'.slice(0, item.rating)}</div>
									</div>
									<span>{item.time}</span>
								</div>
								<p>“{item.text}”</p>
							</div>
						))}
					</div>
				</article>

				<article className="dashboard-panel dashboard-panel--drivers">
					<div className="dashboard-panel__header">
						<h2>Conductores Más Destacados</h2>
					</div>
					<table className="dashboard-drivers">
						<thead>
							<tr>
								<th>CONDUCTOR</th>
								<th>VIAJES</th>
								<th>CALIF.</th>
								<th>ESTADO</th>
							</tr>
						</thead>
						<tbody>
							{drivers.map((driver) => (
								<tr key={driver.name}>
									<td>
										<div className="dashboard-driver-name">
											<Avatar initials={driver.name.split(' ').map((part) => part[0]).join('').slice(0, 2)} />
											<span>{driver.name}</span>
										</div>
									</td>
									<td>{driver.trips}</td>
									<td>
										<span className="dashboard-rating">★ {driver.rating}</span>
									</td>
									<td>
										<span className={`dashboard-status dashboard-status--${driver.status === 'En Ruta' ? 'route' : 'available'}`}>{driver.status}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</article>
			</section>
		</div>
	)
}