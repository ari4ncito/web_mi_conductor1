# Frontend
## Todo lo que esta aqui esta completo y como esta actualmente.
**src/modules/serviceRequests:**
*components:*
import { useState, useMemo } from 'react'

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
      <path d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L10 1.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
      <path d="M10 1.5a6.3 6.3 0 0 0-6.3 6.3C3.7 12 10 18.5 10 18.5s6.3-6.5 6.3-10.7A6.3 6.3 0 0 0 10 1.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="10" cy="7.5" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/** Mock distances for each driver — replace with real geolocation data later */
const MOCK_DISTANCES = {
  d1: { value: 1.2, unit: 'km' },
  d2: { value: 0.8, unit: 'km' },
  d3: { value: 3.4, unit: 'km' },
  d4: { value: 0.5, unit: 'km' },
  d5: { value: 2.1, unit: 'km' },
}

function distanceLabel(driverId) {
  const d = MOCK_DISTANCES[driverId]
  if (!d) return 'A 1.5 km'
  return `A ${d.value} ${d.unit}`
}

function getDriverName(driver) {
  if (!driver) return ''
  if (driver.usuario) {
    return `${driver.usuario.nombre || ''} ${driver.usuario.apellido || ''}`.trim()
  }
  return driver.nombre || ''
}

function getDriverPhoto(driver) {
  if (driver?.usuario?.foto) return driver.usuario.foto
  return 'https://via.placeholder.com/52'
}

