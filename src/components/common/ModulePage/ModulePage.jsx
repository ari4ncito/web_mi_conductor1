export default function ModulePage({
  title,
  description,
  label = "Módulo",
  stats = [],
  children,
}) {
  return (
    <section
      style={{
        padding: "24px 20px 28px",
        boxSizing: "border-box",
        background: "#f3f6fb",
      }}
    >
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 24 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b8f81', fontSize: 14 }}>
            <span>Admin</span>
            <svg viewBox="0 0 8 12" width="8" height="12" aria-hidden="true">
              <path d="M2 1.5 5.5 6 2 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: '#bb6a00', fontWeight: 700 }}>{label}</span>
          </div>
          <h1 style={{ margin: '8px 0 0', fontSize: 20, lineHeight: 1.1, fontWeight: 400, color: '#111111', fontFamily: 'Georgia, Times New Roman, serif' }}>{title}</h1>
          {description && (
            <p style={{ margin: '10px 0 0', maxWidth: 760, color: '#667085', fontSize: 14, lineHeight: 1.5 }}>
              {description}
            </p>
          )}
        </div>
      </header>

      {stats.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
            marginBottom: 28,
          }}
        >
          {stats.map((stat) => (
            <article
              key={stat.label}
              style={{
                borderRadius: 22,
                background: "#fff",
                border: "1px solid rgba(27,46,61,.07)",
                boxShadow: "0 12px 22px rgba(21,42,53,.06)",
                padding: 22,
              }}
            >
              <div
                style={{
                  color: "#9d917f",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: "#111",
                  fontSize: 28,
                  fontWeight: 800,
                }}
              >
                {stat.value}
              </div>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#667085",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {stat.helper}
              </p>
            </article>
          ))}
        </div>
      )}

      {children}
    </section>
  );
}