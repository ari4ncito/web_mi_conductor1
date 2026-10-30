// src/modules/roles/components/modals/DeleteRoleModal.jsx
import React, { useEffect } from 'react';

/**
 * Ícono de advertencia / eliminación en color de peligro
 */
function TrashWarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

/**
 * Ícono de alerta triangular
 */
function AlertTriangleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/**
 * Spinner para estado de carga
 */
function SpinnerIcon() {
  return (
    <svg
      className="animate-spin"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function DeleteRoleModal({
  role,
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  // Manejo de la tecla Escape para cerrar
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onClose]);

  if (!open || !role) return null;

  const roleName = role.name || role.nombre || 'Sin nombre';
  const roleSlug = role.slug || (role.name ? role.name.toLowerCase().replace(/\s+/g, '_') : '—');
  const usersCount = role.usersAttached ?? role.usuariosAsignados ?? 0;
  const hasUsers = usersCount > 0;

  return (
    <div
      className="mc-modal-overlay"
      onClick={loading ? undefined : onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-role-title"
        className="mc-modal mc-modal--sm"
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: 24,
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.28)',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          overflow: 'hidden',
        }}
      >
        {/* =========================================================
            HEADER DEL MODAL
        ========================================================= */}
        <div className="mc-modal-header" style={{ paddingBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {/* Ícono de advertencia / eliminación en badge rojo suave */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(220, 38, 38, 0.22)',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TrashWarningIcon />
            </div>

            <div style={{ minWidth: 0 }}>
              <p className="mc-modal-subtitle" style={{ color: '#dc2626' }}>
                Confirmación
              </p>
              <h2
                id="delete-role-title"
                className="mc-modal-title"
                style={{
                  fontSize: 24,
                  marginTop: 4,
                  marginBottom: 6,
                  color: '#11384a',
                }}
              >
                ¿Eliminar rol?
              </h2>
              <p
                className="mc-modal-desc"
                style={{
                  margin: 0,
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: '#64748b',
                }}
              >
                ¿Estás seguro de que deseas eliminar permanentemente el rol{' '}
                <strong style={{ color: '#0f172a', fontWeight: 700 }}>
                  "{roleName}"
                </strong>
                ? Esta acción eliminará permanentemente el rol y no se podrá deshacer.
              </p>
            </div>
          </div>

          {/* Botón cerrar X */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="mc-modal-close"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* =========================================================
            CUERPO DEL MODAL
        ========================================================= */}
        <div
          style={{
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            background: '#ffffff',
          }}
        >
          {/* Tarjeta con los datos del rol a eliminar */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#dc2626',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: 13, color: '#64748b' }}>Rol seleccionado:</span>
              </div>
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                {roleName}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontSize: 12.5, color: '#64748b' }}>Identificador (slug):</span>
              <code
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#334155',
                  background: '#e2e8f0',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                }}
              >
                {roleSlug}
              </code>
            </div>

            {role.description && (
              <div
                style={{
                  fontSize: 12.5,
                  color: '#64748b',
                  lineHeight: 1.4,
                  paddingTop: 4,
                  borderTop: '1px dashed #e2e8f0',
                }}
              >
                {role.description}
              </div>
            )}
          </div>

          {/* Advertencia si tiene usuarios asignados */}
          {hasUsers ? (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e',
                fontSize: 13,
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <div style={{ color: '#d97706', marginTop: 1, flexShrink: 0 }}>
                <AlertTriangleIcon />
              </div>
              <div>
                <strong>Advertencia importante:</strong> Este rol tiene{' '}
                <strong>
                  {usersCount} {usersCount === 1 ? 'usuario asignado' : 'usuarios asignados'}
                </strong>
                . Al eliminarlo, dichos usuarios podrían ver interrumpido su acceso al sistema.
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                background: '#fef2f2',
                border: '1px solid #fee2e2',
                color: '#991b1b',
                fontSize: 12.5,
                lineHeight: 1.45,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ color: '#dc2626', flexShrink: 0 }}>
                <AlertTriangleIcon />
              </div>
              <span>
                Todos los permisos y configuraciones asociadas a este rol serán eliminados de forma definitiva.
              </span>
            </div>
          )}
        </div>

        {/* =========================================================
            FOOTER: BOTONES CANCELAR Y ELIMINAR ROL
        ========================================================= */}
        <div
          className="mc-modal-footer"
          style={{
            background: '#fafafa',
            borderTop: '1px solid rgba(17, 17, 17, 0.08)',
          }}
        >
          {/* Botón Cancelar: Cierra el modal sin realizar ninguna acción */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="mc-btn-secondary"
          >
            Cancelar
          </button>

          {/* Botón Eliminar rol: Ejecuta la eliminación únicamente después de confirmar */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="mc-btn-danger"
            style={{
              height: 48,
              padding: '0 24px',
              borderRadius: 16,
              fontWeight: 600,
            }}
          >
            {loading ? (
              <>
                <SpinnerIcon />
                <span>Eliminando rol...</span>
              </>
            ) : (
              <>
                <TrashWarningIcon />
                <span>Eliminar rol</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
