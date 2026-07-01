import { Link } from 'react-router-dom'

const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
  backdrop: 'rgba(20, 45, 61, 0.78)',
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function InputIcon({ children }) {
  return <span aria-hidden="true" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6c5f52' }}>{children}</span>
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15">
      <path d="M4 6.8h16v10.4H4z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m5.5 8.5 6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15">
      <path d="M8 5.8c.8 2.2 2 4.2 3.8 6 1.8 1.8 3.8 3 6 3.8l1.8-1.8c.5-.5 1.2-.7 1.9-.5l2.2.7c.8.3 1.3 1 1.3 1.8v2.1c0 1-.8 1.8-1.8 1.8C11.6 21 3 12.4 3 2.8 3 1.8 3.8 1 4.8 1h2.1c.8 0 1.5.5 1.8 1.3l.7 2.2c.2.7 0 1.4-.5 1.9L8 5.8Z" transform="scale(.72) translate(2.8 2.8)" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15">
      <path d="M12 21s6-6 6-11a6 6 0 1 0-12 0c0 5 6 11 6 11Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function PrimarySubmitButton() {
  return (
    <button
      type="button"
      style={{
        minWidth: 214,
        height: 48,
        borderRadius: 16,
        border: 0,
        background: colors.accent,
        color: colors.surface,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '0 24px',
        boxShadow: '0 8px 16px rgba(255, 154, 47, 0.28)',
        fontSize: 16,
        fontWeight: 400,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          border: '1.6px solid rgba(255,255,255,0.9)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          lineHeight: 1,
        }}
      >
        ✓
      </span>
      <span>Registrar Cliente</span>
    </button>
  )
}

function Field({ label, placeholder, icon, fullWidth = false, textarea = false }) {
  return (
    <label style={{ display: 'block', width: fullWidth ? '100%' : '100%' }}>
      <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        {icon ? <InputIcon>{icon}</InputIcon> : null}
        {textarea ? (
          <textarea
            rows={4}
            placeholder={placeholder}
            style={{
              width: '100%',
              minHeight: 88,
              resize: 'none',
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              outline: 'none',
              padding: icon ? '12px 16px 12px 44px' : '12px 16px',
              fontSize: 16,
              lineHeight: 1.45,
              color: colors.text,
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(17,17,17,0.03)',
            }}
          />
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              outline: 'none',
              padding: icon ? '0 16px 0 44px' : '0 16px',
              fontSize: 16,
              color: colors.text,
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(17,17,17,0.03)',
            }}
          />
        )}
      </div>
    </label>
  )
}

export default function RegisterClientModal() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 30,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-client-title"
        style={{
          width: 'min(800px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: colors.surface,
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '28px 32px 24px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div style={{ maxWidth: 520 }}>
              <p style={{ margin: 0, color: '#f97316', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Cliente
              </p>
              <h2 id="register-client-title" style={{ margin: '10px 0 0', color: '#11384a', fontSize: 28, lineHeight: 1.05, fontWeight: 700, fontFamily: 'Georgia, Times New Roman, serif' }}>
                Registrar Nuevo Cliente
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                Ingrese los datos para dar de alta un nuevo cliente en la plataforma.
              </p>
            </div>

            <Link to="/clients" aria-label="Cerrar" style={{ color: '#7a6753', textDecoration: 'none', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloseIcon />
            </Link>
          </div>
        </div>

        <div style={{ padding: '28px 32px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '22px 18px' }}>
            <Field label="Nombre Completo" placeholder="Ej: John Doe" />
            <Field label="Identificación (Cédula/ID)" placeholder="123456789-0" />
            <Field label="Correo Electrónico" placeholder="cliente@dominio.com" icon={<MailIcon />} />
            <Field label="Teléfono de Contacto" placeholder="+57 300 000 0000" icon={<PhoneIcon />} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Dirección Principal" placeholder="Av. Principal #123, Ciudad" icon={<LocationIcon />} fullWidth />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Notas / Requerimientos Especiales" placeholder="Información relevante, conductores preferidos, horarios habituales..." textarea fullWidth />
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.border}`, padding: '20px 32px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          <Link to="/clients" style={{ color: '#0d7fa8', textDecoration: 'none', fontSize: 16 }}>Cancelar</Link>
          <PrimarySubmitButton />
        </div>
      </div>
    </div>
  )
}