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
        padding: "32px 28px 36px",
        boxSizing: "border-box",
        minHeight: "100vh",
        background: "#f3f6fb",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            margin: "0 0 8px",
            color: "#b2a392",
            fontSize: 12,
            letterSpacing: "0.01em",
          }}
        >
          Admin &rsaquo;{" "}
          <span style={{ color: "#c17d31", fontWeight: 700 }}>
            {label}
          </span>
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: "Georgia, Times New Roman, serif",
            fontSize: "clamp(30px, 2.8vw, 54px)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#111111",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            maxWidth: 760,
            color: "#667085",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

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