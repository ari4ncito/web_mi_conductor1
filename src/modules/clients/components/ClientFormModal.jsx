import { useEffect, useState } from 'react'

const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
  backdrop: 'rgba(20, 45, 61, 0.78)',
  disabled: '#f3f4f6',
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

function PrimaryButton({ children, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      aria-label={label}
    >
      {children}
    </button>
  )
}

function Field({ label, placeholder, icon, value, onChange, readOnly = false, textarea = false }) {
  const baseStyle = {
    width: '100%',
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    outline: 'none',
    padding: icon ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: 16,
    lineHeight: 1.45,
    color: colors.text,
    boxSizing: 'border-box',
    boxShadow: '0 2px 8px rgba(17,17,17,0.03)',
    background: readOnly ? colors.disabled : colors.surface,
  }

  return (
    <label style={{ display: 'block', width: '100%' }}>
      <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        {icon ? <InputIcon>{icon}</InputIcon> : null}
        {textarea ? (
          <textarea
            rows={4}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            style={{
              ...baseStyle,
              minHeight: 88,
              resize: 'none',
              paddingTop: 12,
            }}
          />
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            style={{
              ...baseStyle,
              height: 48,
              paddingTop: 0,
              paddingBottom: 0,
            }}
          />
        )}
      </div>
    </label>
  )
}

export default function ClientFormModal({
  title,
  description,
  client,
  readOnly = false,
  submitLabel,
  onClose,
  onSubmit,
  closeLabel = 'Cancelar',
}) {
  const [form, setForm] = useState(client)

  useEffect(() => {
    setForm(client)
  }, [client])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(form)
    }
  }

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
        aria-labelledby="client-form-title"
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
              <h2 id="client-form-title" style={{ margin: '10px 0 0', color: '#11384a', fontSize: 28, lineHeight: 1.05, fontWeight: 700, fontFamily: 'Georgia, Times New Roman, serif' }}>
                {title}
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              style={{ color: '#7a6753', border: 0, background: 'transparent', width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer' }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div style={{ padding: '28px 32px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '22px 18px' }}>
            <Field label="Nombre Completo" placeholder="Ej: John Doe" value={form.name} onChange={updateField('name')} readOnly={readOnly} />
            <Field label="Identificación (Cédula/ID)" placeholder="123456789-0" value={form.identification} onChange={updateField('identification')} readOnly={readOnly} />
            <Field label="Correo Electrónico" placeholder="cliente@dominio.com" icon={<MailIcon />} value={form.email} onChange={updateField('email')} readOnly={readOnly} />
            <Field label="Teléfono de Contacto" placeholder="+57 300 000 0000" icon={<PhoneIcon />} value={form.phone} onChange={updateField('phone')} readOnly={readOnly} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Dirección Principal" placeholder="Av. Principal #123, Ciudad" icon={<LocationIcon />} value={form.address} onChange={updateField('address')} readOnly={readOnly} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Notas / Requerimientos Especiales" placeholder="Información relevante, conductores preferidos, horarios habituales..." textarea value={form.notes} onChange={updateField('notes')} readOnly={readOnly} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.border}`, padding: '20px 32px 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              color: '#0f172a',
              fontSize: 16,
              borderRadius: 14,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              padding: '0 22px',
              height: 46,
              cursor: 'pointer',
            }}
          >
            {closeLabel}
          </button>
          <PrimaryButton label={submitLabel} onClick={handleSubmit}>
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
            <span>{submitLabel}</span>
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
