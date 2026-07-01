import './DashboardPage.css'

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
}

function BreadcrumbArrow() {
  return (
    <svg viewBox="0 0 8 12" width="8" height="12" aria-hidden="true">
      <path d="M2 1.5 5.5 6 2 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MetricCard({ label, value, detail, accent = false }) {
  return (
    <article
      style={{
        minHeight: 134,
        borderRadius: 24,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 22px rgba(21, 42, 53, 0.06)',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ color: '#252525', fontSize: 17, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 400 }}>{label}</div>
        <div style={{ marginTop: 10, color: colors.text, fontSize: 18, fontWeight: 400 }}>{value}</div>
      </div>
      <div style={{ color: accent ? '#b96a00' : colors.text, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        {accent ? <span style={{ color: '#c97300' }}>↗</span> : null}
        <span style={{ fontSize: 17 }}>{detail}</span>
      </div>
    </article>
  )
}

const metrics = [
	{ label: 'CALIF. PROM.', value: '4.88 /5.0', detail: '+2.4%', accent: true },
	{ label: 'TIEMPO ESPERA PROM.', value: '12.5 min', detail: '-5 min', accent: true },
	{ label: 'TASA DE COMPLETADO', value: '2,482 Viajes', detail: '99.2%', accent: true },
	{ label: 'CRECIMIENTO INGRESOS', value: '$42.8k USD', detail: '+18%', accent: true },
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

function Avatar({ initials }) {
	return <span className="dashboard-avatar">{initials}</span>
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: '#2b2b2b' }}>
      <path d="M12 4a4.5 4.5 0 0 0-4.5 4.5V11c0 .8-.3 1.6-.8 2.1L5.5 15h13l-1.2-1.9c-.5-.5-.8-1.3-.8-2.1V8.5A4.5 4.5 0 0 0 12 4Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M10 18.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function HeaderAction({ children, width = 40, height = 40, background = colors.surface }) {
  return (
    <button
      type="button"
      style={{
        width,
        height,
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        background,
        display: 'grid',
        placeItems: 'center',
        padding: 0,
        color: '#2b2b2b',
      }}
    >
      {children}
    </button>
  )
}

export default function DashboardPage() {
	return (
		<div style={{ padding: '32px 28px 36px', background: '#f3f6fb', maxHeight: '100vh', overflow: 'auto', WebkitOverflowScrolling: 'touch', boxSizing: 'border-box' }}>
			<header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 34 }}>
				<div style={{ minWidth: 0 }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b8f81', fontSize: 16 }}>
						<span>Admin</span>
						<BreadcrumbArrow />
						<span>Servicios</span>
						<BreadcrumbArrow />
						<span style={{ color: '#bb6a00', fontWeight: 700 }}>Medición y Desempeño</span>
					</div>
					<h1 style={{ margin: '8px 0 0', fontSize: 22, lineHeight: 1.1, fontWeight: 400, color: '#111111', fontFamily: 'Georgia, Times New Roman, serif' }}>Panel de Control — Medición y Desempeño</h1>
				</div>
				<HeaderAction width={40} height={44} background="#dceafb">
					<BellIcon />
				</HeaderAction>
			</header>

			<section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 20, marginBottom: 18 }}>
				{metrics.map((metric) => (
					<MetricCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} accent={metric.accent} />
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