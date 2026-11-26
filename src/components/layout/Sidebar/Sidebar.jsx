import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import logoMiConductor from '../../../assets/logo-mi-conductor.png'

const colors = {
  background: '#06293a',
  backgroundDeep: '#041c2a',
  surfaceActive: '#0c3b50',
  surfaceHover: 'rgba(255, 255, 255, 0.05)',
  text: '#9ab1be',
  textStrong: '#f1f6f9',
  textMuted: '#89a3b1',
  accent: '#ffa53d',
  border: 'rgba(255, 255, 255, 0.06)',
  borderSoft: 'rgba(255, 255, 255, 0.1)',
  icon: '#7a97a6',
  iconStrong: '#ffffff',
}

function IconShell({ children, size = 24, color = 'currentColor', style }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        flex: '0 0 auto',
        ...style,
      }}
    >
      {children}
    </span>
  )
}

function ChevronIcon({ direction = 'down', color = 'currentColor', size = 14 }) {
  const rotate = direction === 'up' ? 'rotate(180deg)' : 'none'

  return (
    <IconShell size={size} color={color}>
      <svg viewBox="0 0 14 14" width={size} height={size} style={{ transform: rotate }}>
        <path
          d="M3 5.25L7 9.25L11 5.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconShell>
  )
}

function GearIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M19.4 13.2c.05-.4.08-.8.08-1.2s-.03-.8-.08-1.2l2.04-1.6-1.9-3.3-2.44.93a7.3 7.3 0 0 0-2.08-1.2L14.6 2.9h-3.8l-.42 2.73c-.75.24-1.44.6-2.08 1.06l-2.54-1L4 9.1l2.08 1.6c-.05.4-.08.8-.08 1.2s.03.8.08 1.2L4 14.7l1.9 3.3 2.54-1c.64.46 1.33.82 2.08 1.06l.42 2.73h3.8l.42-2.73c.75-.24 1.44-.6 2.08-1.06l2.44.93 1.9-3.3-2.04-1.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </svg>
    </IconShell>
  )
}

function UsersIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </IconShell>
  )
}

function ShieldCheckIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </IconShell>
  )
}

function CarIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.6 0-1.1.2-1.4.6L3 11.5c-.6.8-1 1.8-1 2.8V17c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    </IconShell>
  )
}

function SteeringWheelIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 14v7" />
        <path d="M10 12l-6.75-2" />
        <path d="M14 12l6.75-2" />
      </svg>
    </IconShell>
  )
}

function BriefcaseIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    </IconShell>
  )
}

function ClipboardCheckIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" />
        <path d="m9 13 2 2 4-4" />
      </svg>
    </IconShell>
  )
}

function ContactCardIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 17a5 5 0 0 1 10 0" />
      </svg>
    </IconShell>
  )
}

function FileTextIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    </IconShell>
  )
}

function AlertTriangleIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.5 21 20H3L12 4.5z" />
        <path d="M12 10v4" />
        <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    </IconShell>
  )
}

function LayoutDashboardIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    </IconShell>
  )
}

function SupportIcon({ color = 'currentColor' }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path d="M9.7 9.6a2.7 2.7 0 1 1 3.7 2.5c-.9.3-1.4.9-1.4 1.9" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16.9h.01" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
      </svg>
    </IconShell>
  )
}

function PlusCircleIcon({ color = colors.backgroundDeep }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </IconShell>
  )
}

function BrandMark({ collapsed }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: collapsed ? '6px 0 12px' : '8px 8px 16px',
        borderBottom: `1px solid ${colors.borderSoft}`,
      }}
    >
      <div
        style={{
          width: collapsed ? 42 : 128,
          height: collapsed ? 42 : 128,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid #ffa53d',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.45), 0 0 22px rgba(255, 165, 61, 0.24)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
          background: colors.backgroundDeep,
        }}
      >
        <img
          src={logoMiConductor}
          alt="Mi Conductor"
          width={collapsed ? 42 : 128}
          height={collapsed ? 42 : 128}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.07)',
            display: 'block',
          }}
        />
      </div>
      {!collapsed && (
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              color: colors.accent,
              fontSize: 22,
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
          </div>
        </div>
      )}
    </div>
  )
}

