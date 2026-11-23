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

export default function DeleteVehicleModal({ vehicle, open, onClose, onDelete, onError }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await VehiculoService.delete(vehicle._id);
      onDelete("Vehículo eliminado exitosamente");
    } catch (err) {
      console.error(err);
      if (onError) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Error al eliminar el vehículo";
        onError(msg);
      }
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open || !vehicle) return null;

  return (
    <div
      className="mc-modal-overlay"
      onClick={onClose}
    >
      <div
        className="mc-modal mc-modal--sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mc-modal-header">
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(214, 69, 69, 0.12)', color: '#d64545', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <WarningIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="mc-modal-subtitle">
                Eliminar vehículo
              </p>
              <h2 id="modal-title" className="mc-modal-title">
                Confirmar eliminación
              </h2>
              <p className="mc-modal-desc">
                ¿Estás seguro de que deseas eliminar a <strong style={{ color: '#1b1b1b' }}>{vehicle.marca} {vehicle.modelo}</strong> con placa <strong style={{ color: '#1b1b1b' }}>{vehicle.placa}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="mc-modal-close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="mc-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="mc-btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="mc-btn-danger"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
