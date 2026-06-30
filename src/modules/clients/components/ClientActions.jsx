import { Link } from 'react-router-dom'

function BaseIconButton({ children, title, onClick, to, color = '#111111' }) {
  const sharedStyle = {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: '1px solid rgba(17, 17, 17, 0.08)',
    background: '#ffffff',
    color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(18, 39, 52, 0.04)',
  }

  if (to) {
    return (
      <Link to={to} title={title} style={sharedStyle}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} title={title} style={sharedStyle}>
      {children}
    </button>
  )
}

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

export function EditActionButton({ to }) {
  return (
    <BaseIconButton title="Editar" to={to}>
      <PencilIcon />
    </BaseIconButton>
  )
}

export function ViewActionButton({ to }) {
  return (
    <BaseIconButton title="Ver detalle" to={to}>
      <EyeIcon />
    </BaseIconButton>
  )
}

export function DeleteActionButton({ onClick }) {
  return (
    <BaseIconButton title="Eliminar" onClick={onClick} color="#c64a4a">
      <TrashIcon />
    </BaseIconButton>
  )
}
