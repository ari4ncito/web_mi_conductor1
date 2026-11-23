import React from 'react';

/**
 * Componente unificado para alertas en páginas y formularios.
 * Estandariza el estilo visual exacto del proyecto:
 * - Error: fondo #fff1f2, borde #fecdd3, texto #be123c
 * - Success: fondo #f0fdf4, borde #bbf7d0, texto #166534
 * - Warning: fondo #fffbeb, borde #fde68a, texto #b45309
 * - Info: fondo #eff6ff, borde #dbeafe, texto #1e40af
 *
 * @param {'error'|'success'|'warning'|'info'} type - Tipo de alerta (por defecto 'error')
 * @param {string|React.ReactNode} message - Mensaje o contenido principal
 * @param {string|React.ReactNode} [children] - Contenido alternativo si no se pasa message
 * @param {Function} [onClose] - Función opcional para cerrar/descartar la alerta
 * @param {string} [className] - Clases adicionales de estilo
 * @param {React.CSSProperties} [style] - Estilos en línea opcionales
 */
export default function StatusAlert({
  type = 'error',
  message,
  children,
  onClose,
  className = '',
  style = {},
}) {
  const content = message || children;
  if (!content) return null;

  const typeConfig = {
    error: {
      background: '#fff1f2',
      border: '1px solid #fecdd3',
      color: '#be123c',
      btnColor: '#be123c',
    },
    success: {
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      color: '#166534',
      btnColor: '#166534',
    },
    warning: {
      background: '#fffbeb',
      border: '1px solid #fde68a',
      color: '#b45309',
      btnColor: '#b45309',
    },
    info: {
      background: '#eff6ff',
      border: '1px solid #dbeafe',
      color: '#1e40af',
      btnColor: '#1e40af',
    },
  };

  const current = typeConfig[type] || typeConfig.error;

  return (
    <div
      role="alert"
      className={`mc-status-alert ${className}`}
      style={{
        padding: '14px 20px',
        borderRadius: 14,
        background: current.background,
        border: current.border,
        color: current.color,
        fontSize: 14,
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        boxSizing: 'border-box',
        width: '100%',
        ...style,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {content}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificación"
          style={{
            background: 'transparent',
            border: 'none',
            color: current.btnColor,
            cursor: 'pointer',
            padding: 4,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1,
            borderRadius: 6,
            opacity: 0.85,
            transition: 'opacity 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
        >
          ✕
        </button>
      )}
    </div>
  );
}