function SectionToggle({ icon, label, expanded = false, onToggle, collapsed, active = false, children }) {
  return (
    <div>
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className={`mc-section-row ${active ? 'mc-section-row-active' : ''}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle?.(); } }}
        style={{
          minHeight: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 10,
          padding: collapsed ? '0' : '0 10px 0 12px',
          cursor: 'pointer',
          borderRadius: 10,
          background: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          color: active ? colors.textStrong : colors.textMuted,
          transition: 'background 0.18s ease, color 0.18s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
          <span style={{ color: active ? colors.accent : colors.icon, display: 'inline-flex', transition: 'color 0.18s ease' }}>
            {icon}
          </span>
          {!collapsed && (
            <span
              style={{
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.11em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: active ? colors.textStrong : colors.textMuted,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          )}
        </div>
        {!collapsed && <ChevronIcon direction={expanded ? 'up' : 'down'} color={active ? colors.accent : colors.icon} size={12} />}
      </div>
      {!collapsed && expanded && children}
    </div>
  )
}

function SubLink({ icon, label, to, end = false, collapsed }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) => `mc-sublink ${isActive ? 'mc-sublink-active' : ''}`}
      style={({ isActive }) => ({
        width: '100%',
        boxSizing: 'border-box',
        height: 36,
        border: isActive ? '1px solid rgba(255, 165, 61, 0.16)' : '1px solid transparent',
        borderRadius: 10,
        background: isActive ? colors.surfaceActive : 'transparent',
        color: isActive ? colors.textStrong : colors.text,
        font: 'inherit',
        padding: collapsed ? '0' : '0 10px 0 12px',
        margin: 0,
        textDecoration: 'none',
        textAlign: collapsed ? 'center' : 'left',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : undefined,
        gap: collapsed ? 0 : 10,
        boxShadow: isActive ? '0 6px 16px rgba(0, 0, 0, 0.22)' : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
      })}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 5,
                bottom: 5,
                width: 3,
                background: colors.accent,
                borderRadius: '0 3px 3px 0',
                boxShadow: '0 0 10px rgba(255, 165, 61, 0.65)',
              }}
            />
          )}
          <span style={{ color: isActive ? colors.accent : colors.icon, display: 'inline-flex', transition: 'color 0.18s ease' }}>
            {icon}
          </span>
          {!collapsed && (
            <span style={{ fontSize: 13, lineHeight: 1.2, fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
function SectionButton({ icon, label, to, collapsed, active = false, onClick }) {
  const sharedStyle = {
    width: '100%',
    minHeight: 38,
    border: '1px solid transparent',
    background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
    color: active ? colors.textStrong : colors.text,
    padding: collapsed ? '0' : '0 12px',
    margin: 0,
    font: 'inherit',
    textAlign: 'left',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'space-between',
    cursor: 'pointer',
    textDecoration: 'none',
    borderRadius: 10,
    overflow: 'hidden',
    transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
  }

  if (to) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
        className={({ isActive }) => `mc-section-row ${(isActive || active) ? 'mc-section-row-active' : ''}`}
        style={({ isActive }) => ({
          ...sharedStyle,
          border: (isActive || active) ? '1px solid rgba(255, 165, 61, 0.16)' : '1px solid transparent',
          color: isActive || active ? colors.textStrong : colors.text,
          background: isActive || active ? colors.surfaceActive : 'transparent',
          boxShadow: isActive || active ? '0 6px 16px rgba(0, 0, 0, 0.22)' : 'none',
        })}
      >
        {({ isActive }) => (
          <>
            {(isActive || active) && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 5,
                  bottom: 5,
                  width: 3,
                  background: colors.accent,
                  borderRadius: '0 3px 3px 0',
                  boxShadow: '0 0 10px rgba(255, 165, 61, 0.65)',
                }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
              <span style={{ color: (isActive || active) ? colors.accent : colors.icon, display: 'inline-flex', transition: 'color 0.18s ease' }}>
                {icon}
              </span>
              {!collapsed && (
                <span style={{ fontSize: 11, lineHeight: 1, letterSpacing: '0.11em', textTransform: 'uppercase', fontWeight: 700, color: (isActive || active) ? colors.textStrong : colors.textMuted, whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              )}
            </div>
          </>
        )}
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      className="mc-section-row"
      style={sharedStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
        {icon}
        {!collapsed && (
          <span style={{ fontSize: 11, lineHeight: 1, letterSpacing: '0.11em', textTransform: 'uppercase', fontWeight: 700, color: active ? colors.textStrong : colors.textMuted, whiteSpace: 'nowrap' }}>
            {label}
          </span>
        )}
      </div>
      {!collapsed && <ChevronIcon color={active ? colors.accent : colors.icon} size={12} />}
    </button>
  )
}
const Sidebar = React.memo(function Sidebar({ mobileOpen = false, onCloseMobile, collapsed = false, onToggleCollapse }) {
  const location = useLocation();
  const { logout, hasPermission, rol } = useAuth()
  const [openSection, setOpenSection] = useState(null);

  const activeSection = useMemo(() => {
    const sectionMap = {
      Configuración: ['/roles'],
      Servicios: ['/vehicles', '/drivers'],
      Operación: ['/clients', '/service-requests', '/tracking', '/incidents'],
      Dashboard: ['/dashboard'],
      Usuarios: ['/users'],
    };

    for (const [section, paths] of Object.entries(sectionMap)) {
      if (paths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))) {
        return section;
      }
    }

    return null;
  }, [location.pathname]);

  // Auto-abrir la sección que contiene la ruta activa y cerrar acordeones al ir a secciones directas
  useEffect(() => {
    if (activeSection === 'Configuración' || activeSection === 'Servicios' || activeSection === 'Operación') {
      setOpenSection(activeSection);
    } else {
      setOpenSection(null);
    }
  }, [activeSection]);

  const isSectionExpanded = (label) => openSection === label;

  const toggleSection = (label) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <style>{`
        .mc-sidebar{ scrollbar-width: none; -ms-overflow-style: none; }
        .mc-sidebar::-webkit-scrollbar{ display: none; width: 0; height: 0; }

        .mc-section-row:not(.mc-section-row-active):hover,
        .mc-sublink:not(.mc-sublink-active):hover {
          background: ${colors.surfaceHover} !important;
          color: ${colors.textStrong} !important;
        }
        .mc-sidebar-collapse-btn,
        .mc-sidebar-desktop-btn,
        .mc-sidebar-close-btn {
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }
        .mc-sidebar-collapse-btn:hover,
        .mc-sidebar-desktop-btn:hover {
          transform: scale(1.06);
          filter: brightness(1.06);
        }
        .mc-sidebar button:focus-visible,
        .mc-sidebar a:focus-visible,
        .mc-sidebar [role="button"]:focus-visible,
        .mc-sidebar-desktop-btn:focus-visible {
          outline: 2px solid ${colors.accent};
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .mc-sidebar,
          .mc-section-row,
          .mc-sublink,
          .mc-sidebar-collapse-btn,
          .mc-sidebar-desktop-btn,
          .mc-sidebar-close-btn {
            transition: none !important;
          }
        }
        
        /* En PC / Desktop (>= 1024px): NO mostrar botón de cerrar, SÍ mostrar colapso */
        .mc-sidebar-close-btn {
          display: none !important;
        }
        .mc-sidebar-collapse-btn {
          display: inline-flex !important;
        }

        /* En Móvil / Tablet (< 1024px): SÍ mostrar botón de cerrar, NUNCA mostrar colapso */
        @media (max-width: 1023px) {
          .mc-sidebar-close-btn {
            display: inline-flex !important;
          }
          .mc-sidebar-collapse-btn,
          .mc-sidebar-desktop-btn {
            display: none !important;
          }
          .mc-sidebar-mobile-overlay {
            position: fixed;
            inset: 0;
            background: rgba(4, 28, 42, 0.6);
            backdrop-filter: blur(4px);
            z-index: 9990;
            transition: opacity 0.3s ease;
          }
          .mc-sidebar {
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 9999 !important;
            box-shadow: 0 0 35px rgba(0, 0, 0, 0.5);
            margin-left: 0 !important;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .mc-sidebar.mc-sidebar-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>

      {/* Overlay para móvil cuando el sidebar esté abierto */}
      {mobileOpen && (
        <div
          className="mc-sidebar-mobile-overlay"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Botón flotante para expandir en Desktop cuando está colapsado */}
      <button
        type="button"
        aria-label="Expandir menú"
        onClick={() => onToggleCollapse?.(false)}
        className="mc-sidebar-desktop-btn"
        style={{
          position: 'fixed',
          top: 15,
          left: 12,
          zIndex: 1000,
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: 0,
          background: colors.accent,
          color: colors.backgroundDeep,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 22px rgba(255, 165, 61, 0.28)',
          cursor: 'pointer',
          padding: 0,
          opacity: collapsed ? 1 : 0,
          pointerEvents: collapsed ? 'auto' : 'none',
          transition: 'opacity 0.25s ease 0.1s, transform 0.2s ease',
        }}
      >
        <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
          <path d="M4.25 3L8.25 7l-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <aside
        className={`mc-sidebar ${mobileOpen ? 'mc-sidebar-open' : ''}`}
        style={{
          width: 220,
          minWidth: 220,
          height: '100vh',
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundDeep} 100%)`,
          color: colors.text,
          position: 'relative',
          padding: '18px 10px 14px',
          boxSizing: 'border-box',
          borderRight: `1px solid ${colors.border}`,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: 13,
          overflowY: 'auto',
          marginLeft: collapsed ? -220 : 0,
          flexShrink: 0,
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Botón cerrar SOLO para móvil/tablet */}
          <button
            type="button"
            aria-label="Cerrar menú móvil"
            onClick={onCloseMobile}
            className="mc-sidebar-close-btn"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 30,
              height: 30,
              borderRadius: 10,
              border: 0,
              background: 'rgba(255, 255, 255, 0.08)',
              color: colors.textStrong,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              zIndex: 2,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Botón colapsar SOLO para PC / Desktop */}
          <button
            type="button"
            aria-label="Colapsar menú"
            onClick={() => onToggleCollapse?.(true)}
            className="mc-sidebar-collapse-btn"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: 0,
              background: colors.accent,
              color: colors.backgroundDeep,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 22px rgba(255, 165, 61, 0.28)',
              cursor: 'pointer',
              padding: 0,
              zIndex: 2,
            }}
          >
            <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
              <path d="M8.25 3L4.25 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <BrandMark collapsed={false} />
        </div>

        <nav style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6, width: '100%', flex: 1 }}>
          <SectionButton icon={<LayoutDashboardIcon />} label="Dashboard" to="/dashboard" collapsed={false} active={activeSection === 'Dashboard'} onClick={() => setOpenSection(null)} />

          {hasPermission(['ver.roles', 'crear.roles', 'editar.roles', 'eliminar.roles']) && (
            <SectionToggle
              icon={<GearIcon />}
              label="Configuración"
              expanded={isSectionExpanded('Configuración')}
              onToggle={() => toggleSection('Configuración')}
              collapsed={false}
              active={activeSection === 'Configuración'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4, marginLeft: 21, paddingLeft: 10, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <SubLink icon={<ShieldCheckIcon color="currentColor" />} label="Roles" to="/roles" end collapsed={false} />
              </div>
            </SectionToggle>
          )}

          {hasPermission(['ver.usuarios', 'crear.usuarios', 'editar.usuarios', 'eliminar.usuarios']) && (
            <SectionButton icon={<UsersIcon />} label="Usuarios" to="/users" collapsed={false} active={activeSection === 'Usuarios'} onClick={() => setOpenSection(null)} />
          )}

          {(hasPermission(['ver.vehiculos', 'crear.vehiculos', 'editar.vehiculos', 'eliminar.vehiculos']) ||
            hasPermission(['ver.conductores', 'crear.conductores', 'editar.conductores', 'eliminar.conductores'])) && (
            <SectionToggle
              icon={<BriefcaseIcon />}
              label="Servicios"
              expanded={isSectionExpanded('Servicios')}
              onToggle={() => toggleSection('Servicios')}
              collapsed={false}
              active={activeSection === 'Servicios'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4, marginLeft: 21, paddingLeft: 10, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {hasPermission(['ver.vehiculos', 'crear.vehiculos', 'editar.vehiculos', 'eliminar.vehiculos']) && (
                  <SubLink icon={<CarIcon color="currentColor" />} label="Vehículos" to="/vehicles" end collapsed={false} />
                )}
                {hasPermission(['ver.conductores', 'crear.conductores', 'editar.conductores', 'eliminar.conductores']) && (
                  <SubLink icon={<SteeringWheelIcon color="currentColor" />} label="Conductores" to="/drivers" end collapsed={false} />
                )}
              </div>
            </SectionToggle>
          )}

          {(hasPermission(['ver.clientes', 'crear.clientes', 'editar.clientes', 'eliminar.clientes']) ||
            hasPermission(['ver.solicitudes', 'crear.solicitudes', 'asignar.solicitudes', 'ruta.solicitudes', 'cancelar.solicitudes', 'detalles.solicitudes']) ||
            hasPermission(['ver.novedades', 'crear.novedades', 'editar.novedades', 'eliminar.novedades'])) && (
            <SectionToggle
              icon={<ClipboardCheckIcon />}
              label="Ejecución"
              expanded={isSectionExpanded('Operación')}
              onToggle={() => toggleSection('Operación')}
              collapsed={false}
              active={activeSection === 'Operación'}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4, marginLeft: 21, paddingLeft: 10, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {hasPermission(['ver.clientes', 'crear.clientes', 'editar.clientes', 'eliminar.clientes']) && (
                  <SubLink icon={<ContactCardIcon color="currentColor" />} label="Clientes" to="/clients" collapsed={false} />
                )}
                {hasPermission(['ver.solicitudes', 'crear.solicitudes', 'asignar.solicitudes', 'ruta.solicitudes', 'cancelar.solicitudes', 'detalles.solicitudes']) && (
                  <SubLink icon={<FileTextIcon color="currentColor" />} label="Solicitudes" to="/service-requests" end collapsed={false} />
                )}
                {hasPermission(['ver.novedades', 'crear.novedades', 'editar.novedades', 'eliminar.novedades']) && (
                  <SubLink icon={<AlertTriangleIcon color="currentColor" />} label="Novedades" to="/incidents" end collapsed={false} />
                )}
              </div>
            </SectionToggle>
          )}
        </nav>
      </aside>
    </>
  )
})

export default Sidebar;