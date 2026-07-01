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
      <span>{label}</span>
    </button>
  )
}

function Field({ label, placeholder, value, onChange, readOnly = false, textarea = false, type = 'text', options = null }) {
  const baseStyle = {
    width: '100%',
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    outline: 'none',
    padding: '12px 16px',
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
        {options ? (
          <select
            value={value}
            onChange={onChange}
            disabled={readOnly}
            style={{
              ...baseStyle,
              height: 48,
              paddingTop: 0,
              paddingBottom: 0,
              appearance: readOnly ? 'none' : 'auto',
              cursor: readOnly ? 'default' : 'pointer',
            }}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : textarea ? (
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
            type={type}
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

export default function ServiceRequestFormModal({
  title,
  description,
  request,
  readOnly = false,
  submitLabel,
  onClose,
  onSubmit,
  closeLabel = 'Cancelar',
}) {
  const [form, setForm] = useState(request)

  useEffect(() => {
    setForm(request)
  }, [request])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(form)
    }
  }

  const serviceTypes = ['Transporte Ejecutivo', 'Servicio Empresarial', 'Servicio Día Completo', 'Traslado Aeropuerto'];
  const statuses = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'];
  const priorities = ['Alta', 'Media', 'Baja'];

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
        aria-labelledby="sr-form-title"
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
                Solicitud
              </p>
              <h2 id="sr-form-title" style={{ margin: '10px 0 0', color: '#11384a', fontSize: 28, lineHeight: 1.05, fontWeight: 700, fontFamily: 'Georgia, Times New Roman, serif' }}>
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
            <Field label="Código" placeholder="SOL-2025-001" value={form.code} onChange={updateField('code')} readOnly={readOnly} />
            <Field label="Cliente" placeholder="Nombre del cliente" value={form.client} onChange={updateField('client')} readOnly={readOnly} />
            <Field label="Correo del Cliente" placeholder="cliente@dominio.com" value={form.clientEmail} onChange={updateField('clientEmail')} readOnly={readOnly} />
            <Field label="Conductor Asignado" placeholder="Nombre del conductor" value={form.driver} onChange={updateField('driver')} readOnly={readOnly} />
            <Field label="Vehículo" placeholder="ABC-123" value={form.vehicle} onChange={updateField('vehicle')} readOnly={readOnly} />
            <Field label="Tipo de Servicio" value={form.serviceType} onChange={updateField('serviceType')} readOnly={readOnly} options={serviceTypes} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Descripción" placeholder="Detalles del servicio solicitado..." textarea value={form.description} onChange={updateField('description')} readOnly={readOnly} />
            </div>
            <Field label="Origen" placeholder="Dirección de recogida" value={form.origin} onChange={updateField('origin')} readOnly={readOnly} />
            <Field label="Destino" placeholder="Dirección de destino" value={form.destination} onChange={updateField('destination')} readOnly={readOnly} />
            <Field label="Fecha Programada" type="date" value={form.scheduledDate} onChange={updateField('scheduledDate')} readOnly={readOnly} />
            <Field label="Prioridad" value={form.priority} onChange={updateField('priority')} readOnly={readOnly} options={priorities} />
            {readOnly && (
              <>
                <Field label="Estado" value={form.status} onChange={updateField('status')} readOnly options={statuses} />
                <Field label="Creado por" value={form.createdBy} readOnly />
              </>
            )}
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
          {!readOnly && (
            <PrimaryButton label={submitLabel} onClick={handleSubmit}>
              <span>{submitLabel}</span>
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  )
}
