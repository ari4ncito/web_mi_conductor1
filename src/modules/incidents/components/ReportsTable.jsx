const headerStyle = { padding: '18px 20px', color: '#0d3349', fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', textAlign: 'center' };
const cellStyle = { padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' };

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BaseIconButton({ children, title, onClick, color = '#111111' }) {
  return (
    <button type="button" onClick={onClick} title={title} style={{
      width: 36,
      height: 36,
      borderRadius: 12,
      border: '1px solid rgba(17, 17, 17, 0.08)',
      background: '#ffffff',
      color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      cursor: 'pointer',
      boxShadow: '0 4px 10px rgba(18, 39, 52, 0.04)',
    }}>
      {children}
    </button>
  )
}

const BADGE_STYLES = {
  "Crítica": { background: '#FDECEC', color: '#D93025' },
  "Media": { background: '#FFF4DB', color: '#C88600' },
};

const ReportsTable = ({
  incidents,
  selectedIncident,
  onSelectIncident,
}) => {

  const badgeStyle = (prioridad) => {
    return BADGE_STYLES[prioridad] ?? { background: '#EAF8EE', color: '#1E8E3E' };
  };

  return (
    <section style={{ flex: 2, background: '#edf3fa', borderRadius: 22, padding: 28, boxShadow: '0 8px 22px rgba(0,0,0,.05)' }}>

      <div style={{ marginBottom: 24 }}>

        <div>

          <h2 style={{ margin: 0, color: '#17324D' }}>Novedades Recientes</h2>

          <p style={{ marginTop: 5, color: '#8C98A8', fontSize: '.9rem' }}>
            Últimos reportes enviados por los conductores.
          </p>

        </div>

      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>

        <thead>

          <tr>

            <th style={headerStyle}>ID</th>

            <th style={headerStyle}>Conductor</th>

            <th style={headerStyle}>Prioridad</th>

            <th style={headerStyle}>Fecha</th>

            <th style={headerStyle}>Hora</th>

            <th style={headerStyle}>Acción</th>

          </tr>

        </thead>

        <tbody>

          {incidents.map((item, index) => {

            const isSelected = selectedIncident?.id === item.id;

            return (
              <tr
                key={item.id}
                onClick={() => onSelectIncident(item)}
                style={{
                  cursor: 'pointer',
                  transition: '.25s',
                  background: isSelected ? '#EEF5FD' : (index % 2 === 1 ? '#f0f1f3' : '#f8fbff'),
                }}
              >

                <td style={cellStyle}>{item.id}</td>

                <td style={cellStyle}>{item.conductor}</td>

                <td style={cellStyle}>

                  <span style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 20, fontSize: 14, fontWeight: 600, ...badgeStyle(item.prioridad) }}>
                    {item.prioridad}
                  </span>

                </td>

                <td style={cellStyle}>{item.fecha}</td>

                <td style={cellStyle}>{item.hora}</td>

                <td style={cellStyle}>

                  <BaseIconButton title="Ver novedad" color="#111111">
                    <EyeIcon />
                  </BaseIconButton>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </section>
  );

};

export default ReportsTable;