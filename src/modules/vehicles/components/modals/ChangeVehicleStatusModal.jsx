import { useState } from 'react';
import useModalA11y from '../../../../hooks/useModalA11y';

const STATUS_OPTIONS = [
  {
    id: 'activo',
    label: 'Activo',
    description: 'El vehículo está disponible para asignación y solicitudes.',
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#bbf7d0',
    requiresMotivo: false,
  },
  {
    id: 'en_mantenimiento',
    label: 'En Mantenimiento',
    description: 'En revisión o taller mecánico. No apto para nuevos servicios.',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
    requiresMotivo: true,
    placeholder: 'Describe el motivo (ej. Falla en motor, cambio de frenos, taller mecánico)...',
  },
  {
    id: 'vendido',
    label: 'Vendido',
    description: 'El vehículo fue vendido o traspasado. No se listará en activos.',
    color: '#9333ea',
    bg: '#f3e8ff',
    border: '#e9d5ff',
    requiresMotivo: true,
    placeholder: 'Describe a quién se vendió o motivo de traspaso (ej. Vendido a tercero / familiar)...',
  },
  {
    id: 'inactivo',
    label: 'Inactivo',
    description: 'Desactivado temporalmente o suspendido.',
    color: '#4b5563',
    bg: '#f3f4f6',
    border: '#e5e7eb',
    requiresMotivo: true,
    placeholder: 'Indica la razón por la que se desactiva el vehículo...',
  },
];

export default function ChangeVehicleStatusModal({
  vehicle,
  onClose,
  onStatusChanged,
}) {
  const currentStatus =
    vehicle?.estadoVehiculo || (vehicle?.estado === false ? 'inactivo' : 'activo');

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [motivo, setMotivo] = useState(vehicle?.motivoCambioEstado || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useModalA11y(Boolean(vehicle), onClose);

  if (!vehicle) return null;

  const currentOption = STATUS_OPTIONS.find((opt) => opt.id === selectedStatus);
  const needsMotivo = currentOption?.requiresMotivo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (needsMotivo && (!motivo || motivo.trim().length < 3)) {
      setError('Por favor escribe el motivo del cambio (mínimo 3 caracteres).');
      return;
    }

    try {
      setLoading(true);
      await onStatusChanged(vehicle._id, selectedStatus, motivo.trim());
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Error al actualizar el estado.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const ownerName =
    `${vehicle.cliente?.usuario?.nombre || vehicle.cliente?.nombre || ''} ${vehicle.cliente?.usuario?.apellido || vehicle.cliente?.apellido || ''}`.trim() ||
    'Sin propietario asignado';

  return (
    <div
      className="mc-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
        style={{
          background: '#ffffff',
          borderRadius: 20,
          width: '100%',
          maxWidth: 520,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h2
                id="status-modal-title"
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  color: '#11384a',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  margin: 0,
                }}
              >
                Cambiar Estado del Vehículo
              </h2>
              <p style={{ fontSize: 12.5, color: '#64748b', margin: '2px 0 0 0' }}>
                Actualiza el estado operativo y registra el motivo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 8,
              display: 'flex',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info del Vehículo */}
        <div style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                {vehicle.marca} {vehicle.modelo} {vehicle.anio ? `(${vehicle.anio})` : ''}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                Propietario: <strong style={{ color: '#334155' }}>{ownerName}</strong>
              </div>
            </div>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 8,
                background: '#dbeafe',
                color: '#1d4ed8',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.04em',
                border: '1px solid #bfdbfe',
              }}
            >
              {vehicle.placa}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 10 }}>
            Selecciona el nuevo estado:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 18 }}>
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedStatus === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedStatus(opt.id);
                    setError('');
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `2px solid ${isSelected ? opt.color : '#e2e8f0'}`,
                    background: isSelected ? `${opt.bg}66` : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <input
                    type="radio"
                    name="vehicleStatus"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelectedStatus(opt.id)}
                    style={{ accentColor: opt.color, cursor: 'pointer', width: 17, height: 17 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isSelected ? opt.color : '#1e293b',
                        }}
                      >
                        {opt.label}
                      </span>
                      {opt.id === currentStatus && (
                        <span
                          style={{
                            fontSize: 11,
                            padding: '1px 6px',
                            borderRadius: 6,
                            background: '#f1f5f9',
                            color: '#64748b',
                            fontWeight: 500,
                          }}
                        >
                          Actual
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>
                      {opt.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Advertencia especial si es 'vendido' */}
          {selectedStatus === 'vendido' && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                color: '#6b21a8',
                fontSize: 12.5,
                lineHeight: 1.45,
                marginBottom: 16,
                display: 'flex',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div>
                <strong>Importante:</strong> Al marcar como <strong>Vendido</strong>, este vehículo dejará de listarse en tu inventario activo. El nuevo comprador podrá registrarlo con su propia tarjeta de propiedad en la plataforma.
              </div>
            </div>
          )}

          {/* Advertencia especial si es 'en_mantenimiento' */}
          {selectedStatus === 'en_mantenimiento' && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e',
                fontSize: 12.5,
                lineHeight: 1.45,
                marginBottom: 16,
                display: 'flex',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>🔧</span>
              <div>
                <strong>Mantenimiento preventivo o correctivo:</strong> El vehículo se mantendrá en tu lista pero no podrá ser asignado a servicios activos mientras se encuentre en este estado.
              </div>
            </div>
          )}

          {/* Campo Motivo */}
          <div style={{ marginBottom: 12 }}>
            <label
              htmlFor="status-motivo"
              style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}
            >
              {needsMotivo ? (
                <span>
                  Motivo o justificación <span style={{ color: '#ef4444' }}>*</span>
                </span>
              ) : (
                <span>Observación (opcional)</span>
              )}
            </label>
            <textarea
              id="status-motivo"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={currentOption?.placeholder || 'Escribe alguna observación relevante sobre el cambio...'}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              required={needsMotivo}
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
              paddingTop: 16,
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                border: 'none',
                background: '#0e3b43',
                color: '#ffffff',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(14, 59, 67, 0.3)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{loading ? 'Guardando...' : 'Confirmar Estado'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
