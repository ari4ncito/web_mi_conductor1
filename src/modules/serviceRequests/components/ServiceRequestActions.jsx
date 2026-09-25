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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M9 7V5.5h6V7M8 7l.8 12h6.4L16 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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
    <button type="button" onClick={onClick} title="Eliminar" className="mc-icon-btn mc-icon-btn--danger">
      <TrashIcon />
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
