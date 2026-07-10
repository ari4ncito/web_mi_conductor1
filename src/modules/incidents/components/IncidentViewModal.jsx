import { useEffect, useState } from 'react'

import evidence1Img from '../assets/images/evidence1.jpg'
import evidence2Img from '../assets/images/evidence2.jpg'

const evidenceMap = {
  'evidence1.jpg': evidence1Img,
  'evidence2.jpg': evidence2Img,
}

const colors = {
  surface: '#ffffff',
  text: '#1b1b1b',
  textMuted: '#7a7680',
  border: 'rgba(17, 17, 17, 0.08)',
  accent: '#ff9a2f',
  backdrop: 'rgba(15, 23, 42, 0.6)',
  disabled: '#f3f4f6',
}

const statusConfig = {
  'Pendiente': { color: '#f97316', bg: '#fff7ed' },
  'En Proceso': { color: '#2563eb', bg: '#eff6ff' },
  'Completado': { color: '#16a34a', bg: '#f0fdf4' },
  'Cancelado': { color: '#dc2626', bg: '#fef2f2' },
}

const priorityConfig = {
  'Crítica': { background: '#FDECEC', color: '#D93025' },
  'Alta': { background: '#FDECEC', color: '#D93025' },
  'Media': { background: '#FFF4DB', color: '#C88600' },
  'Baja': { background: '#EAF8EE', color: '#1E8E3E' },
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function getEvidenceSrc(path) {
  if (!path) return null
  const filename = path.split('/').pop()
  return evidenceMap[filename] || null
}

export default function IncidentViewModal({ incident, onClose }) {
  if (!incident) return null

  const statusCfg = statusConfig[incident.estado] || { color: '#374151', bg: '#f3f4f6' }
  const priorityCfg = priorityConfig[incident.prioridad] || { background: '#EAF8EE', color: '#1E8E3E' }

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
        aria-labelledby="incident-view-title"
        style={{
          width: 'min(720px, calc(100% - 40px))',
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
        {/* Header */}
        <div style={{ padding: '28px 32px 24px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div style={{ maxWidth: 520 }}>
              <p style={{ margin: 0, color: '#f97316', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Novedad
              </p>
              <h2 id="incident-view-title" style={{ margin: '10px 0 0', color: '#11384a', fontSize: 28, lineHeight: 1.05, fontWeight: 700, fontFamily: 'Georgia, Times New Roman, serif' }}>
                {incident.id}
              </h2>
              <p style={{ margin: '12px 0 0', color: colors.textMuted, fontSize: 15, lineHeight: 1.6 }}>
                Información completa de la novedad reportada.
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

        {/* Body */}
        <div style={{ padding: '28px 32px', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '22px 18px' }}>

            {/* ID */}
            <div>
              <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>ID Novedad</div>
              <div style={{
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: '12px 16px',
                fontSize: 16,
                lineHeight: 1.45,
                color: colors.text,
                boxSizing: 'border-box',
                background: colors.disabled,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}>
                {incident.id}
              </div>
            </div>

            {/* Estado */}
            <div>
              <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Estado</div>
              <div style={{
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: '12px 16px',
                fontSize: 16,
                lineHeight: 1.45,
                boxSizing: 'border-box',
                background: colors.disabled,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 14px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  background: statusCfg.bg,
                  color: statusCfg.color,
                }}>
                  {incident.estado}
                </span>
              </div>
            </div>

            {/* Conductor */}
            <div>
              <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Conductor</div>
              <div style={{
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: '12px 16px',
                fontSize: 16,
                lineHeight: 1.45,
                color: colors.text,
                boxSizing: 'border-box',
                background: colors.disabled,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}>
                {incident.conductor}
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Prioridad</div>
              <div style={{
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: '12px 16px',
                fontSize: 16,
                lineHeight: 1.45,
                boxSizing: 'border-box',
                background: colors.disabled,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 14px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  ...priorityCfg,
                }}>
                  {incident.prioridad}
                </span>
              </div>
            </div>

            {/* Tipo */}
            <div>
              <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Tipo de Novedad</div>
              <div style={{
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: '12px 16px',
                fontSize: 16,
                lineHeight: 1.45,
                color: colors.text,
                boxSizing: 'border-box',
                background: colors.disabled,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}>
                {incident.tipo}
              </div>
            </div>

            {/* Fecha y Hora */}
            <div>
              <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Fecha y Hora</div>
              <div style={{
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: '12px 16px',
                fontSize: 16,
                lineHeight: 1.45,
                color: colors.text,
                boxSizing: 'border-box',
                background: colors.disabled,
                height: 48,
                display: 'flex',
                alignItems: 'center',
              }}>
                {incident.fecha} — {incident.hora}
              </div>
            </div>

            {/* Ubicación (condicional) */}
            {incident.ubicacion && (
              <div>
                <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Ubicación</div>
                <div style={{
                  width: '100%',
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  padding: '12px 16px',
                  fontSize: 16,
                  lineHeight: 1.45,
                  color: colors.text,
                  boxSizing: 'border-box',
                  background: colors.disabled,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {incident.ubicacion}
                </div>
              </div>
            )}

            {/* Descripción (ocupa ambas columnas) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Descripción</div>
              <div style={{
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                padding: '12px 16px',
                fontSize: 16,
                lineHeight: 1.6,
                color: colors.text,
                boxSizing: 'border-box',
                background: colors.disabled,
                minHeight: 80,
              }}>
                {incident.descripcion}
              </div>
            </div>

            {/* Evidencias (si existen) */}
            {incident.evidencias && incident.evidencias.length > 0 && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: '#6b5e52', fontSize: 16, marginBottom: 8 }}>Evidencias</div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                }}>
                  {incident.evidencias.map((path, idx) => {
                    const src = getEvidenceSrc(path)
                    return src ? (
                      <img
                        key={idx}
                        src={src}
                        alt={`Evidencia ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: 140,
                          objectFit: 'cover',
                          borderRadius: 12,
                          border: `1px solid ${colors.border}`,
                        }}
                      />
                    ) : null
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
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
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
