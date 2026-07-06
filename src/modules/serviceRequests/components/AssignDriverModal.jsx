import { useState, useMemo } from 'react'
import { getDrivers } from '../../drivers/services/driverStorage.js'
import { getVehicles } from '../../vehicles/services/vehicleStorage.js'

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

export default function AssignDriverModal({ onClose, onAssign }) {
  const [selectedDriverId, setSelectedDriverId] = useState(null)

  const allDrivers = useMemo(() => getDrivers(), [])
  const allVehicles = useMemo(() => getVehicles(), [])

  const availableDrivers = useMemo(() => {
    return allDrivers.filter((d) => d.currentState === 'available')
  }, [allDrivers])

  const getDriverVehicle = (driverName) => {
    const vehicle = allVehicles.find(
      (v) => v.owner?.toLowerCase() === driverName?.toLowerCase() && v.status === 'active'
    )
    return vehicle ?? null
  }

  const handleConfirm = () => {
    if (!selectedDriverId) return
    const driver = allDrivers.find((d) => d.id === selectedDriverId)
    if (!driver) return

    const vehicle = getDriverVehicle(driver.name)
    onAssign({
      driverName: driver.name,
      vehiclePlate: vehicle?.licensePlate ?? '—',
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
                const isSelected = selectedDriverId === driver.id
                const vehicle = getDriverVehicle(driver.name)

                return (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => setSelectedDriverId(driver.id)}
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
                        src={driver.photo}
                        alt={driver.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ color: '#111111', fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>
                          {driver.name}
                        </div>

                        {/* Rating */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#f59e0b', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                          <StarIcon />
                          <span>{driver.performance ?? '5.0'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#16a34a', fontSize: 14, fontWeight: 500 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                          Disponible
                        </span>
                        {vehicle && (
                          <span style={{ color: '#667085', fontSize: 14 }}>
                            {vehicle.name} · {vehicle.licensePlate}
                          </span>
                        )}
                      </div>

                      {/* Distance row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, color: '#667085', fontSize: 14 }}>
                        <LocationIcon />
                        <span>{distanceLabel(driver.id)}</span>
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
