// modules/roles/components/modals/ChangeStatusModal.jsx

import { useState } from 'react';
import roleService from '../../services/roleService';

/* =========================================================
   ICONO DE ADVERTENCIA
========================================================= */

function WarningIcon() {
  return (
    <svg
      className="w-5 h-5 text-amber-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function ChangeStatusModal({
  role,
  open,
  onClose,
  refresh,
}) {

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  if (!open || !role) {
    return null;
  }

  const isActive = role.status === 'active';

  /* =======================================================
     CAMBIAR ESTADO
  ======================================================= */

  const handleConfirm = async () => {

    try {

      setSaving(true);

      setError('');

      const nuevoEstado = !isActive;

      console.log(
        'Cambiando estado del rol:',
        {
          id: role.id,
          activo: nuevoEstado,
        }
      );

      /*
       * Enviamos únicamente el campo activo.
       *
       * PUT /roles/:id
       */
      const response = await roleService.update(
        role.id,
        {
          activo: nuevoEstado,
        }
      );

      console.log(
        'Respuesta cambio de estado:',
        response
      );

      /*
       * Volvemos a cargar los roles desde MongoDB
       */
      await refresh();

      onClose();

    } catch (error) {

      console.error(
        'Error cambiando estado del rol:',
        error
      );

      setError(
        error?.response?.data?.message ||
        'No se pudo cambiar el estado del rol.'
      );

    } finally {

      setSaving(false);

    }

  };

  /* =======================================================
     RENDER
  ======================================================= */

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
          width: 'min(560px, calc(100% - 40px))',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: 30,
          background: '#ffffff',
          boxShadow:
            '0 30px 90px rgba(5, 16, 24, 0.28)',
          overflowY: 'auto',
          border:
            '1px solid rgba(17, 17, 17, 0.08)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            padding: '28px 32px 24px',
            borderBottom:
              '1px solid rgba(17, 17, 17, 0.08)',
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >

            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#fde6d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >

              <WarningIcon />

            </div>

            <div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#11384a',
                  lineHeight: 1.2,
                }}
              >
                Cambiar estado
              </h3>

              <p
                style={{
                  margin: '4px 0 0',
                  color: '#7a7680',
                  fontSize: 14,
                }}
              >
                Esta acción afecta el acceso del rol en el sistema.
              </p>

            </div>

          </div>

          {/* CERRAR */}

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: saving
                ? 'not-allowed'
                : 'pointer',
              flexShrink: 0,
              padding: 4,
            }}
          >

            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />

            </svg>

          </button>

        </div>


        {/* =================================================
            BODY
        ================================================= */}

        <div
          style={{
            padding: '20px 32px',
          }}
        >

          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: '#4a5568',
              lineHeight: 1.6,
            }}
          >

            {isActive ? (

              <>
                ¿Deseas{' '}

                <span
                  style={{
                    fontWeight: 600,
                    color: '#dc2626',
                  }}
                >
                  desactivar
                </span>{' '}

                el rol{' '}

                <span
                  style={{
                    fontWeight: 600,
                    color: '#11384a',
                  }}
                >
                  "{role.name}"
                </span>
                ?

                <br />

                Los usuarios con este rol perderán acceso
                mientras el rol permanezca inactivo.
              </>

            ) : (

              <>
                ¿Deseas{' '}

                <span
                  style={{
                    fontWeight: 600,
                    color: '#0d9488',
                  }}
                >
                  activar
                </span>{' '}

                el rol{' '}

                <span
                  style={{
                    fontWeight: 600,
                    color: '#11384a',
                  }}
                >
                  "{role.name}"
                </span>
                ?

                <br />

                Los usuarios asignados podrán volver a
                utilizar este rol.
              </>

            )}

          </p>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div
              style={{
                marginTop: 18,
                padding: '12px 16px',
                borderRadius: 12,
                background: '#fff1f2',
                border:
                  '1px solid #fecdd3',
                color: '#be123c',
                fontSize: 14,
              }}
            >

              {error}

            </div>

          )}

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            padding: '16px 32px',
            borderTop:
              '1px solid rgba(17, 17, 17, 0.08)',
          }}
        >

          {/* CANCELAR */}

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              height: 40,
              borderRadius: 12,
              border:
                '1px solid rgba(17, 17, 17, 0.08)',
              background: '#ffffff',
              color: '#1b1b1b',
              fontSize: 14,
              fontWeight: 500,
              cursor: saving
                ? 'not-allowed'
                : 'pointer',
              padding: '0 20px',
              opacity: saving ? 0.6 : 1,
            }}
          >
            Cancelar
          </button>


          {/* CONFIRMAR */}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            style={{
              height: 40,
              borderRadius: 12,
              border: 0,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving
                ? 'not-allowed'
                : 'pointer',
              padding: '0 20px',
              background:
                isActive
                  ? '#dc2626'
                  : '#ff9a2f',
              boxShadow:
                isActive
                  ? 'none'
                  : '0 8px 16px rgba(255, 154, 47, 0.28)',
              opacity: saving ? 0.7 : 1,
            }}
          >

            {saving
              ? 'Guardando...'
              : isActive
                ? 'Desactivar rol'
                : 'Activar rol'
            }

          </button>

        </div>

      </div>

    </div>

  );

}