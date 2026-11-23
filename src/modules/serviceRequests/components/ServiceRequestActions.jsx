import { Link } from 'react-router-dom'

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

function CloseRedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ color: '#dc2626' }}>
      <path d="M18 6 6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 21c.8-3.5 3.6-6 8-6s7.2 2.5 8 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function RoutePathIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="19" r="2.5" />
      <path d="M8.5 19h6.5a3.5 3.5 0 0 0 0-7h-6a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="17.5" cy="5" r="2.5" />
    </svg>
  )
}

function AlertTriangleRedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

export function EditActionButton({ to }) {
  return (
    <Link to={to} title="Editar" className="mc-icon-btn">
      <PencilIcon />
    </Link>
  )
}

export function ViewActionButton({ to }) {
  return (
    <Link to={to} title="Ver detalle" className="mc-icon-btn">
      <EyeIcon />
    </Link>
  )
}

export function DeleteActionButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} title="Eliminar" className="mc-icon-btn mc-icon-btn--danger" style={{ color: '#dc2626' }}>
      <CloseRedIcon />
    </button>
  )
}

export function StatusActionButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} title="Cambiar estado" className="mc-icon-btn mc-icon-btn--primary">
      <StatusIcon />
    </button>
  )
}

export function AssignActionButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} title="Asignar conductor" className="mc-icon-btn mc-icon-btn--primary">
      <PersonIcon />
    </button>
  )
}

export function RouteActionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Ver ruta"
      className="mc-icon-btn"
      style={{ color: '#9524DB', borderColor: '#e9d5ff', background: '#faf5ff' }}
    >
      <RoutePathIcon />
    </button>
  )
}

export function IncidentActionButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Ver novedad del servicio"
      className="mc-icon-btn mc-icon-btn--danger"
      style={{ color: '#dc2626', background: '#fef2f2', borderColor: '#fecaca' }}
    >
      <AlertTriangleRedIcon />
    </button>
  )
}
