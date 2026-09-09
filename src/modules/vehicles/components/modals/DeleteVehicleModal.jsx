import { useState } from 'react';
import VehiculoService from '../../services/VehiculoService';
function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function WarningIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function DeleteVehicleModal({ vehicle, open, onClose, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await VehiculoService.delete(vehicle._id);
      onDelete(vehicle._id);
      onClose();
    } catch (err) {
      console.error(err);
      // idealmente mostrar un error
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open || !vehicle) return null;

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
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(480px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#ffffff',
          boxShadow: '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '28px 32px 0' }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: '#fef2f2', display: 'grid', placeItems: 'center', color: '#dc2626', flexShrink: 0 }}>
            <WarningIcon className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', flexShrink: 0, padding: 4 }}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div style={{ padding: '16px 32px 28px' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#11384a', lineHeight: 1.2 }}>
            Eliminar Vehículo
          </h2>
          <p style={{ margin: '10px 0 0', color: '#7a7680', fontSize: 14, lineHeight: 1.5 }}>
            ¿Estás seguro de que deseas desactivar{' '}
            <span style={{ fontWeight: 700, color: '#1b1b1b' }}>{vehicle.marca} {vehicle.modelo}</span>
            {' '}con placa{' '}
            <span style={{ fontWeight: 700, color: '#1b1b1b' }}>{vehicle.placa}</span>
            ? El vehículo se marcará como inactivo (borrado lógico).
          </p>
        </div>

        {/* Footer Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px', borderTop: '1px solid rgba(17, 17, 17, 0.08)' }}>
          <button
            type="button"
            onClick={onClose}
            style={{ flex: 1, height: 48, borderRadius: 14, border: '1px solid rgba(17, 17, 17, 0.08)', background: '#ffffff', color: '#1b1b1b', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            style={{ flex: 1, height: 48, borderRadius: 14, border: 0, background: isDeleting ? '#f87171' : '#dc2626', color: '#ffffff', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 16px rgba(220, 38, 38, 0.28)' }}
          >
            {isDeleting ? 'Desactivando...' : 'Sí, Desactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}