export default function AssignDriverModal({ onClose, onAssign, drivers = [] }) {
  const [selectedDriverId, setSelectedDriverId] = useState(null)

  const availableDrivers = useMemo(() => {
    return drivers.filter((d) => d.disponible === true)
  }, [drivers])

  const handleConfirm = () => {
    if (!selectedDriverId) return
    const driver = drivers.find((d) => d._id === selectedDriverId)
    if (!driver) return

    onAssign({
      driverId: driver._id,
      driverName: getDriverName(driver),
    })
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
        zIndex: 40,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-driver-title"
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
        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={{ padding: '28px 32px 24px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#f97316', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Asignación
              </p>
              <h2 id="assign-driver-title" style={{ margin: '10px 0 0', fontSize: 26, fontWeight: 700, color: '#11384a', lineHeight: 1.1 }}>
                Asignar conductor
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.4 }}>
                Seleccione un conductor disponible para esta solicitud.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              style={{ width: 36, height: 36, borderRadius: 12, border: `1px solid ${colors.border}`, background: colors.surface, display: 'grid', placeItems: 'center', padding: 0, cursor: 'pointer', color: '#111111', flexShrink: 0 }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div style={{ padding: 28, overflowY: 'auto', flex: 1, minHeight: 200 }}>
          {availableDrivers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textMuted, fontSize: 16 }}>
              No hay conductores disponibles en este momento.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {availableDrivers.map((driver) => {
                const isSelected = selectedDriverId === driver._id
                const driverName = getDriverName(driver)
                const driverPhoto = getDriverPhoto(driver)

                return (
                  <button
                    key={driver._id}
                    type="button"
                    onClick={() => setSelectedDriverId(driver._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      width: '100%',
                      padding: 18,
                      borderRadius: 18,
                      border: `1.5px solid ${isSelected ? colors.accent : colors.border}`,
                      background: isSelected ? '#fffcf5' : colors.surface,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 16px rgba(255, 154, 47, 0.15)' : 'none',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = '#ffd599' }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = colors.border }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: '#f0f0f0',
                        border: isSelected ? '2px solid #ff9a2f' : '2px solid transparent',
                      }}
                    >
                      <img
                        src={driverPhoto}
                        alt={driverName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ color: '#111111', fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>
                          {driverName}
                        </div>

                        {/* Rating */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#f59e0b', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                          <StarIcon />
                          <span>{driver?.rating ?? '5.0'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#16a34a', fontSize: 14, fontWeight: 500 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                          Disponible
                        </span>
                      </div>

                      {/* Distance row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, color: '#667085', fontSize: 14 }}>
                        <LocationIcon />
                        <span>{distanceLabel(driver._id)}</span>
                      </div>
                    </div>

                    {/* Checkmark */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: isSelected ? '#ff9a2f' : '#e5e7eb',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected && <CheckIcon />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'flex-end', gap: 16, borderTop: `1px solid ${colors.border}` }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 46,
              padding: '0 22px',
              borderRadius: 14,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              color: colors.text,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedDriverId}
            style={{
              height: 46,
              padding: '0 24px',
              borderRadius: 14,
              border: 0,
              background: !selectedDriverId ? '#d1d5db' : colors.accent,
              color: !selectedDriverId ? '#9ca3af' : colors.surface,
              fontSize: 16,
              cursor: !selectedDriverId ? 'not-allowed' : 'pointer',
              boxShadow: selectedDriverId ? '0 8px 16px rgba(255, 154, 47, 0.28)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 500,
            }}
          >
            <CheckIcon />
            Asignar conductor
          </button>
        </div>
      </div>
    </div>
  )
}
---------------
import { Link } from 'react-router-dom'

function BaseIconButton({ children, title, onClick, to, color = '#111111' }) {
  const sharedStyle = {
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
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(18, 39, 52, 0.04)',
  }

  if (to) {
    return (
      <Link to={to} title={title} style={sharedStyle}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} title={title} style={sharedStyle}>
      {children}
    </button>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M9 7V5.5h6V7M8 7l.8 12h6.4L16 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function StatusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5l3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function EditActionButton({ to }) {
  return (
    <BaseIconButton title="Editar" to={to}>
      <PencilIcon />
    </BaseIconButton>
  )
}

export function ViewActionButton({ to }) {
  return (
    <BaseIconButton title="Ver detalle" to={to}>
      <EyeIcon />
    </BaseIconButton>
  )
}

export function DeleteActionButton({ onClick }) {
  return (
    <BaseIconButton title="Eliminar" onClick={onClick} color="#c64a4a">
      <TrashIcon />
    </BaseIconButton>
  )
}

export function StatusActionButton({ onClick }) {
  return (
    <BaseIconButton title="Cambiar estado" onClick={onClick} color="#2563eb">
      <StatusIcon />
    </BaseIconButton>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 21c.8-3.5 3.6-6 8-6s7.2 2.5 8 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function AssignActionButton({ onClick }) {
  return (
    <BaseIconButton title="Asignar conductor" onClick={onClick} color="#2563eb">
      <PersonIcon />
    </BaseIconButton>
  )
}
-------------
const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
  backdrop: 'rgba(20, 45, 61, 0.78)',
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 4.5 20 18H4L12 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9v4.5M12 16.8h.01" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default function ServiceRequestConfirmDialog({ title, description, onCancel, onConfirm, confirmLabel = 'Eliminar' }) {
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
        zIndex: 40,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-confirm-title"
        style={{
          width: 'min(560px, calc(100% - 40px))',
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
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255, 154, 47, 0.14)', color: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <WarningIcon />
            </div>
            <div>
              <p style={{ margin: 0, color: '#f97316', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Confirmación
              </p>
              <h2 id="sr-confirm-title" style={{ margin: '10px 0 0', fontSize: 26, fontWeight: 700, color: '#11384a', lineHeight: 1.1 }}>
                {title}
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                {description}
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 46,
              padding: '0 22px',
              borderRadius: 14,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              color: colors.text,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              height: 46,
              padding: '0 22px',
              borderRadius: 14,
              border: 0,
              background: '#d64545',
              color: colors.surface,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(214, 69, 69, 0.22)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
------------
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
                      padding: '12px 16px',
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
                    style={{
                      width: '100%',
                      borderRadius: 12,
                      border: `1px solid ${colors.border}`,
                      padding: '12px 16px',
                      fontSize: 16,
                      lineHeight: 1.45,
                      color: form.driver ? colors.text : '#9ca3af',
                      boxSizing: 'border-box',
                      boxShadow: '0 2px 8px rgba(17,17,17,0.03)',
                      background: colors.surface,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
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
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 4,
                    background: '#ffffff',
                    borderRadius: 12,
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    maxHeight: 280,
                    overflowY: 'auto',
                    padding: 8,
                  }}
                >
                  {drivers.length === 0 && (
                    <div style={{ padding: 16, textAlign: 'center', color: colors.textMuted, fontSize: 14 }}>
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
                          padding: '10px 12px',
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
-------------
const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const statusConfig = {
  'Pendiente': { color: '#f97316', bg: '#fff7ed', label: 'Pendiente' },
  'En Proceso': { color: '#2563eb', bg: '#eff6ff', label: 'En Proceso' },
  'Completado': { color: '#16a34a', bg: '#f0fdf4', label: 'Completado' },
  'Cancelado': { color: '#dc2626', bg: '#fef2f2', label: 'Cancelado' },
};

export default function ServiceRequestStatusModal({ request, onClose, onChangeStatus }) {
  const statuses = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'];
  const currentStatus = request?.status || 'Pendiente';

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
        zIndex: 40,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-status-title"
        style={{
          width: 'min(480px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: colors.surface,
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ padding: '28px 32px 24px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <p style={{ margin: 0, color: '#f97316', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Estado
              </p>
              <h2 id="sr-status-title" style={{ margin: '10px 0 0', fontSize: 26, fontWeight: 700, color: '#11384a', lineHeight: 1.1 }}>
                Cambiar Estado
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                Seleccione el nuevo estado para la solicitud <strong>{request?.code}</strong>.
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

        <div style={{ padding: '24px 32px' }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ color: '#6b5e52', fontSize: 16 }}>Estado actual: </span>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              background: statusConfig[currentStatus]?.bg || '#f3f4f6',
              color: statusConfig[currentStatus]?.color || '#374151',
            }}>
              {currentStatus}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {statuses.filter(s => s !== currentStatus).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onChangeStatus(status)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 14,
                  border: `1px solid ${colors.border}`,
                  background: statusConfig[status]?.bg || '#ffffff',
                  color: statusConfig[status]?.color || '#111111',
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: statusConfig[status]?.color || '#999',
                  display: 'inline-block',
                }} />
                {status}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.border}`, padding: '20px 32px 24px', display: 'flex', justifyContent: 'flex-end' }}>
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
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
-------------
**src/modules/serviceRequests/pages**
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ViewActionButton, DeleteActionButton, AssignActionButton } from '../components/ServiceRequestActions.jsx'

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
  success: '#2cc04f',
}

const statusConfig = {
  'Pendiente': { color: '#f97316', bg: '#fff7ed', dot: '#f97316' },
  'En Proceso': { color: '#2563eb', bg: '#eff6ff', dot: '#2563eb' },
  'Completado': { color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
  'Cancelado': { color: '#dc2626', bg: '#fef2f2', dot: '#dc2626' },
};

function BreadcrumbArrow() {
  return (
    <svg viewBox="0 0 8 12" width="8" height="12" aria-hidden="true">
      <path d="M2 1.5 5.5 6 2 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon({ size = 18, color = '#b3b7bf' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ color }}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: '#2b2b2b' }}>
      <path d="M12 4a4.5 4.5 0 0 0-4.5 4.5V11c0 .8-.3 1.6-.8 2.1L5.5 15h13l-1.2-1.9c-.5-.5-.8-1.3-.8-2.1V8.5A4.5 4.5 0 0 0 12 4Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M10 18.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M8.5 12.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14.5 9.5v5M12 12h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M3.8 19c.8-2.8 3.4-4.8 6.4-4.8s5.6 2 6.4 4.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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

function OrangeButton() {
  return (
    <Link
      to="/service-requests/register"
      style={{
        minWidth: 192,
        height: 44,
        borderRadius: 14,
        background: colors.accent,
        color: '#111111',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '0 18px',
        fontSize: 16,
        fontWeight: 400,
        textDecoration: 'none',
        boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)',
      }}
    >
      <PlusIcon />
      <span>Registrar Solicitud</span>
    </Link>
  )
}

function SearchPill({ value, onChange }) {
  return (
    <div
      style={{
        width: 250,
        height: 66,
        borderRadius: 18,
        background: '#dfeeff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        padding: '0 18px',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ width: 18, display: 'inline-flex', flexShrink: 0 }}>
        <SearchIcon size={18} color="#9aa5b1" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar solicitud..."
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 18,
          lineHeight: 1.15,
          color: '#1f2937',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

function TableActionIcon({ children }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#111111' }}>
      {children}
    </span>
  )
}

function FilterIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="16" height="16">
        <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    </TableActionIcon>
  )
}

function CalendarIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="16" height="16">
        <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 3.5v4M16 3.5v4M4 9h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </TableActionIcon>
  )
}

function DownloadIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M12 4v9M8.5 9.5 12 13l3.5-3.5M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </TableActionIcon>
  )
}

function PrintIcon() {
  return (
    <TableActionIcon>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M7 8V4h10v4M7 17h10v3H7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M5 9h14a2 2 0 0 1 2 2v4H17v-2H7v2H3v-4a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    </TableActionIcon>
  )
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { color: '#374151', bg: '#f3f4f6', dot: '#9ca3af' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 14px',
      borderRadius: 20,
      fontSize: 14,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {status}
    </span>
  )
}

export default function ServiceRequestsPage({
  requests = [],
  loading = false,
  error = null,
  onRequestDelete,
  onAssignDriver,
  searchQuery = '',
  onSearchChange,
  filterStatus = '',
  onFilterStatusChange,
  filterDateFrom = '',
  filterDateTo = '',
  onFilterDateChange,
  onClearFilters,
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const statusOptions = ['', 'Pendiente', 'En Proceso', 'Completado', 'Cancelado'];

  const activeFilters = (filterStatus || filterDateFrom || filterDateTo);

  const totalRequests = requests.length;
  const enProceso = requests.filter(r => r.status === 'En Proceso').length;
  const completados = requests.filter(r => r.status === 'Completado').length;

  return (
    <main style={{ flex: 1, minWidth: 0, padding: '44px 24px 32px 28px', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 34 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b8f81', fontSize: 16 }}>
            <span>Admin</span>
            <BreadcrumbArrow />
            <span>Ejecución</span>
            <BreadcrumbArrow />
            <span style={{ color: '#bb6a00', fontWeight: 700 }}>Solicitudes</span>
          </div>
          <h1 style={{ margin: '8px 0 0', fontSize: 22, lineHeight: 1.1, fontWeight: 400, color: '#111111', fontFamily: 'Georgia, Times New Roman, serif' }}>Solicitudes</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 2 }}>
          <OrangeButton />
          <HeaderAction width={40} height={44} background="#dceafb">
            <BellIcon />
          </HeaderAction>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20, marginBottom: 34 }}>
        <MetricCard label="Total solicitudes" value={totalRequests.toLocaleString()} detail="+8% este mes" accent />
        <MetricCard label="En ejecución" value={enProceso.toLocaleString()} detail="Servicios activos" />
        <MetricCard label="Completados" value={completados.toLocaleString()} detail="Servicios finalizados" />
      </section>

      <section style={{ background: colors.surface, borderRadius: 28, border: `1px solid ${colors.border}`, boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowDateDropdown(false); }}
                style={{ height: 44, borderRadius: 12, border: 0, background: '#dceafb', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 10, color: '#1f2937', fontSize: 16, cursor: 'pointer' }}
              >
                <FilterIcon />
                <span>{filterStatus || 'Filter By Status'}</span>
              </button>
              {showStatusDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 4,
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1px solid rgba(27, 46, 61, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 20,
                    minWidth: 180,
                    overflow: 'hidden',
                  }}
                >
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { onFilterStatusChange(opt); setShowStatusDropdown(false); }}
                      style={{
                        width: '100%',
                        padding: '10px 18px',
                        border: 'none',
                        background: filterStatus === opt ? '#dceafb' : 'transparent',
                        color: '#1f2937',
                        fontSize: 15,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'block',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f5fe'}
                      onMouseLeave={(e) => e.currentTarget.style.background = filterStatus === opt ? '#dceafb' : 'transparent'}
                    >
                      {opt || 'Todos'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => { setShowDateDropdown(!showDateDropdown); setShowStatusDropdown(false); }}
                style={{ height: 44, borderRadius: 12, border: 0, background: '#dceafb', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 10, color: '#1f2937', fontSize: 16, cursor: 'pointer' }}
              >
                <CalendarIcon />
                <span>Scheduled Date</span>
              </button>
              {showDateDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 4,
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1px solid rgba(27, 46, 61, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 20,
                    minWidth: 240,
                    padding: 16,
                  }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: 13, color: '#667085', marginBottom: 4 }}>Desde</label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => onFilterDateChange(e.target.value, filterDateTo)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 13, color: '#667085', marginBottom: 4 }}>Hasta</label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => onFilterDateChange(filterDateFrom, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => { onFilterDateChange('', ''); setShowDateDropdown(false); }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(27, 46, 61, 0.12)',
                        background: '#fff',
                        color: '#667085',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              )}
            </div>
            {activeFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                style={{ height: 44, borderRadius: 12, border: 0, background: '#fee2e2', padding: '0 18px', display: 'inline-flex', alignItems: 'center', gap: 10, color: '#991b1b', fontSize: 16, cursor: 'pointer' }}
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>

          <SearchPill value={searchQuery} onChange={onSearchChange} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingRight: 6 }}>
            <button type="button" aria-label="Descargar" style={{ border: 0, background: 'transparent', padding: 0, color: '#111111' }}>
              <DownloadIcon />
            </button>
            <button type="button" aria-label="Imprimir" style={{ border: 0, background: 'transparent', padding: 0, color: '#111111' }}>
              <PrintIcon />
            </button>
          </div>
        </div>

        {/* ── Estados de carga / error ── */}
        {loading && (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#667085', fontSize: 16 }}>
            Cargando solicitudes...
          </div>
        )}

        {error && !loading && (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#dc2626', fontSize: 16, background: '#fef2f2' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ background: '#edf3fa' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['SOLICITUD', 'CLIENTE', 'CONDUCTOR', 'VEHÍCULO', 'ESTADO', 'ACCIONES'].map((label) => (
                    <th key={label} style={{ padding: '18px 20px', color: '#0d3349', fontSize: 16, fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', textAlign: 'center' }}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((row, index) => (
                  <tr key={row.id} style={{ background: index % 2 === 1 ? '#f0f1f3' : '#f8fbff' }}>
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ color: '#111111', fontSize: 16, lineHeight: 1.2, fontWeight: 600 }}>{row.code}</div>
                          <div style={{ color: '#667085', fontSize: 14, lineHeight: 1.2, marginTop: 2 }}>{row.serviceType}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' }}>{row.client}</td>
                    <td style={{ padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' }}>{row.driver}</td>
                    <td style={{ padding: '18px 20px', color: '#111111', fontSize: 16, textAlign: 'center' }}>{row.vehicle}</td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <StatusBadge status={row.status} />
                    </td>
                    <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                        {row.status === 'Pendiente' ? (
                          <AssignActionButton onClick={() => onAssignDriver(row)} />
                        ) : null}
                        <ViewActionButton to={`/service-requests/${row.id}`} />
                        <DeleteActionButton onClick={() => onRequestDelete(row)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px 24px', background: '#e8f1fb' }}>
          <div style={{ color: '#111111', fontSize: 16 }}>Mostrando {requests.length} solicitudes</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" style={{ width: 28, height: 40, borderRadius: 10, border: '1px solid rgba(17,17,17,0.08)', background: colors.surface, color: '#111111', display: 'grid', placeItems: 'center', padding: 0 }}>
              <BreadcrumbArrow />
            </button>
            <button type="button" style={{ width: 38, height: 48, borderRadius: 10, border: 0, background: colors.accent, color: '#111111', fontSize: 18, fontWeight: 400 }}>1</button>
            <button type="button" style={{ width: 38, height: 48, borderRadius: 10, border: 0, background: 'transparent', color: '#111111', fontSize: 18 }}>2</button>
            <button type="button" style={{ width: 38, height: 48, borderRadius: 10, border: 0, background: 'transparent', color: '#111111', fontSize: 18 }}>3</button>
            <button type="button" style={{ width: 28, height: 40, borderRadius: 10, border: '1px solid rgba(17,17,17,0.08)', background: colors.surface, color: '#111111', display: 'grid', placeItems: 'center', padding: 0, transform: 'rotate(180deg)' }}>
              <BreadcrumbArrow />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
---------------
import { useState, useMemo, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    getServiceRequests,
    saveServiceRequest,
    deleteServiceRequest,
    assignDriver,
    cancelServiceRequest,
    completeServiceRequest,
    createEmptyServiceRequest,
} from '../services/serviceRequestStorage.js'
import clienteApi from '../services/clienteApi.js'
import conductorApi from '../services/conductorApi.js'
import vehiculoApi from '../services/vehiculoApi.js'
import ServiceRequestConfirmDialog from '../components/ServiceRequestConfirmDialog.jsx'
import ServiceRequestFormModal from '../components/ServiceRequestFormModal.jsx'
import ServiceRequestStatusModal from '../components/ServiceRequestStatusModal.jsx'
import AssignDriverModal from '../components/AssignDriverModal.jsx'
import ServiceRequestsPage from './ServiceRequestsPage.jsx'

export default function ServiceRequestsShell() {
    const location = useLocation()
    const navigate = useNavigate()

    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [deletingRequest, setDeletingRequest] = useState(null)
    const [statusChangeRequest, setStatusChangeRequest] = useState(null)
    const [assigningRequest, setAssigningRequest] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterDateFrom, setFilterDateFrom] = useState('')
    const [filterDateTo, setFilterDateTo] = useState('')

    // Datos auxiliares para los selects del formulario
    const [clients, setClients] = useState([])
    const [drivers, setDrivers] = useState([])
    const [vehicles, setVehicles] = useState([])

    // Cargar solicitudes al montar
    const loadRequests = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getServiceRequests()
            setRequests(data)
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al cargar solicitudes')
            console.error('Error cargando solicitudes:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadRequests()
        }, 0)
        return () => clearTimeout(timeoutId)
    }, [loadRequests])

    // Cargar clientes, conductores y vehículos del backend (solo lectura)
    useEffect(() => {
        async function loadAuxData() {
            try {
                const [clientsRes, driversRes, vehiclesRes] = await Promise.all([
                    clienteApi.getAll(),
                    conductorApi.getAll(),
                    vehiculoApi.getAll(),
                ])
                setClients(clientsRes.data || clientsRes || [])
                setDrivers(driversRes.data || driversRes || [])
                setVehicles(vehiclesRes.data || vehiclesRes || [])
            } catch (err) {
                console.error('Error cargando datos auxiliares:', err)
            }
        }
        loadAuxData()
    }, [])

    const segments = location.pathname.split('/').filter(Boolean)
    const requestId = segments[1]
    const request = requests.find((item) => item.id === requestId)

    const filteredRequests = useMemo(() => {
        let result = requests;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((r) =>
                r.code.toLowerCase().includes(q) ||
                r.client.toLowerCase().includes(q) ||
                r.driver.toLowerCase().includes(q) ||
                r.vehicle.toLowerCase().includes(q) ||
                r.serviceType.toLowerCase().includes(q)
            );
        }

        if (filterStatus) {
            result = result.filter((r) => r.status === filterStatus);
        }

        if (filterDateFrom) {
            result = result.filter((r) => r.scheduledDate >= filterDateFrom);
        }
        if (filterDateTo) {
            result = result.filter((r) => r.scheduledDate <= filterDateTo);
        }

        return result;
    }, [requests, searchQuery, filterStatus, filterDateFrom, filterDateTo]);

    const closeModal = () => {
        navigate('/service-requests', { replace: true })
    }

    const handleDeleteRequest = (row) => {
        setDeletingRequest(row)
    }

    const handleDeleteConfirm = async () => {
        if (deletingRequest) {
            try {
                const updated = await deleteServiceRequest(deletingRequest.id);
                setRequests(updated);
            } catch (err) {
                alert(err.response?.data?.message || 'Error al eliminar la solicitud')
            }
        }
        setDeletingRequest(null)
    }

    const handleSave = async (nextRequest) => {
        try {
            const updated = await saveServiceRequest(nextRequest);
            setRequests(updated);
            closeModal()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar la solicitud')
        }
    }

    const handleClearFilters = () => {
        setSearchQuery('');
        setFilterStatus('');
        setFilterDateFrom('');
        setFilterDateTo('');
    }

    const handleStatusUpdate = async (newStatus) => {
        if (!statusChangeRequest) return;

        try {
            if (newStatus === 'Cancelado') {
                const updated = await cancelServiceRequest(statusChangeRequest.id);
                setRequests(updated);
            } else if (newStatus === 'Completado') {
                const updated = await completeServiceRequest(statusChangeRequest.id);
                setRequests(updated);
            } else {
                // Para Pendiente / En Proceso usamos actualización general
                const updated = await saveServiceRequest({
                    ...statusChangeRequest,
                    status: newStatus,
                });
                setRequests(updated);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error al cambiar el estado')
        }
        setStatusChangeRequest(null);
    }

    const handleAssignDriver = async (driverInfo) => {
        if (!assigningRequest) return;

        try {
            const updated = await assignDriver(assigningRequest.id, driverInfo.driverId);
            setRequests(updated);
        } catch (err) {
            alert(err.response?.data?.message || 'Error al asignar conductor')
        }
        setAssigningRequest(null);
    }

    const pathname = location.pathname
    const isRegisterRoute = pathname.endsWith('/register')
    const isEditRoute = pathname.endsWith('/edit')
    const isDetailRoute = segments.length === 2 && segments[0] === 'service-requests' && !isRegisterRoute && !isEditRoute

    const activeRequest = request || createEmptyServiceRequest()
    const registerTitle = 'Registrar Nueva Solicitud'
    const registerDescription = 'Ingrese los datos para crear una nueva solicitud de servicio en la plataforma.'

    return (
        <div style={{ position: 'relative' }}>
            <ServiceRequestsPage
                requests={filteredRequests}
                loading={loading}
                error={error}
                onRequestDelete={handleDeleteRequest}
                onAssignDriver={setAssigningRequest}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterStatus={filterStatus}
                onFilterStatusChange={setFilterStatus}
                filterDateFrom={filterDateFrom}
                filterDateTo={filterDateTo}
                onFilterDateChange={(from, to) => { setFilterDateFrom(from); setFilterDateTo(to); }}
                onClearFilters={handleClearFilters}
            />

            {isRegisterRoute ? (
                <ServiceRequestFormModal
                    title={registerTitle}
                    description={registerDescription}
                    request={createEmptyServiceRequest()}
                    clients={clients}
                    drivers={drivers}
                    vehicles={vehicles}
                    submitLabel="Registrar Solicitud"
                    closeLabel="Cancelar"
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            ) : null}

            {isEditRoute ? (
                <ServiceRequestFormModal
                    title="Editar Solicitud"
                    description="Actualice los datos de la solicitud de servicio."
                    request={activeRequest}
                    clients={clients}
                    drivers={drivers}
                    vehicles={vehicles}
                    submitLabel="Guardar Cambios"
                    closeLabel="Cancelar"
                    onClose={closeModal}
                    onSubmit={handleSave}
                />
            ) : null}

            {isDetailRoute ? (
                <ServiceRequestFormModal
                    title="Detalle de la Solicitud"
                    description="Toda la información de la solicitud se muestra en modo solo lectura."
                    request={activeRequest}
                    clients={clients}
                    drivers={drivers}
                    vehicles={vehicles}
                    readOnly
                    submitLabel="Cerrar"
                    closeLabel="Cerrar"
                    onClose={closeModal}
                    onSubmit={closeModal}
                />
            ) : null}

            {deletingRequest ? (
                <ServiceRequestConfirmDialog
                    title="Eliminar solicitud"
                    description={`¿Desea eliminar la solicitud ${deletingRequest.code}? Esta acción no se puede deshacer.`}
                    onCancel={() => setDeletingRequest(null)}
                    onConfirm={handleDeleteConfirm}
                    confirmLabel="Eliminar"
                />
            ) : null}

            {statusChangeRequest ? (
                <ServiceRequestStatusModal
                    request={statusChangeRequest}
                    onClose={() => setStatusChangeRequest(null)}
                    onChangeStatus={handleStatusUpdate}
                />
            ) : null}

            {assigningRequest ? (
                <AssignDriverModal
                    onClose={() => setAssigningRequest(null)}
                    onAssign={handleAssignDriver}
                    drivers={drivers}
                />
            ) : null}
        </div>
    )
}
**src/modules/serviceRequests/services**
import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const clienteApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.clientes.getAll);
        return response.data;
    },
};

export default clienteApi;
-------------
import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const conductorApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.conductores.getAll);
        return response.data;
    },
};

export default conductorApi;
------------
import solicitudApi from './solicitudApi.js';

// ── Mapeo de estados ──
const ESTADO_BACKEND_TO_FRONTEND = {
    'PENDIENTE': 'Pendiente',
    'EN_PROCESO': 'En Proceso',
    'COMPLETADO': 'Completado',
    'CANCELADO': 'Cancelado',
};

const ESTADO_FRONTEND_TO_BACKEND = {
    'Pendiente': 'PENDIENTE',
    'En Proceso': 'EN_PROCESO',
    'Completado': 'COMPLETADO',
    'Cancelado': 'CANCELADO',
};

// ── Mapeo de prioridades ──
const PRIORIDAD_BACKEND_TO_FRONTEND = {
    'BAJA': 'Baja',
    'MEDIA': 'Media',
    'ALTA': 'Alta',
    'URGENTE': 'Urgente',
};

const PRIORIDAD_FRONTEND_TO_BACKEND = {
    'Baja': 'BAJA',
    'Media': 'MEDIA',
    'Alta': 'ALTA',
    'Urgente': 'URGENTE',
};

// ── Helpers de transformación ──
function getClientName(cliente) {
    if (!cliente) return '';
    if (cliente.usuario) {
        return `${cliente.usuario.nombre || ''} ${cliente.usuario.apellido || ''}`.trim();
    }
    return cliente.nombre || '';
}

function getDriverName(conductor) {
    if (!conductor) return '';
    if (conductor.usuario) {
        return `${conductor.usuario.nombre || ''} ${conductor.usuario.apellido || ''}`.trim();
    }
    return conductor.nombre || '';
}

function getVehicleLabel(vehiculo) {
    if (!vehiculo) return '';
    return vehiculo.placa || vehiculo.modelo || vehiculo.marca || '';
}

export function mapSolicitudToFrontend(s) {
    if (!s) return null;
    return {
        id: s._id,
        code: s.codigo || '',
        client: getClientName(s.cliente),
        clientId: s.cliente?._id || '',
        clientEmail: s.correoCliente || '',
        driver: getDriverName(s.conductorAsignado),
        driverId: s.conductorAsignado?._id || '',
        vehicle: getVehicleLabel(s.vehiculo),
        vehicleId: s.vehiculo?._id || '',
        serviceType: s.tipoServicio || '',
        description: s.descripcion || '',
        origin: s.origen || '',
        destination: s.destino || '',
        scheduledDate: s.fechaProgramada
            ? new Date(s.fechaProgramada).toISOString().split('T')[0]
            : '',
        status: ESTADO_BACKEND_TO_FRONTEND[s.estado] || s.estado || 'Pendiente',
        priority: PRIORIDAD_BACKEND_TO_FRONTEND[s.prioridad] || s.prioridad || 'Media',
        createdBy: 'Admin',
        createdAt: s.createdAt
            ? new Date(s.createdAt).toISOString().split('T')[0]
            : '',
    };
}

export function mapRequestToBackend(form) {
    const payload = {
        codigo: form.code?.trim().toUpperCase(),
        cliente: form.clientId,
        correoCliente: form.clientEmail?.trim().toLowerCase(),
        tipoServicio: form.serviceType?.trim(),
        descripcion: form.description?.trim(),
        origen: form.origin?.trim(),
        destino: form.destination?.trim(),
        fechaProgramada: form.scheduledDate,
        prioridad: PRIORIDAD_FRONTEND_TO_BACKEND[form.priority] || 'MEDIA',
    };

    if (form.vehicleId) {
        payload.vehiculo = form.vehicleId;
    }

    if (form.status) {
        const estadoBackend = ESTADO_FRONTEND_TO_BACKEND[form.status];
        if (estadoBackend) payload.estado = estadoBackend;
    }

    return payload;
}

// ── API Functions (reemplazan localStorage) ──

export async function getServiceRequests() {
    const response = await solicitudApi.getAll();
    const solicitudes = response.data || response || [];
    return Array.isArray(solicitudes) ? solicitudes.map(mapSolicitudToFrontend) : [];
}

export async function getServiceRequestById(id) {
    const response = await solicitudApi.getById(id);
    const solicitud = response.data || response;
    return mapSolicitudToFrontend(solicitud);
}

export async function saveServiceRequest(form) {
    const payload = mapRequestToBackend(form);

    if (form.id) {
        await solicitudApi.update(form.id, payload);
    } else {
        await solicitudApi.create(payload);
    }

    // Refrescar lista completa desde el backend
    return getServiceRequests();
}

export async function deleteServiceRequest(id) {
    // El backend NO tiene endpoint DELETE físico.
    // Las solicitudes no se eliminan; usamos cancelar como alternativa.
    await solicitudApi.cancel(id);
    return getServiceRequests();
}

export async function assignDriver(solicitudId, driverId) {
    await solicitudApi.assignDriver(solicitudId, driverId);
    return getServiceRequests();
}

export async function cancelServiceRequest(id) {
    await solicitudApi.cancel(id);
    return getServiceRequests();
}

export async function completeServiceRequest(id) {
    await solicitudApi.complete(id);
    return getServiceRequests();
}

export function createEmptyServiceRequest() {
    const now = new Date();
    return {
        id: '',
        code: `SOL-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`,
        client: '',
        clientId: '',
        clientEmail: '',
        driver: '',
        driverId: '',
        vehicle: '',
        vehicleId: '',
        serviceType: 'Transporte Ejecutivo',
        description: '',
        origin: '',
        destination: '',
        scheduledDate: '',
        status: 'Pendiente',
        priority: 'Media',
        createdBy: 'Admin',
        createdAt: now.toISOString().split('T')[0],
    };
}
---------------
import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const solicitudApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.solicitudes.getAll);
        return response.data;
    },
    getById: async (id) => {
        const response = await axiosInstance.get(endpoints.solicitudes.getById(id));
        return response.data;
    },
    create: async (data) => {
        const response = await axiosInstance.post(endpoints.solicitudes.create, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axiosInstance.put(endpoints.solicitudes.update(id), data);
        return response.data;
    },
    assignDriver: async (id, conductorId) => {
        const response = await axiosInstance.patch(
            endpoints.solicitudes.assignDriver(id),
            { conductorAsignado: conductorId }
        );
        return response.data;
    },
    cancel: async (id) => {
        const response = await axiosInstance.patch(endpoints.solicitudes.cancel(id));
        return response.data;
    },
    complete: async (id) => {
        const response = await axiosInstance.patch(endpoints.solicitudes.complete(id));
        return response.data;
    },
};

export default solicitudApi;
-------------
import axiosInstance from '../../../services/api/axiosInstance';
import endpoints from '../../../services/api/endpoints';

const vehiculoApi = {
    getAll: async () => {
        const response = await axiosInstance.get(endpoints.vehiculos.getAll);
        return response.data;
    },
};

export default vehiculoApi;
------------
**src/modules/tracking/components**
import "./FeedPanel.css";
import ServiceCard from "./ServiceCard";
import { services } from "../data/trackingData";

const FeedPanel = () => {
  return (
    <section className="feed-panel">

      <div className="feed-header">
        <h2>Actividad en Vivo</h2>
        <button>Ver Todo</button>
      </div>

      <div className="feed-list">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
          />
        ))}
      </div>

    </section>
  );
};

export default FeedPanel;
----------------
.feed-panel{

    flex:1;

    display:flex;

    flex-direction:column;

    background:white;

    border-radius:24px;

    padding:22px;

    overflow:hidden;

}
.feed-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:20px;

}

.feed-header h2{

    font-size:22px;

}

.feed-header button{

    color:#0A7A98;

    background:none;

    font-weight:600;

}

.feed-list{

    flex:1;

    overflow-y:auto;

    display:flex;

    flex-direction:column;

    gap:16px;

}
.feed-list::-webkit-scrollbar{

    width:6px;

}

.feed-list::-webkit-scrollbar-thumb{

    background:#CCD7E2;

    border-radius:20px;

}
---------------
import "./HistoryPanel.css";
import { history } from "../data/trackingData";

const HistoryPanel = () => {
  return (
    <section className="history-panel">

      <h3>HISTORIAL DE MOVIMIENTOS</h3>

      <div className="history-list">

        {history.map((item, index) => (

          <div key={index} className="history-item">

            <span className={`history-line ${item.color}`}></span>

            <div>
              <p>{item.title}</p>
              <small>{item.time}</small>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default HistoryPanel;
-----------------
.history-panel{

    background:white;

    border-radius:24px;

    padding:20px;

}

.history-panel h3{

    font-size:18px;

    color:#555;

    margin-bottom:20px;

    letter-spacing:.04em;

}

.history-list{

    display:flex;

    flex-direction:column;

    gap:22px;

}

.history-item{

    display:flex;

    gap:15px;

}

.history-line{

    width:4px;

    border-radius:4px;

}

.history-line.blue{

    background:#66D4FF;

}

.history-line.orange{

    background:#F4A340;

}

.history-item p{

    margin:0;

    font-weight:600;

}

.history-item small{

    color:#7E8A96;

}
----------------
 import "./LiveExecutionCard.css";
 
const LiveExecution = () => {
  return (
    <section className="live-execution">

      <div className="live-header">

        <div>

          <h2>Ejecución en Vivo</h2>

          <p>12 Servicios Activos • 4 Alertas</p>

        </div>

        <div className="live-badge">

          <span className="live-dot"></span>

          EN VIVO

        </div>

      </div>

      <div className="live-status">

        <div className="status success">

          <span className="status-circle"></span>

          8 Operativos

        </div>

        <div className="status danger">

          <span className="status-circle"></span>

          2 Demorados

        </div>

      </div>

    </section>
  );
};

export default LiveExecution;
-------------
.live-execution{

    background:white;

    border-radius:24px;

    padding:22px;

}

.live-header{

    display:flex;

    justify-content:space-between;

    align-items:flex-start;

}

.live-header h2{

    font-size:24px;

    font-weight:700;

    color:#122231;

}

.live-header p{

    margin-top:6px;

    color:#73808C;

    font-size:15px;

}

.live-badge{

    display:flex;

    align-items:center;

    gap:8px;

    color:#E53935;

    font-weight:700;

    letter-spacing:.08em;

    font-size:13px;

}

.live-dot{

    width:9px;

    height:9px;

    background:#E53935;

    border-radius:50%;

    animation:pulse 1.5s infinite;

}

.live-status{

    display:flex;

    gap:14px;

    margin-top:28px;

}

.status{

    flex:1;

    display:flex;

    align-items:center;

    justify-content:center;

    gap:10px;

    padding:14px;

    border-radius:18px;

    font-weight:600;

    font-size:15px;

}

.success{

    background:#DDF8F3;

    color:#0A7A69;

}

.danger{

    background:#FFE8E6;

    color:#D14343;

}

.status-circle{

    width:10px;

    height:10px;

    border-radius:50%;

    background:currentColor;

}

@keyframes pulse{

0%{

transform:scale(.8);

opacity:.6;

}

50%{

transform:scale(1.2);

opacity:1;

}

100%{

transform:scale(.8);

opacity:.6;

}

}
--------------
import { useMap } from "react-leaflet";

import {
  FiPlus,
  FiMinus,
  FiCrosshair,
} from "react-icons/fi";

import "./MapControls.css";

const MapControls = () => {
  const map = useMap();

  const acercar = () => {
    map.zoomIn();
  };

  const alejar = () => {
    map.zoomOut();
  };

  const centrar = () => {
    map.setView(
      [6.2442, -75.5812],
      13
    );
  };

  return (
    <div className="map-controls">

      <button
        type="button"
        onClick={acercar}
        title="Acercar"
      >
        <FiPlus />
      </button>

      <button
        type="button"
        onClick={alejar}
        title="Alejar"
      >
        <FiMinus />
      </button>

      <button
        type="button"
        onClick={centrar}
        title="Centrar mapa"
      >
        <FiCrosshair />
      </button>

    </div>
  );
};

export default MapControls;
---------
.map-controls {
  position: absolute;

  top: 100px;
  right: 20px;

  z-index: 1000;

  display: flex;
  flex-direction: column;

  gap: 8px;
}

.map-controls button {
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.95);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.18);

  color: #263238;

  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.map-controls button:hover {
  transform: scale(1.05);

  background: white;
}

.map-controls svg {
  width: 18px;
  height: 18px;
}
-----------------
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import MapControls from "./MapControls";

import "./MapView.css";

const DEFAULT_POSITION = [
  6.2442,
  -75.5812,
];

const obtenerIconoConductor = () => {
  return new L.DivIcon({
    className: "driver-marker-icon",

    html: `
      <div class="driver-marker-wrapper">
        <div class="driver-marker-dot"></div>
      </div>
    `,

    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const ServicioEnMapa = ({
  seguimiento,
  ubicacion,
  rutaTiempoReal = [],
  seleccionado,
  onSeleccionar,
}) => {
  const coordenadasGuardadas =
    seguimiento?.coordenadas || [];

  const coordenadas = [
    ...coordenadasGuardadas.map(
      (coordenada) => [
        Number(coordenada.lat),
        Number(coordenada.lng),
      ]
    ),

    ...rutaTiempoReal.map(
      (coordenada) => [
        Number(coordenada.lat),
        Number(coordenada.lng),
      ]
    ),
  ];

  if (ubicacion) {
    const ultima =
      coordenadas[
        coordenadas.length - 1
      ];

    const actual = [
      Number(ubicacion.lat),
      Number(ubicacion.lng),
    ];

    if (
      !ultima ||
      ultima[0] !== actual[0] ||
      ultima[1] !== actual[1]
    ) {
      coordenadas.push(actual);
    }
  }

  let posicion = DEFAULT_POSITION;

  if (ubicacion) {
    posicion = [
      Number(ubicacion.lat),
      Number(ubicacion.lng),
    ];
  } else if (
    coordenadas.length > 0
  ) {
    posicion =
      coordenadas[
        coordenadas.length - 1
      ];
  }

  const servicioId =
    seguimiento?.servicio?._id;

  if (!servicioId) {
    return null;
  }

  return (
    <>
      {seleccionado &&
        coordenadas.length > 1 && (
          <Polyline
            positions={coordenadas}
            pathOptions={{
              color: "#0b3627",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}

      <Marker
        position={posicion}
        icon={obtenerIconoConductor()}
        eventHandlers={{
          click: () =>
            onSeleccionar(
              servicioId
            ),
        }}
      />
    </>
  );
};

const MapView = ({
  seguimientos = [],
  ubicaciones = {},
  rutasTiempoReal = {},
  servicioSeleccionado,
  setServicioSeleccionado,
  conectado,
}) => {
  const manejarClickMarcador = (
    servicioId
  ) => {
    console.log(
      "Servicio seleccionado:",
      servicioId
    );

    if (
      servicioSeleccionado ===
      servicioId
    ) {
      setServicioSeleccionado(null);
      return;
    }

    setServicioSeleccionado(
      servicioId
    );
  };

  return (
    <div className="map-view">

      <MapContainer
        center={DEFAULT_POSITION}
        zoom={13}
        scrollWheelZoom={true}
        className="real-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapControls />

        <div className="map-status">
          <span
            className={`status-dot ${
              conectado
                ? "connected"
                : "disconnected"
            }`}
          ></span>

          {conectado
            ? "Conectado"
            : "Desconectado"}
        </div>

        {seguimientos.map(
          (seguimiento) => {
            const servicioId =
              seguimiento?.servicio?._id;

            if (!servicioId) {
              return null;
            }

            console.log(
              "Seguimiento completo:",
              seguimiento
            );

            return (
              <ServicioEnMapa
                key={servicioId}
                seguimiento={
                  seguimiento
                }
                ubicacion={
                  ubicaciones[
                    servicioId
                  ]
                }
                rutaTiempoReal={
                  rutasTiempoReal[
                    servicioId
                  ]
                }
                seleccionado={
                  servicioSeleccionado ===
                  servicioId
                }
                onSeleccionar={
                  manejarClickMarcador
                }
              />
            );
          }
        )}

      </MapContainer>

    </div>
  );
};

export default MapView;
-------------
.map-view {
  width: 100%;
  height: 100%;

  position: relative;

  border-radius: 28px;

  overflow: hidden;
}

.real-map {
  width: 100%;
  height: 100%;

  z-index: 1;
}

/* =========================================
   MARCADOR DEL CONDUCTOR
   ========================================= */

.driver-marker-icon {
  background: transparent;
  border: none;
}

.driver-marker-wrapper {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.driver-marker-dot {
  width: 22px;
  height: 22px;

  background: #0b3627;

  border: 4px solid white;

  border-radius: 50%;

  box-shadow:
    0 4px 14px rgba(0, 0, 0, 0.45);

  transition:
    transform 0.2s ease;
}

/* =========================================
   ESTADO DE CONEXIÓN
   ========================================= */

.map-status {
  position: absolute;

  top: 20px;
  right: 20px;

  z-index: 1000;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 9px 14px;

  background: white;

  border-radius: 20px;

  font-size: 13px;
  font-weight: 600;

  box-shadow:
    0 5px 18px rgba(0, 0, 0, 0.15);
}

.status-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;
}

.status-dot.connected {
  background: #0f9aa7;
}

.status-dot.disconnected {
  background: #999;
}
-------------
import "./ServiceCard.css";
import {
  FiArrowUpRight,
  FiUser,
} from "react-icons/fi";

const ServiceCard = ({
  id,
  status,
  statusColor,
  origin,
  destination,
  driver,
}) => {
  return (
    <div className="service-card">

      <div className="service-header">

        <span className="service-id">
          {id}
        </span>

        <span
          className={`status ${statusColor}`}
        >
          {status}
        </span>

      </div>

      <div className="route">

        <div className="line">

          <span className="circle start"></span>

          <span className="vertical-line"></span>

          <span className="circle end"></span>

        </div>

        <div className="places">

          <div>

            <small>Origen</small>

            <p>{origin}</p>

          </div>

          <div>

            <small>Destino</small>

            <p>{destination}</p>

          </div>

        </div>

      </div>

      <div className="service-footer">

        <div className="driver">

          <FiUser />

          {driver}

        </div>

        <button>

          <FiArrowUpRight />

        </button>

      </div>

    </div>
  );
};

export default ServiceCard;
---------------
.service-card{

    background:white;

    border-radius:18px;

    border:1px solid #ECECEC;

    padding:18px;

    transition:.25s;

}

.service-card:hover{

    transform:translateY(-2px);

    box-shadow:0 12px 30px rgba(0,0,0,.08);

}

.service-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;

}

.service-id{

    font-weight:600;

    color:#46515C;

}

.status{

    padding:6px 12px;

    border-radius:50px;

    font-size:13px;

    font-weight:600;

}

.status.green{

    background:#E2F8F2;

    color:#11896A;

}

.status.red{

    background:#FFE8E5;

    color:#D44C42;

}

.route{

    display:flex;

    gap:18px;

    margin-bottom:20px;

}

.line{

    display:flex;

    flex-direction:column;

    align-items:center;

}

.circle{

    width:10px;

    height:10px;

    border-radius:50%;

}

.start{

    background:#F59E0B;

}

.end{

    background:#0891B2;

}

.vertical-line{

    width:2px;

    height:52px;

    background:#D6DCE3;

}

.places{

    display:flex;

    flex-direction:column;

    justify-content:space-between;

}

.places small{

    color:#9AA5B1;

    font-size:12px;

}

.places p{

    margin-top:4px;

    font-size:15px;

    font-weight:500;

}

.service-footer{

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.driver{

    display:flex;

    align-items:center;

    gap:8px;

    color:#46515C;

}

.service-footer button{

    width:36px;

    height:36px;

    border-radius:10px;

    background:#F3F6F9;

    display:flex;

    align-items:center;

    justify-content:center;

}
------------------
**src/modules/tracking/data**
export const services = [
  {
    id: "#SRV-40291",
    status: "En Horario",
    statusColor: "green",
    origin: "Polanco III Sector",
    destination: "Centro Santa Fe",
    driver: "Carlos Mendoza",
  },
  {
    id: "#SRV-40288",
    status: "Detenido (5m)",
    statusColor: "red",
    origin: "Aeropuerto T1",
    destination: "Hotel Intercontinental",
    driver: "Roberto G.",
  },
];

export const history = [
  {
    title: "Conductor #2849 llegó a Landmark C",
    time: "14:02 PM • Ruta ID: 40291",
    color: "blue",
  },
  {
    title: "Nuevo Servicio #40300 Asignado",
    time: "13:58 PM • Sistema de Despacho",
    color: "orange",
  },
];
-------------
**src/modules/tracking/pages**
import { useEffect, useMemo, useState } from "react";
import ModulePage from "../../../components/common/ModulePage/ModulePage";
import FeedPanel from "../components/FeedPanel";
import HistoryPanel from "../components/HistoryPanel";
import LiveExecution from "../components/LiveExecutionCard";
import MapView from "../components/MapView";
import useSocket from "../../../hooks/useSocket";
import "./TrackingPage.css";

const API_URL = "http://localhost:3000";

const TrackingPage = () => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] =
    useState(null);

  useEffect(() => {
    const obtenerSeguimientosActivos = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/seguimientos/activos`
        );

        if (!response.ok) {
          throw new Error(
            "No se pudieron obtener los seguimientos activos."
          );
        }

        const resultado = await response.json();

        const datos = Array.isArray(resultado?.data)
          ? resultado.data
          : [];

        setSeguimientos(datos);
      } catch (error) {
        console.error(
          "Error obteniendo seguimientos activos:",
          error
        );

        setSeguimientos([]);
      }
    };

    obtenerSeguimientosActivos();
  }, []);

  const servicioIds = useMemo(() => {
    return seguimientos
      .map(
        (seguimiento) =>
          seguimiento?.servicio?._id
      )
      .filter(Boolean);
  }, [seguimientos]);

  const {
    ubicaciones,
    rutasTiempoReal,
    conectado,
  } = useSocket(servicioIds);

  return (
    <ModulePage
      label="Trazabilidad y Control"
      title="Trazabilidad y Control"
      description="Monitoree en tiempo real la ejecución de los servicios, la ubicación de los conductores y el estado operativo de la flota."
    >
      <section className="tracking">

        <div className="tracking-map">
          <MapView
            seguimientos={seguimientos}
            ubicaciones={ubicaciones}
            rutasTiempoReal={rutasTiempoReal}
            servicioSeleccionado={
              servicioSeleccionado
            }
            setServicioSeleccionado={
              setServicioSeleccionado
            }
            conectado={conectado}
          />
        </div>

        <aside className="tracking-panels">

          <LiveExecution />

          <FeedPanel />

          <HistoryPanel />

        </aside>

      </section>
    </ModulePage>
  );
};

export default TrackingPage;
-----------
.tracking {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 190px);
  overflow: visible;
}

.tracking-map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 190px);
  border-radius: 28px;
  overflow: hidden;
  z-index: 1;
}

.tracking-panels {
  position: relative;
  top: auto;
  left: auto;
  z-index: 2;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;
  pointer-events: none;
}

.tracking-panels > * {
  pointer-events: auto;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}
----------
**src/modules/tracking/services/routing**
*geocodingService.js:*
const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

export const obtenerCoordenadasDireccion = async (
  direccion
) => {
  const direccionLimpia =
    direccion?.trim();

  if (!direccionLimpia) {
    throw new Error(
      "La dirección no puede estar vacía."
    );
  }

  const params = new URLSearchParams({
    q: direccionLimpia,
    format: "json",
    addressdetails: "1",
    limit: "1",
  });

  const response = await fetch(
    `${NOMINATIM_URL}?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error geocodificando la dirección: ${response.status}`
    );
  }

  const resultados =
    await response.json();

  if (
    !Array.isArray(resultados) ||
    resultados.length === 0
  ) {
    throw new Error(
      `No se encontró la dirección: ${direccionLimpia}`
    );
  }

  const resultado =
    resultados[0];

  const lat =
    Number(resultado.lat);

  const lng =
    Number(resultado.lon);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    throw new Error(
      "La dirección no tiene coordenadas válidas."
    );
  }

  return {
    direccion: resultado.display_name,

    coordenadas: {
      lat,
      lng,
    },

    tipo: resultado.type,

    importancia:
      resultado.importance,

    lugar: resultado.address || {},
  };
};
--------------
*routingService.js:*
const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";

export const obtenerRuta = async (
  origen,
  destino
) => {
  if (
    origen?.lat == null ||
    origen?.lng == null
  ) {
    throw new Error(
      "El origen no tiene coordenadas válidas."
    );
  }

  if (
    destino?.lat == null ||
    destino?.lng == null
  ) {
    throw new Error(
      "El destino no tiene coordenadas válidas."
    );
  }

  const origenLat =
    Number(origen.lat);

  const origenLng =
    Number(origen.lng);

  const destinoLat =
    Number(destino.lat);

  const destinoLng =
    Number(destino.lng);

  if (
    !Number.isFinite(origenLat) ||
    !Number.isFinite(origenLng) ||
    !Number.isFinite(destinoLat) ||
    !Number.isFinite(destinoLng)
  ) {
    throw new Error(
      "Las coordenadas del origen o destino no son válidas."
    );
  }

  const coordenadas =
    [
      `${origenLng},${origenLat}`,
      `${destinoLng},${destinoLat}`,
    ].join(";");

  const params =
    new URLSearchParams({
      overview: "full",
      geometries: "geojson",
      steps: "false",
    });

  const url =
    `${OSRM_URL}/${coordenadas}?${params.toString()}`;

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error obteniendo la ruta: ${response.status}`
    );
  }

  const resultado =
    await response.json();

  if (
    resultado?.code !== "Ok"
  ) {
    throw new Error(
      resultado?.message ||
        "OSRM no pudo calcular la ruta."
    );
  }

  const ruta =
    resultado?.routes?.[0];

  if (!ruta) {
    throw new Error(
      "OSRM no devolvió ninguna ruta."
    );
  }

  const geometry =
    ruta.geometry;

  if (
    !geometry ||
    geometry.type !== "LineString" ||
    !Array.isArray(
      geometry.coordinates
    )
  ) {
    throw new Error(
      "La geometría de la ruta no es válida."
    );
  }

  const coordenadasLeaflet =
    geometry.coordinates.map(
      ([lng, lat]) => [
        lat,
        lng,
      ]
    );

  return {
    coordenadas:
      coordenadasLeaflet,

    distanciaMetros:
      ruta.distance,

    duracionSegundos:
      ruta.duration,

    geometry,
  };
};
---------------------
**src/services/api/**
*axiosInstance.js*
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export default axiosInstance;
-----------------
*endpoints.js*
const endpoints = {
    auth: {
        login: "/auth/login",
        clientes: { create: "/clientes" },
        forgotPassword: "/auth/forgot-password",
        resetPassword: "/auth/reset-password"
    },
    roles: {
        getAll: "/roles",
        getById: (id) => `/roles/${id}`,
        create: "/roles",
        update: (id) => `/roles/${id}`,
        delete: (id) => `/roles/${id}`,
    },
    permisos: {
        getAll: "/permisos",
        getById: (id) => `/permisos/${id}`,
        create: "/permisos",
        update: (id) => `/permisos/${id}`,
        delete: (id) => `/permisos/${id}`,
    },
    usuarios: {
        getAll: "/usuarios",
        getById: (id) => `/usuarios/${id}`,
        create: "/usuarios",
        update: (id) => `/usuarios/${id}`,
        delete: (id) => `/usuarios/${id}`,
    },
    solicitudes: {
        getAll: "/solicitudes",
        getById: (id) => `/solicitudes/${id}`,
        create: "/solicitudes",
        update: (id) => `/solicitudes/${id}`,
        assignDriver: (id) => `/solicitudes/${id}/asignar-conductor`,
        cancel: (id) => `/solicitudes/${id}/cancelar`,
        complete: (id) => `/solicitudes/${id}/completar`,
    },
    // Parte de solicitud
    clientes: {
        getAll: "/clientes",
    },
    conductores: {
        getAll: "/conductores",
    },
    vehiculos: {
        getAll: "/vehiculos",
    },
};

export default endpoints;
---------------------
*interceptors.js*
import axiosInstance from "./axiosInstance";

axiosInstance.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
---------------------
**src/main.jsx**
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './services/api/interceptors.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
-------------------
**src/app.jsx**
import './index.css';
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <AppRoutes />
  )
}

export default App
---------------------
# Backend
**src/modules/solicitud/**
*solicitud.controller.js*
import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: [true, "El código es obligatorio."],
            unique: true,
            trim: true,
            uppercase: true
        },

        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            required: [true, "El cliente es obligatorio."]
        },

        correoCliente: {
            type: String,
            required: [true, "El correo del cliente es obligatorio."],
            trim: true,
            lowercase: true
        },

        conductorAsignado: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conductor",
            default: null
        },

        vehiculo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehiculo",
            default: null
        },

        tipoServicio: {
            type: String,
            required: [true, "El tipo de servicio es obligatorio."],
            trim: true
        },

        descripcion: {
            type: String,
            required: [true, "La descripción es obligatoria."],
            trim: true
        },

        origen: {
            type: String,
            required: [true, "El origen es obligatorio."],
            trim: true
        },

        destino: {
            type: String,
            required: [true, "El destino es obligatorio."],
            trim: true
        },

        fechaProgramada: {
            type: Date,
            required: [true, "La fecha programada es obligatoria."]
        },

        prioridad: {
            type: String,
            required: [true, "La prioridad es obligatoria."],
            enum: ["BAJA", "MEDIA", "ALTA", "URGENTE"],
            trim: true,
            uppercase: true
        },

        estado: {
            type: String,
            required: true,
            enum: ["PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO"],
            default: "PENDIENTE",
            trim: true,
            uppercase: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Solicitud = mongoose.model("Solicitud", solicitudSchema);

export default Solicitud;
------------
*solicitud.model.js*
import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: [true, "El código es obligatorio."],
            unique: true,
            trim: true,
            uppercase: true
        },

        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            required: [true, "El cliente es obligatorio."]
        },

        correoCliente: {
            type: String,
            required: [true, "El correo del cliente es obligatorio."],
            trim: true,
            lowercase: true
        },

        conductorAsignado: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conductor",
            default: null
        },

        vehiculo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehiculo",
            default: null
        },

        tipoServicio: {
            type: String,
            required: [true, "El tipo de servicio es obligatorio."],
            trim: true
        },

        descripcion: {
            type: String,
            required: [true, "La descripción es obligatoria."],
            trim: true
        },

        origen: {
            type: String,
            required: [true, "El origen es obligatorio."],
            trim: true
        },

        destino: {
            type: String,
            required: [true, "El destino es obligatorio."],
            trim: true
        },

        fechaProgramada: {
            type: Date,
            required: [true, "La fecha programada es obligatoria."]
        },

        prioridad: {
            type: String,
            required: [true, "La prioridad es obligatoria."],
            enum: ["BAJA", "MEDIA", "ALTA", "URGENTE"],
            trim: true,
            uppercase: true
        },

        estado: {
            type: String,
            required: true,
            enum: ["PENDIENTE", "EN_PROCESO", "COMPLETADO", "CANCELADO"],
            default: "PENDIENTE",
            trim: true,
            uppercase: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Solicitud = mongoose.model("Solicitud", solicitudSchema);

export default Solicitud;
-------------
*solicitud.repository.js*
import Solicitud from "./solicitud.model.js";

const populateSolicitud = [
    {
        path: "cliente",
        populate: {
            path: "usuario",
            select: "-password",
            populate: {
                path: "rol",
                select: "nombre descripcion"
            }
        }
    },
    {
        path: "conductorAsignado",
        populate: {
            path: "usuario",
            select: "-password",
            populate: {
                path: "rol",
                select: "nombre descripcion"
            }
        }
    },
    {
        path: "vehiculo",
        populate: {
            path: "cliente",
            populate: {
                path: "usuario",
                select: "-password",
                populate: {
                    path: "rol",
                    select: "nombre descripcion"
                }
            }
        }
    }
];

class SolicitudRepository {

    async crear(datosSolicitud) {
        return await Solicitud.create(datosSolicitud);
    }

    async obtenerTodos() {
        return await Solicitud.find()
            .populate(populateSolicitud)
            .sort({
                createdAt: -1
            });
    }

    async obtenerPorId(id) {
        return await Solicitud.findById(id)
            .populate(populateSolicitud);
    }

    async obtenerPorCodigo(codigo) {
        return await Solicitud.findOne({
            codigo
        });
    }

    async actualizar(id, datosSolicitud) {
        return await Solicitud.findOneAndUpdate(
            {
                _id: id
            },
            datosSolicitud,
            {
                new: true,
                runValidators: true
            }
        ).populate(populateSolicitud);
    }

    async asignarConductor(id, datosSolicitud) {
        return await Solicitud.findOneAndUpdate(
            {
                _id: id
            },
            datosSolicitud,
            {
                new: true,
                runValidators: true
            }
        ).populate(populateSolicitud);
    }

    async cancelar(id) {
        return await Solicitud.findOneAndUpdate(
            {
                _id: id
            },
            {
                estado: "CANCELADO"
            },
            {
                new: true,
                runValidators: true
            }
        ).populate(populateSolicitud);
    }

    async completar(id) {
        return await Solicitud.findOneAndUpdate(
            {
                _id: id
            },
            {
                estado: "COMPLETADO"
            },
            {
                new: true,
                runValidators: true
            }
        ).populate(populateSolicitud);
    }

}

export default new SolicitudRepository();
---------------
*solicitud.routes.js*
import { Router } from "express";

import SolicitudController from "./solicitud.controller.js";

import {
    validarCrearSolicitud,
    validarActualizarSolicitud,
    validarAsignarConductor
} from "./solicitud.validation.js";

const router = Router();

// ======================================================
// Crear solicitud
// ======================================================
router.post(
    "/",
    validarCrearSolicitud,
    SolicitudController.crear
);

// ======================================================
// Obtener todas las solicitudes
// ======================================================
router.get(
    "/",
    SolicitudController.obtenerTodos
);

// ======================================================
// Obtener solicitud por ID
// ======================================================
router.get(
    "/:id",
    SolicitudController.obtenerPorId
);

// ======================================================
// Asignar conductor
// ======================================================
router.patch(
    "/:id/asignar-conductor",
    validarAsignarConductor,
    SolicitudController.asignarConductor
);

// ======================================================
// Cancelar solicitud
// ======================================================
router.patch(
    "/:id/cancelar",
    SolicitudController.cancelar
);

// ======================================================
// Completar solicitud
// ======================================================
router.patch(
    "/:id/completar",
    SolicitudController.completar
);

// ======================================================
// Actualizar solicitud
// ======================================================
router.put(
    "/:id",
    validarActualizarSolicitud,
    SolicitudController.actualizar
);

export default router;
--------------
*solicitud.schema.js*
import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const estadosSolicitud = [
    "PENDIENTE",
    "EN_PROCESO",
    "COMPLETADO",
    "CANCELADO"
];

const prioridadesSolicitud = [
    "BAJA",
    "MEDIA",
    "ALTA",
    "URGENTE"
];

const objectIdSchema = z
    .string()
    .regex(
        objectIdRegex,
        "Uno o más identificadores tienen un formato inválido."
    );

const estadoSchema = z
    .string({
        required_error: "El estado es obligatorio."
    })
    .trim()
    .transform(estado => estado.toUpperCase())
    .refine(
        estado => estadosSolicitud.includes(estado),
        "El estado enviado no es válido."
    );

const prioridadSchema = z
    .string({
        required_error: "La prioridad es obligatoria."
    })
    .trim()
    .transform(prioridad => prioridad.toUpperCase())
    .refine(
        prioridad => prioridadesSolicitud.includes(prioridad),
        "La prioridad enviada no es válida."
    );

const solicitudBaseSchema = z.object({

    codigo: z
        .string({
            required_error: "El código es obligatorio."
        })
        .trim()
        .min(3, "El código debe tener al menos 3 caracteres.")
        .max(50, "El código no puede superar los 50 caracteres.")
        .transform(codigo => codigo.toUpperCase()),

    cliente: objectIdSchema,

    correoCliente: z
        .string({
            required_error: "El correo del cliente es obligatorio."
        })
        .trim()
        .email("El correo del cliente no es válido.")
        .transform(correo => correo.toLowerCase()),

    conductorAsignado: objectIdSchema.optional(),

    vehiculo: objectIdSchema.optional(),

    tipoServicio: z
        .string({
            required_error: "El tipo de servicio es obligatorio."
        })
        .trim()
        .min(3, "El tipo de servicio debe tener al menos 3 caracteres.")
        .max(100, "El tipo de servicio no puede superar los 100 caracteres."),

    descripcion: z
        .string({
            required_error: "La descripción es obligatoria."
        })
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres.")
        .max(500, "La descripción no puede superar los 500 caracteres."),

    origen: z
        .string({
            required_error: "El origen es obligatorio."
        })
        .trim()
        .min(3, "El origen debe tener al menos 3 caracteres.")
        .max(200, "El origen no puede superar los 200 caracteres."),

    destino: z
        .string({
            required_error: "El destino es obligatorio."
        })
        .trim()
        .min(3, "El destino debe tener al menos 3 caracteres.")
        .max(200, "El destino no puede superar los 200 caracteres."),

    fechaProgramada: z.coerce.date({
        required_error: "La fecha programada es obligatoria."
    }),

    prioridad: prioridadSchema

});

export const crearSolicitudSchema = solicitudBaseSchema;

export const actualizarSolicitudSchema = solicitudBaseSchema
    .partial()
    .extend({
        estado: estadoSchema.optional()
    });

export const asignarConductorSchema = z.object({
    conductorAsignado: objectIdSchema
});
--------------
*solicitud.service.js*
import mongoose from "mongoose";

import SolicitudRepository from "./solicitud.repository.js";
import ClienteRepository from "../cliente/cliente.repository.js";
import ConductorRepository from "../conductor/conductor.repository.js";
import VehiculoRepository from "../vehiculo/vehiculo.repository.js";
import ServicioService from "../servicio/servicio.service.js";

import AppError from "../../utils/AppError.js";

class SolicitudService {

    // ======================================================
    // CREAR SOLICITUD
    // ======================================================

    async crear(datos) {

        datos.codigo = datos.codigo.trim().toUpperCase();
        datos.correoCliente = datos.correoCliente.trim().toLowerCase();
        datos.tipoServicio = datos.tipoServicio.trim();
        datos.descripcion = datos.descripcion.trim();
        datos.origen = datos.origen.trim();
        datos.destino = datos.destino.trim();
        datos.prioridad = datos.prioridad.trim().toUpperCase();

        if (!mongoose.Types.ObjectId.isValid(datos.cliente)) {

            throw new AppError(
                "El cliente enviado no es valido.",
                400
            );

        }

        const cliente =
            await ClienteRepository.obtenerPorId(
                datos.cliente
            );

        if (!cliente) {

            throw new AppError(
                "El cliente no existe.",
                404
            );

        }

        if (datos.vehiculo) {

            if (!mongoose.Types.ObjectId.isValid(datos.vehiculo)) {

                throw new AppError(
                    "El vehiculo enviado no es valido.",
                    400
                );

            }

            const vehiculo =
                await VehiculoRepository.obtenerPorId(
                    datos.vehiculo
                );

            if (!vehiculo) {

                throw new AppError(
                    "El vehiculo no existe.",
                    404
                );

            }

        }

        if (datos.conductorAsignado) {

            if (
                !mongoose.Types.ObjectId.isValid(
                    datos.conductorAsignado
                )
            ) {

                throw new AppError(
                    "El conductor enviado no es valido.",
                    400
                );

            }

            const conductor =
                await ConductorRepository.obtenerPorId(
                    datos.conductorAsignado
                );

            if (!conductor) {

                throw new AppError(
                    "El conductor no existe.",
                    404
                );

            }

            if (!conductor.disponible) {

                throw new AppError(
                    "El conductor no esta disponible.",
                    409
                );

            }

        }

        const codigoExiste =
            await SolicitudRepository.obtenerPorCodigo(
                datos.codigo
            );

        if (codigoExiste) {

            throw new AppError(
                "Ya existe una solicitud con ese codigo.",
                409
            );

        }

        datos.estado = datos.conductorAsignado
            ? "EN_PROCESO"
            : "PENDIENTE";

        const solicitud = await SolicitudRepository.crear(datos);

        // ======================================================
        // SI TIENE CONDUCTOR ASIGNADO, CREAR SERVICIO AUTOMATICAMENTE
        // ======================================================
        if (datos.conductorAsignado) {
            await ServicioService.iniciar(
                solicitud._id.toString(),
                datos.conductorAsignado
            );
        }

        return solicitud;

    }

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    async obtenerTodos() {

        return await SolicitudRepository.obtenerTodos();

    }

    // ======================================================
    // OBTENER POR ID
    // ======================================================

    async obtenerPorId(id) {

        if (!mongoose.Types.ObjectId.isValid(id)) {

            throw new AppError(
                "El id de la solicitud no es valido.",
                400
            );

        }

        const solicitud =
            await SolicitudRepository.obtenerPorId(id);

        if (!solicitud) {

            throw new AppError(
                "Solicitud no encontrada.",
                404
            );

        }

        return solicitud;

    }

    // ======================================================
    // ACTUALIZAR
    // ======================================================

    async actualizar(id, datos) {

        if (!mongoose.Types.ObjectId.isValid(id)) {

            throw new AppError(
                "El id de la solicitud no es valido.",
                400
            );

        }

        const solicitud =
            await SolicitudRepository.obtenerPorId(id);

        if (!solicitud) {

            throw new AppError(
                "Solicitud no encontrada.",
                404
            );

        }

        if (
            solicitud.estado === "COMPLETADO" ||
            solicitud.estado === "CANCELADO"
        ) {

            throw new AppError(
                "La solicitud ya no puede modificarse.",
                400
            );

        }

        if (datos.conductorAsignado !== undefined) {

            throw new AppError(
                "El conductor debe asignarse mediante el endpoint especifico.",
                400
            );

        }

        if (datos.codigo) {

            datos.codigo = datos.codigo.trim().toUpperCase();

            if (datos.codigo !== solicitud.codigo) {

                const codigoExiste =
                    await SolicitudRepository.obtenerPorCodigo(
                        datos.codigo
                    );

                if (codigoExiste) {

                    throw new AppError(
                        "Ya existe una solicitud con ese codigo.",
                        409
                    );

                }

            }

        }

        if (datos.correoCliente) {
            datos.correoCliente =
                datos.correoCliente.trim().toLowerCase();
        }

        if (datos.tipoServicio) {
            datos.tipoServicio = datos.tipoServicio.trim();
        }

        if (datos.descripcion) {
            datos.descripcion = datos.descripcion.trim();
        }

        if (datos.origen) {
            datos.origen = datos.origen.trim();
        }

        if (datos.destino) {
            datos.destino = datos.destino.trim();
        }

        if (datos.prioridad) {
            datos.prioridad = datos.prioridad.trim().toUpperCase();
        }

        if (datos.cliente) {

            if (!mongoose.Types.ObjectId.isValid(datos.cliente)) {

                throw new AppError(
                    "El cliente enviado no es valido.",
                    400
                );

            }

            const cliente =
                await ClienteRepository.obtenerPorId(
                    datos.cliente
                );

            if (!cliente) {

                throw new AppError(
                    "El cliente no existe.",
                    404
                );

            }

        }

        if (datos.vehiculo) {

            if (!mongoose.Types.ObjectId.isValid(datos.vehiculo)) {

                throw new AppError(
                    "El vehiculo enviado no es valido.",
                    400
                );

            }

            const vehiculo =
                await VehiculoRepository.obtenerPorId(
                    datos.vehiculo
                );

            if (!vehiculo) {

                throw new AppError(
                    "El vehiculo no existe.",
                    404
                );

            }

        }

        return await SolicitudRepository.actualizar(
            id,
            datos
        );

    }

    // ======================================================
    // ASIGNAR CONDUCTOR
    // ======================================================

    async asignarConductor(
        solicitudId,
        conductorId
    ) {

        if (!mongoose.Types.ObjectId.isValid(solicitudId)) {

            throw new AppError(
                "El id de la solicitud no es valido.",
                400
            );

        }

        if (!mongoose.Types.ObjectId.isValid(conductorId)) {

            throw new AppError(
                "El id del conductor no es valido.",
                400
            );

        }

        const solicitud =
            await SolicitudRepository.obtenerPorId(
                solicitudId
            );

        if (!solicitud) {

            throw new AppError(
                "Solicitud no encontrada.",
                404
            );

        }

        if (
            solicitud.estado === "COMPLETADO" ||
            solicitud.estado === "CANCELADO"
        ) {

            throw new AppError(
                "La solicitud ya no puede modificarse.",
                400
            );

        }

        const conductor =
            await ConductorRepository.obtenerPorId(
                conductorId
            );

        if (!conductor) {

            throw new AppError(
                "El conductor no existe.",
                404
            );

        }

        if (!conductor.disponible) {

            throw new AppError(
                "El conductor no esta disponible.",
                409
            );

        }

        const resultado = await SolicitudRepository.asignarConductor(
            solicitudId,
            {
                conductorAsignado: conductorId,
                estado: "EN_PROCESO"
            }
        );

        // ======================================================
        // CREAR SERVICIO AUTOMATICAMENTE AL ASIGNAR CONDUCTOR
        // ======================================================
        await ServicioService.iniciar(solicitudId, conductorId);

        return resultado;

    }

    // ======================================================
    // CANCELAR SOLICITUD
    // ======================================================

    async cancelar(id) {

        if (!mongoose.Types.ObjectId.isValid(id)) {

            throw new AppError(
                "El id de la solicitud no es valido.",
                400
            );

        }

        const solicitud =
            await SolicitudRepository.obtenerPorId(id);

        if (!solicitud) {

            throw new AppError(
                "Solicitud no encontrada.",
                404
            );

        }

        if (
            solicitud.estado === "COMPLETADO" ||
            solicitud.estado === "CANCELADO"
        ) {

            throw new AppError(
                "La solicitud ya no puede modificarse.",
                400
            );

        }

        const resultado = await SolicitudRepository.cancelar(id);

        // ======================================================
        // CANCELAR SERVICIO ASOCIADO SI EXISTE
        // ======================================================
        await ServicioService.cancelar(id);

        return resultado;

    }

    // ======================================================
    // COMPLETAR SOLICITUD
    // ======================================================

    async completar(id) {

        if (!mongoose.Types.ObjectId.isValid(id)) {

            throw new AppError(
                "El id de la solicitud no es valido.",
                400
            );

        }

        const solicitud =
            await SolicitudRepository.obtenerPorId(id);

        if (!solicitud) {

            throw new AppError(
                "Solicitud no encontrada.",
                404
            );

        }

        if (solicitud.estado !== "EN_PROCESO") {

            throw new AppError(
                "La solicitud no puede completarse desde ese estado.",
                400
            );

        }

        const resultado = await SolicitudRepository.completar(id);

        // ======================================================
        // FINALIZAR SERVICIO ASOCIADO
        // ======================================================
        await ServicioService.finalizar(id);

        return resultado;

    }

}

export default new SolicitudService();
---------------
*solicitud.validation.js*
import validateSchema from "../../middlewares/validateSchema.js";

import {
    crearSolicitudSchema,
    actualizarSolicitudSchema,
    asignarConductorSchema
} from "./solicitud.schema.js";

export const validarCrearSolicitud =
    validateSchema(crearSolicitudSchema);

export const validarActualizarSolicitud =
    validateSchema(actualizarSolicitudSchema);

export const validarAsignarConductor =
    validateSchema(asignarConductorSchema);

--------------
**src/modules/seguimiento/**
*seguimiento.controller.js*
import SeguimientoService from "./seguimiento.service.js";
import { successResponse } from "../../responses/success.response.js";

class SeguimientoController {

    // ======================================================
    // CREAR (INICIAR) SEGUIMIENTO
    // ======================================================

    async crear(req, res, next) {
        try {

            const { servicioId, conductorId } = req.body;

            const seguimiento = await SeguimientoService.iniciar(
                servicioId,
                conductorId
            );

            return successResponse(
                res,
                seguimiento,
                "Seguimiento iniciado correctamente.",
                201
            );

        } catch (error) {
            next(error);
        }
    }

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    async obtenerTodos(req, res, next) {
        try {

            const seguimientos =
                await SeguimientoService.obtenerTodos();

            return successResponse(
                res,
                seguimientos,
                "Seguimientos obtenidos correctamente."
            );

        } catch (error) {
            next(error);
        }
    }

    // ======================================================
    // OBTENER POR ID
    // ======================================================

    async obtenerPorId(req, res, next) {
        try {

            const { id } = req.params;

            const seguimiento =
                await SeguimientoService.obtenerPorId(id);

            return successResponse(
                res,
                seguimiento,
                "Seguimiento obtenido correctamente."
            );

        } catch (error) {
            next(error);
        }
    }

    // ======================================================
    // OBTENER POR SERVICIO
    // ======================================================

    async obtenerPorServicio(req, res, next) {
        try {

            const { servicioId } = req.params;

            const seguimiento =
                await SeguimientoService.obtenerPorServicio(
                    servicioId
                );

            return successResponse(
                res,
                seguimiento,
                "Seguimiento obtenido correctamente."
            );

        } catch (error) {
            next(error);
        }
    }

    // ======================================================
    // OBTENER ACTIVOS
    // ======================================================

    async obtenerActivos(req, res, next) {
        try {

            const seguimientos =
                await SeguimientoService.obtenerActivos();

            return successResponse(
                res,
                seguimientos,
                "Seguimientos activos obtenidos correctamente."
            );

        } catch (error) {
            next(error);
        }
    }

    // ======================================================
// AGREGAR COORDENADA
// ======================================================

async agregarCoordenada(req, res, next) {
    try {

        const { id } = req.params;
        const { lat, lng } = req.body;

        // Obtener el seguimiento para extraer el servicio asociado
        const seguimientoExistente =
            await SeguimientoService.obtenerPorId(id);

        const servicioId = seguimientoExistente.servicio._id.toString();

        const seguimiento =
            await SeguimientoService.agregarCoordenada(
                servicioId,
                { lat, lng, timestamp: new Date() }
            );

        return successResponse(
            res,
            seguimiento,
            "Coordenada registrada correctamente."
        );

    } catch (error) {
        next(error);
    }
}

    // ======================================================
    // FINALIZAR SEGUIMIENTO
    // ======================================================

    async finalizar(req, res, next) {
        try {

            const { id } = req.params;

            const seguimiento =
                await SeguimientoService.finalizar(id);

            return successResponse(
                res,
                seguimiento,
                "Seguimiento finalizado correctamente."
            );

        } catch (error) {
            next(error);
        }
    }

}

export default new SeguimientoController();
-------------
*seguimiento.model.js*
import mongoose from "mongoose";

const coordenadaSchema = new mongoose.Schema(
    {
        lat: {
            type: Number,
            required: [true, "La latitud es obligatoria."]
        },

        lng: {
            type: Number,
            required: [true, "La longitud es obligatoria."]
        },

        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const seguimientoSchema = new mongoose.Schema(
    {
        servicio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Servicio",
            required: [true, "El servicio es obligatorio."],
            unique: true
        },

        conductor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conductor",
            required: [true, "El conductor es obligatorio."]
        },

        coordenadas: {
            type: [coordenadaSchema],
            default: []
        },

        estado: {
            type: String,
            required: true,
            enum: ["ACTIVO", "FINALIZADO", "CANCELADO"],
            default: "ACTIVO",
            trim: true,
            uppercase: true
        },

        fechaInicio: {
            type: Date,
            default: Date.now
        },

        fechaFin: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Seguimiento = mongoose.model("Seguimiento", seguimientoSchema);

export default Seguimiento;
-----------
*seguimiento.repository.js*
import Seguimiento from "./seguimiento.model.js";

const populateSeguimiento = [
    {
        path: "servicio",
        populate: [
            {
                path: "solicitud",
                populate: [
                    {
                        path: "cliente",
                        populate: {
                            path: "usuario",
                            select: "-password",
                            populate: {
                                path: "rol",
                                select: "nombre descripcion"
                            }
                        }
                    },
                    {
                        path: "conductorAsignado",
                        populate: {
                            path: "usuario",
                            select: "-password",
                            populate: {
                                path: "rol",
                                select: "nombre descripcion"
                            }
                        }
                    },
                    {
                        path: "vehiculo",
                        populate: {
                            path: "cliente",
                            populate: {
                                path: "usuario",
                                select: "-password",
                                populate: {
                                    path: "rol",
                                    select: "nombre descripcion"
                                }
                            }
                        }
                    }
                ]
            },
            {
                path: "conductor",
                populate: {
                    path: "usuario",
                    select: "-password",
                    populate: {
                        path: "rol",
                        select: "nombre descripcion"
                    }
                }
            }
        ]
    },
    {
        path: "conductor",
        populate: {
            path: "usuario",
            select: "-password",
            populate: {
                path: "rol",
                select: "nombre descripcion"
            }
        }
    }
];

class SeguimientoRepository {

    async crear(datosSeguimiento) {
        return await Seguimiento.create(datosSeguimiento);
    }

    async obtenerTodos() {
        return await Seguimiento.find()
            .populate(populateSeguimiento)
            .sort({ createdAt: -1 });
    }

    async obtenerPorId(id) {
        return await Seguimiento.findById(id)
            .populate(populateSeguimiento);
    }

    async obtenerPorServicio(servicioId) {
        return await Seguimiento.findOne({ servicio: servicioId })
            .populate(populateSeguimiento);
    }

    async obtenerActivos() {
        return await Seguimiento.find({ estado: "ACTIVO" })
            .populate(populateSeguimiento)
            .sort({ createdAt: -1 });
    }

    async agregarCoordenada(servicioId, coordenada) {
        return await Seguimiento.findOneAndUpdate(
            { servicio: servicioId, estado: "ACTIVO" },
            { $push: { coordenadas: coordenada } },
            { new: true, runValidators: true }
        ).populate(populateSeguimiento);
    }

    async finalizarPorServicio(servicioId) {
        return await Seguimiento.findOneAndUpdate(
            { servicio: servicioId, estado: "ACTIVO" },
            { estado: "FINALIZADO", fechaFin: new Date() },
            { new: true, runValidators: true }
        ).populate(populateSeguimiento);
    }

    async cancelarPorServicio(servicioId) {
        return await Seguimiento.findOneAndUpdate(
            { servicio: servicioId, estado: "ACTIVO" },
            { estado: "CANCELADO", fechaFin: new Date() },
            { new: true, runValidators: true }
        ).populate(populateSeguimiento);
    }

}

export default new SeguimientoRepository();
-------------------
*seguimiento.routes.js*
import { Router } from "express";
import SeguimientoController from "./seguimiento.controller.js";
import {
    validarCrearSeguimiento,
    validarCoordenada,
    validarServicioIdParam,
    validarSeguimientoIdParam
} from "./seguimiento.validation.js";

const router = Router();

// ======================================================
// Crear (iniciar) seguimiento
// ======================================================
router.post(
    "/",
    validarCrearSeguimiento,
    SeguimientoController.crear
);

// ======================================================
// Obtener todos los seguimientos
// ======================================================
router.get(
    "/",
    SeguimientoController.obtenerTodos
);

// ======================================================
// Obtener seguimientos activos
// ======================================================
router.get(
    "/activos",
    SeguimientoController.obtenerActivos
);

// ======================================================
// Obtener seguimiento por ID
// ======================================================
router.get(
    "/:id",
    validarSeguimientoIdParam,
    SeguimientoController.obtenerPorId
);

// ======================================================
// Obtener seguimiento por servicio
// ======================================================
router.get(
    "/servicio/:servicioId",
    validarServicioIdParam,
    SeguimientoController.obtenerPorServicio
);

// ======================================================
// Agregar coordenada (testing / simulacion)
// ======================================================
router.post(
    "/:id/coordenada",
    validarSeguimientoIdParam,
    validarCoordenada,
    SeguimientoController.agregarCoordenada
);

// ======================================================
// Finalizar seguimiento
// ======================================================
router.patch(
    "/:id/finalizar",
    validarSeguimientoIdParam,
    SeguimientoController.finalizar
);

export default router;
---------------
*seguimiento.schema.js*
import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdSchema = z
    .string()
    .regex(
        objectIdRegex,
        "El identificador tiene un formato invalido."
    );

const latSchema = z
    .number({
        required_error: "La latitud es obligatoria.",
        invalid_type_error: "La latitud debe ser un numero."
    })
    .min(-90, "La latitud minima es -90.")
    .max(90, "La latitud maxima es 90.");

const lngSchema = z
    .number({
        required_error: "La longitud es obligatoria.",
        invalid_type_error: "La longitud debe ser un numero."
    })
    .min(-180, "La longitud minima es -180.")
    .max(180, "La longitud maxima es 180.");

export const crearSeguimientoSchema = z.object({
    servicioId: objectIdSchema,
    conductorId: objectIdSchema
});

export const coordenadaSchema = z.object({
    lat: latSchema,
    lng: lngSchema
});

export const servicioIdParamSchema = z.object({
    servicioId: objectIdSchema
});

export const seguimientoIdParamSchema = z.object({
    id: objectIdSchema
});
-----------
*seguimiento.service.js*
import mongoose from "mongoose";
import SeguimientoRepository from "./seguimiento.repository.js";
import ServicioRepository from "../servicio/servicio.repository.js";
import AppError from "../../utils/AppError.js";

class SeguimientoService {

    // ======================================================
    // INICIAR SEGUIMIENTO
    // Se llama automaticamente desde ServicioService.iniciar()
    // ======================================================

    async iniciar(servicioId, conductorId) {

        if (!mongoose.Types.ObjectId.isValid(servicioId)) {
            throw new AppError(
                "El id del servicio no es valido.",
                400
            );
        }

        if (!mongoose.Types.ObjectId.isValid(conductorId)) {
            throw new AppError(
                "El id del conductor no es valido.",
                400
            );
        }

        const servicio =
            await ServicioRepository.obtenerPorId(servicioId);

        if (!servicio) {
            throw new AppError(
                "El servicio no existe.",
                404
            );
        }

        const seguimientoExistente =
            await SeguimientoRepository.obtenerPorServicio(
                servicioId
            );

        if (seguimientoExistente) {
            throw new AppError(
                "Ya existe un seguimiento para este servicio.",
                409
            );
        }

        return await SeguimientoRepository.crear({
            servicio: servicioId,
            conductor: conductorId,
            estado: "ACTIVO",
            coordenadas: [],
            fechaInicio: new Date()
        });

    }

    // ======================================================
    // OBTENER TODOS
    // ======================================================

    async obtenerTodos() {
        return await SeguimientoRepository.obtenerTodos();
    }

    // ======================================================
    // OBTENER POR ID
    // ======================================================

    async obtenerPorId(id) {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new AppError(
                "El id del seguimiento no es valido.",
                400
            );
        }

        const seguimiento =
            await SeguimientoRepository.obtenerPorId(id);

        if (!seguimiento) {
            throw new AppError(
                "Seguimiento no encontrado.",
                404
            );
        }

        return seguimiento;

    }

    // ======================================================
    // OBTENER POR SERVICIO
    // ======================================================

    async obtenerPorServicio(servicioId) {

        if (!mongoose.Types.ObjectId.isValid(servicioId)) {
            throw new AppError(
                "El id del servicio no es valido.",
                400
            );
        }

        return await SeguimientoRepository.obtenerPorServicio(
            servicioId
        );

    }

    // ======================================================
    // OBTENER ACTIVOS
    // ======================================================

    async obtenerActivos() {
        return await SeguimientoRepository.obtenerActivos();
    }

    // ======================================================
    // AGREGAR COORDENADA
    // Se usa desde Socket.IO y desde endpoint de testing
    // ======================================================

    async agregarCoordenada(servicioId, coordenada) {

        if (!mongoose.Types.ObjectId.isValid(servicioId)) {
            throw new AppError(
                "El id del servicio no es valido.",
                400
            );
        }

        const seguimiento =
            await SeguimientoRepository.obtenerPorServicio(
                servicioId
            );

        if (!seguimiento) {
            throw new AppError(
                "No existe un seguimiento para este servicio.",
                404
            );
        }

        if (seguimiento.estado !== "ACTIVO") {
            throw new AppError(
                "El seguimiento no esta activo.",
                400
            );
        }

        if (
            typeof coordenada.lat !== "number" ||
            typeof coordenada.lng !== "number"
        ) {
            throw new AppError(
                "Las coordenadas deben ser numeros validos.",
                400
            );
        }

        return await SeguimientoRepository.agregarCoordenada(
            servicioId,
            coordenada
        );

    }

    // ======================================================
    // FINALIZAR SEGUIMIENTO
    // Se llama automaticamente desde ServicioService.finalizar()
    // ======================================================

    async finalizar(servicioId) {

        if (!mongoose.Types.ObjectId.isValid(servicioId)) {
            throw new AppError(
                "El id del servicio no es valido.",
                400
            );
        }

        return await SeguimientoRepository.finalizarPorServicio(
            servicioId
        );

    }

    // ======================================================
    // CANCELAR SEGUIMIENTO
    // Se llama automaticamente desde ServicioService.cancelar()
    // ======================================================

    async cancelar(servicioId) {

        if (!mongoose.Types.ObjectId.isValid(servicioId)) {
            throw new AppError(
                "El id del servicio no es valido.",
                400
            );
        }

        return await SeguimientoRepository.cancelarPorServicio(
            servicioId
        );

    }

}

export default new SeguimientoService();
-------------
*seguimiento.validation.js*
import validateSchema from "../../middlewares/validateSchema.js";

import {
    crearSeguimientoSchema,
    coordenadaSchema,
    servicioIdParamSchema,
    seguimientoIdParamSchema
} from "./seguimiento.schema.js";

export const validarCrearSeguimiento =
    validateSchema(crearSeguimientoSchema);

export const validarCoordenada =
    validateSchema(coordenadaSchema);

export const validarServicioIdParam =
    validateSchema(servicioIdParamSchema, "params");

export const validarSeguimientoIdParam =
    validateSchema(seguimientoIdParamSchema, "params");