export default function ModulePage({
  title,
  description,
  label = "Módulo",
  stats = [],
  children,
}) {
  return (
    <section
      className="p-3 sm:p-5 lg:p-[24px_20px_28px] min-w-0"
      style={{
        boxSizing: "border-box",
        background: "#f3f6fb",
        minHeight: "100%",
      }}
    >
      {description && (
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 24 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: '0', maxWidth: 760, color: '#667085', fontSize: 14, lineHeight: 1.5 }}>
              {description}
            </p>
          </div>
        </header>
      )}

      {stats.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
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