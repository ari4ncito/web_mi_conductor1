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
      className="min-h-[134px] rounded-[24px] bg-white p-6 flex flex-col justify-between"
      style={{
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 22px rgba(21, 42, 53, 0.06)'
      }}
    >
      <div>
        <div className="text-[#252525] text-[17px] tracking-[0.12em] font-normal">{label}</div>
        <div className="mt-2.5 text-[#111111] text-[18px] font-normal">{value}</div>
      </div>
      <div className={`flex items-center gap-2 text-[18px] ${accent ? 'text-[#b96a00]' : 'text-[#111111]'}`}>
        {accent && <span className="text-[#c97300]">↗</span>}
        <span className="text-[17px]">{detail}</span>
      </div>
    </article>
  )
}

const metrics = [
	{ label: 'Calif. prom.', value: '4.88 /5.0', detail: '+2.4%', accent: true },
	{ label: 'Tiempo espera prom.', value: '12.5 min', detail: '-5 min', accent: true },
	{ label: 'Tasa de completado', value: '2,482 Viajes', detail: '99.2%', accent: true },
	{ label: 'Crecimiento ingresos', value: '$42.8k USD', detail: '+18%', accent: true },
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
	return <span className="w-[30px] h-[30px] rounded-full bg-[#cfe3f4] text-[#5c7a96] grid place-items-center text-[10px] font-extrabold tracking-[0.02em] shrink-0">{initials}</span>
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
      className="grid place-items-center p-0 text-[#2b2b2b] rounded-[14px]"
      style={{
        width,
        height,
        border: `1px solid ${colors.border}`,
        background,
      }}
    >
      {children}
    </button>
  )
}

