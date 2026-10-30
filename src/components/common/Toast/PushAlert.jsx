// src/components/common/Toast/PushAlert.jsx
import React, { useEffect, useState } from 'react';

/**
 * Iconos para cada tipo de alerta
 */
function SuccessIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="w-5 h-5 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-5 h-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const TYPE_CONFIG = {
  success: {
    borderLeft: 'border-l-4 border-l-emerald-500',
    iconBg: 'bg-emerald-50 border border-emerald-100',
    barColor: '#10b981',
    icon: <SuccessIcon />,
    defaultTitle: 'Operación Exitosa',
  },
  error: {
    borderLeft: 'border-l-4 border-l-rose-500',
    iconBg: 'bg-rose-50 border border-rose-100',
    barColor: '#ef4444',
    icon: <ErrorIcon />,
    defaultTitle: 'Error en la Operación',
  },
  warning: {
    borderLeft: 'border-l-4 border-l-amber-500',
    iconBg: 'bg-amber-50 border border-amber-100',
    barColor: '#f59e0b',
    icon: <WarningIcon />,
    defaultTitle: 'Datos no válidos',
  },
  info: {
    borderLeft: 'border-l-4 border-l-blue-500',
    iconBg: 'bg-blue-50 border border-blue-100',
    barColor: '#3b82f6',
    icon: <InfoIcon />,
    defaultTitle: 'Información',
  },
};

export function PushAlertItem({ alert, onDismiss }) {
  const { id, type = 'info', title, message, duration = 4500 } = alert;
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!duration || duration <= 0) return;

    // Timeout para auto-cierre
    const dismissTimer = setTimeout(() => {
      onDismiss?.(id);
    }, duration);

    // Animación suave de barra de progreso
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(interval);
    };
  }, [id, duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
        animation: 'pushAlertSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      className={`
        pointer-events-auto
        w-full
        max-w-md
        bg-white
        rounded-xl
        border
        border-slate-200/80
        ${config.borderLeft}
        p-4
        relative
        overflow-hidden
        flex
        items-start
        gap-3.5
        transition-all
      `}
    >
      {/* Icono con badge */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg}`}>
        {config.icon}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-[13.5px] font-bold text-slate-900 tracking-tight leading-tight m-0">
          {title || config.defaultTitle}
        </h4>
        {message && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed m-0 break-words">
            {message}
          </p>
        )}
      </div>

      {/* Botón cerrar */}
      <button
        type="button"
        onClick={() => onDismiss?.(id)}
        aria-label="Cerrar notificación"
        className="
          text-slate-400
          hover:text-slate-700
          hover:bg-slate-100
          rounded-md
          p-1
          cursor-pointer
          transition-colors
          shrink-0
          -mr-1
          -mt-1
        "
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Barra de progreso de auto-cierre */}
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-[3px] transition-all ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: config.barColor,
            opacity: 0.85,
          }}
        />
      )}
    </div>
  );
}

/**
 * Contenedor flotante superior derecho para alertas push
 */
export default function PushAlertContainer({ alerts = [], onDismiss }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div
      aria-label="Notificaciones del sistema"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-2.5rem)]"
      style={{
        perspective: '1000px',
      }}
    >
      <style>
        {`
          @keyframes pushAlertSlideIn {
            from {
              opacity: 0;
              transform: translateX(45px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>
      {alerts.map((alert) => (
        <PushAlertItem key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
