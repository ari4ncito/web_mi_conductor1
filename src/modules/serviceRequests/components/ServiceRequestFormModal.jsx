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

function PrimaryButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mc-btn-primary"
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
    padding: '24px',
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
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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

// ── Helpers para extraer nombres del backend ──
function getClientName(client) {
  if (!client) return ''
  if (client.usuario) {
    return `${client.usuario.nombre || ''} ${client.usuario.apellido || ''}`.trim()
  }
  return client.nombre || ''
}

function getClientEmail(client) {
  return client?.usuario?.correo || client?.correo || ''
}

function getDriverName(driver) {
  if (!driver) return ''
  if (driver.usuario) {
    return `${driver.usuario.nombre || ''} ${driver.usuario.apellido || ''}`.trim()
  }
  return driver.nombre || ''
}

function getVehicleLabel(vehicle) {
  if (!vehicle) return ''
  return `${vehicle.placa || ''} - ${vehicle.marca || ''} ${vehicle.modelo || ''}`.trim()
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
  clients = [],
  drivers = [],
  vehicles = [],
}) {
  const [form, setForm] = useState(request)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setForm(request)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [request])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSelectClient = (clientId) => {
    const selected = clients.find((c) => c._id === clientId)
    setForm((current) => ({
      ...current,
      clientId: clientId,
      client: getClientName(selected),
      clientEmail: getClientEmail(selected),
    }))
  }

  const handleSelectVehicle = (vehicleId) => {
    const selected = vehicles.find((v) => v._id === vehicleId)
    setForm((current) => ({
      ...current,
      vehicleId: vehicleId,
      vehicle: getVehicleLabel(selected),
    }))
  }

  const handleSelectDriver = (driverId) => {
    const selected = drivers.find((d) => d._id === driverId)
    setForm((current) => ({
      ...current,
      driverId: driverId,
      driver: getDriverName(selected),
    }))
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(form)
    }
  }

  const [showDriverPicker, setShowDriverPicker] = useState(false)

  const serviceTypes = ['Transporte Ejecutivo', 'Servicio Empresarial', 'Servicio Día Completo', 'Traslado Aeropuerto']
  const statuses = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado']
  const priorities = ['Alta', 'Media', 'Baja']

  // Opciones para selects
  const clientOptions = [
    { value: '', label: 'Seleccionar cliente' },
    ...clients.map((c) => ({ value: c._id, label: getClientName(c) })),
  ]

  const vehicleOptions = [
    { value: '', label: 'Seleccionar vehículo' },
    ...vehicles.map((v) => ({ value: v._id, label: getVehicleLabel(v) })),
  ]

  return (
    <div className="mc-modal-overlay">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-form-title"
        className="mc-modal"
      >
        <div className="mc-modal-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, width: '100%' }}>
            <div style={{ maxWidth: 520 }}>
              <p className="mc-modal-subtitle">
                Solicitud
              </p>
              <h2 id="sr-form-title" className="mc-modal-title">
                {title}
              </h2>
              <p className="mc-modal-desc">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="mc-modal-close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="mc-modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '22px 18px' }}>
            <Field label="Código" placeholder="SOL-2025-001" value={form.code} onChange={updateField('code')} readOnly={readOnly} />

            {/* Cliente — ahora es un select con ObjectIds */}
            <Field
              label="Cliente"
              value={form.clientId}
              onChange={(e) => handleSelectClient(e.target.value)}
              readOnly={readOnly}
              options={clientOptions}
            />

            <Field label="Correo del Cliente" placeholder="cliente@dominio.com" value={form.clientEmail} onChange={updateField('clientEmail')} readOnly={readOnly} />

            {/* Conductor Asignado — dropdown adaptado a datos del backend */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', width: '100%' }}>
                <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Conductor Asignado</div>
                {readOnly ? (
                  <div
                    style={{
                      width: '100%',
                      borderRadius: 12,
                      border: `1px solid ${colors.border}`,
                      padding: '24px',
                      fontSize: 16,
                      lineHeight: 1.45,
                      color: form.driver ? colors.text : '#9ca3af',
                      boxSizing: 'border-box',
                      boxShadow: '0 2px 8px rgba(17,17,17,0.03)',
                      background: colors.disabled,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {form.driver || 'Sin asignar'}
                  </div>
                ) : (
                  <div
                    onClick={() => setShowDriverPicker(!showDriverPicker)}
                    className="mc-btn-secondary"
                  >
                    <span>{form.driver || 'Seleccionar conductor'}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: '#9ca3af' }}>
                      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </label>

              {!readOnly && showDriverPicker && (
                <div
                  className="mc-btn-secondary"
                >
                  {drivers.length === 0 && (
                    <div className="mc-modal-desc">
                      No hay conductores disponibles
                    </div>
                  )}
                  {drivers.map((driver) => {
                    const isAvailable = driver.disponible === true
                    const isSelected = form.driverId === driver._id
                    const driverName = getDriverName(driver)
                    return (
                      <div
                        key={driver._id}
                        onClick={() => {
                          if (!isAvailable) return
                          handleSelectDriver(driver._id)
                          setShowDriverPicker(false)
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '24px',
                          borderRadius: 10,
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          opacity: isAvailable ? 1 : 0.5,
                          background: isSelected ? '#fff7ed' : 'transparent',
                          border: isSelected ? `1px solid ${colors.accent}` : '1px solid transparent',
                          marginBottom: 4,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { if (isAvailable && !isSelected) e.currentTarget.style.background = '#f9fafb' }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                      >
                        <img
                          src={driver.usuario?.foto || 'https://via.placeholder.com/40'}
                          alt=""
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: colors.text, fontSize: 15, fontWeight: 500 }}>{driverName}</div>
                          <div style={{ color: colors.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: isAvailable ? '#22c55e' : '#9ca3af',
                                flexShrink: 0,
                              }}
                            />
                            {isAvailable ? 'Disponible' : 'En servicio'}
                            {driver.licencia && <>{' · '}{driver.licencia}</>}
                          </div>
                        </div>
                        {isSelected && (
                          <span style={{ color: colors.accent, fontWeight: 700, fontSize: 16 }}>✓</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Vehículo — ahora es un select con ObjectIds */}
            <Field
              label="Vehículo"
              value={form.vehicleId}
              onChange={(e) => handleSelectVehicle(e.target.value)}
              readOnly={readOnly}
              options={vehicleOptions}
            />

            <Field label="Tipo de Servicio" value={form.serviceType} onChange={updateField('serviceType')} readOnly={readOnly} options={serviceTypes.map((s) => ({ value: s, label: s }))} />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Descripción" placeholder="Detalles del servicio solicitado..." textarea value={form.description} onChange={updateField('description')} readOnly={readOnly} />
            </div>
            <Field label="Origen" placeholder="Dirección de recogida" value={form.origin} onChange={updateField('origin')} readOnly={readOnly} />
            <Field label="Destino" placeholder="Dirección de destino" value={form.destination} onChange={updateField('destination')} readOnly={readOnly} />
            <Field label="Fecha Programada" type="date" value={form.scheduledDate} onChange={updateField('scheduledDate')} readOnly={readOnly} />
            <Field label="Prioridad" value={form.priority} onChange={updateField('priority')} readOnly={readOnly} options={priorities.map((p) => ({ value: p, label: p }))} />
            {readOnly && (
              <>
                <Field label="Estado" value={form.status} onChange={updateField('status')} readOnly options={statuses.map((s) => ({ value: s, label: s }))} />
                <Field label="Creado por" value={form.createdBy} readOnly />
              </>
            )}
          </div>
        </div>

        <div className="mc-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-secondary"
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