export default function DashboardPage() {
	return (
		<div className="p-6 bg-[#f3f6fb] box-border">
			<section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-[18px]">
				{metrics.map((metric) => (
					<MetricCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} accent={metric.accent} />
				))}
			</section>

			<section className="grid grid-cols-1 xl:grid-cols-[1.95fr_minmax(300px,1fr)] gap-5 mt-[18px]">
				<article className="bg-white border border-[rgba(27,46,61,0.07)] rounded-[24px] shadow-[0_12px_22px_rgba(21,42,53,0.05)] p-[22px_24px_24px] box-border">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[18px]">
						<div>
							<h2 className="m-0 text-[#111111] text-[18px] font-bold">Crecimiento Mensual de Servicios</h2>
							<p className="m-[6px_0_0] text-[#9b917f] text-[13px]">Volumen de servicios comparado con el año anterior</p>
						</div>
							<div className="inline-flex items-center gap-4 flex-wrap text-[#292929] text-[12px] font-semibold mt-2 sm:mt-0">
								<span className="inline-flex items-center gap-2"><i className="w-2 h-2 rounded-full inline-block bg-[#ff9e36]" /> Año actual</span>
								<span className="inline-flex items-center gap-2"><i className="w-2 h-2 rounded-full inline-block bg-[#b7d7f3]" /> Año anterior</span>
							</div>
					</div>
					<div 
						className="relative h-[220px] sm:h-[270px] mt-[18px] rounded-[20px] overflow-hidden"
						style={{
							background: `linear-gradient(180deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), repeating-linear-gradient(0deg, transparent 0 49px, rgba(229, 235, 242, 0.9) 49px 50px)`
						}}
					>
						<div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_100%),linear-gradient(180deg,transparent_0_100%)]" />
						<div 
							className="absolute rounded-full"
							style={{
								inset: '36px 28px 44px',
								background: `linear-gradient(180deg, transparent 0 40%, rgba(255, 152, 45, 0.14) 40% 43%, transparent 43% 100%), linear-gradient(135deg, transparent 0 15%, rgba(255, 152, 45, 0.9) 16% 18%, transparent 19% 33%, rgba(255, 152, 45, 0.9) 33% 35%, transparent 36% 48%, rgba(255, 152, 45, 0.9) 48% 50%, transparent 51% 64%, rgba(255, 152, 45, 0.9) 64% 66%, transparent 67% 100%)`,
								clipPath: `polygon(0 62%, 11% 63%, 22% 54%, 34% 45%, 45% 49%, 58% 31%, 70% 43%, 81% 27%, 92% 39%, 100% 29%, 100% 100%, 0 100%)`
							}}
						/>
						<div 
							className="absolute rounded-full opacity-[0.85]"
							style={{
								inset: '46px 28px 52px',
								background: `linear-gradient(135deg, transparent 0 18%, rgba(186, 216, 241, 0.95) 19% 21%, transparent 22% 36%, rgba(186, 216, 241, 0.95) 36% 38%, transparent 39% 54%, rgba(186, 216, 241, 0.95) 54% 56%, transparent 57% 71%, rgba(186, 216, 241, 0.95) 71% 73%, transparent 74% 100%)`,
								clipPath: `polygon(0 72%, 12% 70%, 25% 61%, 38% 67%, 50% 49%, 63% 58%, 76% 34%, 88% 45%, 100% 36%, 100% 100%, 0 100%)`
							}}
						/>
						<div className="absolute left-0 right-0 bottom-4 flex justify-evenly text-[#a89b8b] text-[11px] font-bold tracking-[0.04em]">
							{['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month) => (
								<span key={month}>{month}</span>
							))}
						</div>
					</div>
				</article>

				<article className="bg-white border border-[rgba(27,46,61,0.07)] rounded-[24px] shadow-[0_12px_22px_rgba(21,42,53,0.05)] p-[22px_24px_24px] box-border">
							<div className="flex items-start justify-between gap-[18px] mb-[18px]">
								<h2 className="m-0 text-[#111111] text-[18px] font-bold">Zonas con Mayor Actividad</h2>
							</div>
					<div className="grid gap-[18px] mt-[2px]">
						{hotspots.map((hotspot) => (
							<div key={hotspot.name} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 items-center">
								<div 
									className="w-10 h-10 rounded-xl shadow-[0_6px_16px_rgba(21,42,53,0.12)]" 
									style={{
										background: hotspot.tone === 'warm' ? 'linear-gradient(135deg, #2f3c54, #12161b 55%, #ffb25d)' : hotspot.tone === 'cool' ? 'linear-gradient(135deg, #0c1a2b, #2a4a68 55%, #ced9e3)' : 'linear-gradient(135deg, #4e3924, #11171f 55%, #f3c873)'
									}}
								/>
								<div className="min-w-0">
									<div className="flex items-center justify-between gap-3">
										<div className="text-[14px] font-semibold text-[#171717]">{hotspot.name}</div>
										<div className="text-[14px] font-semibold text-[#171717]">{hotspot.value}</div>
									</div>
									<div className="mt-2.5 h-[5px] rounded-full bg-[#d8e7f5] overflow-hidden">
										<span className="block h-full rounded-[inherit] bg-[linear-gradient(90deg,#ff9d34,#ffd093)]" style={{ width: hotspot.width }} />
									</div>
								</div>
							</div>
						))}
					</div>
					<a className="inline-block mt-6 text-[#b7771a] text-[13px] font-semibold no-underline" href="/dashboard">Ver Mapa de Calor Detallado</a>
				</article>
			</section>

			<section className="grid grid-cols-1 xl:grid-cols-[1.95fr_minmax(300px,1fr)] gap-5 mt-[18px] items-stretch">
				<article className="bg-white border border-[rgba(27,46,61,0.07)] rounded-[24px] shadow-[0_12px_22px_rgba(21,42,53,0.05)] p-[22px_24px_24px] box-border min-h-[350px]">
					<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[18px]">
						<div>
							<h2 className="m-0 text-[#111111] text-[18px] font-bold">Comentarios Recientes</h2>
							<p className="m-[6px_0_0] text-[#9b917f] text-[13px]">Últimas 48 horas</p>
						</div>
					</div>
					<div className="grid gap-3 mt-2">
						{feedback.map((item) => (
							<div key={item.name} className="rounded-2xl border border-[rgba(27,46,61,0.08)] bg-[#fafbfd] p-[14px_16px]">
								<div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_minmax(0,1fr)_auto] gap-3 items-center">
									<Avatar initials={item.initials} />
									<div>
										<strong className="text-[#161616] text-[13px]">{item.name}</strong>
										<div className="text-[#ff9d34] tracking-[0.12em] mt-[2px] text-[12px]">{'★★★★★'.slice(0, item.rating)}</div>
									</div>
									<span className="col-start-2 sm:col-start-auto text-[#a19a90] text-[11px]">{item.time}</span>
								</div>
								<p className="m-[8px_0_0] text-[#6d6d6d] text-[13px] leading-[1.55]">“{item.text}”</p>
							</div>
						))}
					</div>
				</article>

				<article className="bg-white border border-[rgba(27,46,61,0.07)] rounded-[24px] shadow-[0_12px_22px_rgba(21,42,53,0.05)] p-[18px] sm:p-[22px_24px_24px] box-border min-h-[350px]">
					<div className="flex items-start justify-between gap-[18px]">
						<h2 className="m-0 text-[#111111] text-[18px] font-bold">Conductores Más Destacados</h2>
					</div>
					<table className="w-full border-collapse mt-1.5">
						<thead>
							<tr>
								<th className="p-[12px_4px_14px] sm:p-[12px_8px_14px] text-[#9197a3] text-[11px] font-extrabold tracking-[0.08em] text-left">Conductor</th>
								<th className="p-[12px_4px_14px] sm:p-[12px_8px_14px] text-[#9197a3] text-[11px] font-extrabold tracking-[0.08em] text-left">Viajes</th>
								<th className="p-[12px_4px_14px] sm:p-[12px_8px_14px] text-[#9197a3] text-[11px] font-extrabold tracking-[0.08em] text-left">Calif.</th>
								<th className="p-[12px_4px_14px] sm:p-[12px_8px_14px] text-[#9197a3] text-[11px] font-extrabold tracking-[0.08em] text-left">Estado</th>
							</tr>
						</thead>
						<tbody>
							{drivers.map((driver) => (
								<tr key={driver.name}>
									<td className="p-[12px_4px] sm:p-[12px_8px] border-t border-[rgba(27,46,61,0.06)] text-[#191919] text-[14px]">
										<div className="flex items-center gap-2.5 font-semibold">
											<Avatar initials={driver.name.split(' ').map((part) => part[0]).join('').slice(0, 2)} />
											<span>{driver.name}</span>
										</div>
									</td>
									<td className="p-[12px_4px] sm:p-[12px_8px] border-t border-[rgba(27,46,61,0.06)] text-[#191919] text-[14px]">{driver.trips}</td>
									<td className="p-[12px_4px] sm:p-[12px_8px] border-t border-[rgba(27,46,61,0.06)] text-[#191919] text-[14px]">
										<span className="text-[#464646] font-semibold">★ {driver.rating}</span>
									</td>
									<td className="p-[12px_4px] sm:p-[12px_8px] border-t border-[rgba(27,46,61,0.06)] text-[#191919] text-[14px]">
										<span className={`inline-flex items-center p-[5px_10px] rounded-full text-[11px] font-bold ${driver.status === 'En Ruta' ? 'bg-[#d9edf8] text-[#62819c]' : 'bg-[#eef3f5] text-[#5a6772]'}`}>{driver.status}</span>
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