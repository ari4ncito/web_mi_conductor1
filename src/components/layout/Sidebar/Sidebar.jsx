import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext.jsx'

const colors = {
  background: '#06293a',
  backgroundDeep: '#041c2a',
  surfaceActive: '#0a3042',
  text: '#8aa3b0',
  textStrong: '#dfe9ec',
  textMuted: '#6f8793',
  accent: '#ffa53d',
  border: 'rgba(255, 255, 255, 0.05)',
  borderSoft: 'rgba(255, 255, 255, 0.08)',
  icon: '#6f8b96',
  iconStrong: '#cfe5ef',
}

function IconShell({ children, size = 24, color = colors.icon, style }) {
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

function ChevronIcon({ direction = 'down', color = colors.icon, size = 14 }) {
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

function GearIcon({ color = colors.icon }) {
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

function UsersIcon({ color = colors.icon }) {
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

function ShieldCheckIcon({ color = colors.icon }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </IconShell>
  )
}

function CarIcon({ color = colors.icon }) {
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

function SteeringWheelIcon({ color = colors.icon }) {
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

function BriefcaseIcon({ color = colors.icon }) {
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

function ClipboardCheckIcon({ color = colors.icon }) {
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

function ContactCardIcon({ color = colors.icon }) {
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

function FileTextIcon({ color = colors.icon }) {
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

function MapPinIcon({ color = colors.icon }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </IconShell>
  )
}

function AlertTriangleIcon({ color = colors.icon }) {
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

function LayoutDashboardIcon({ color = colors.icon }) {
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

function SupportIcon({ color = colors.icon }) {
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : undefined, position: 'relative' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: colors.accent,
          color: colors.backgroundDeep,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: '0.02em',
          flex: '0 0 auto',
          boxShadow: '0 10px 22px rgba(255, 165, 61, 0.18)',
        }}
      >
        MC
      </div>
      {!collapsed && (
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'Georgia, Times New Roman, serif',
              color: colors.accent,
              fontSize: 22,
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: '-0.03em',
            }}
          >
            Mi
            <br />
            Conductor
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
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle?.(); } }}
        style={{
          minHeight: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 10,
          padding: collapsed ? '0' : '0 0 0 12px',
          paddingRight: collapsed ? 0 : 10,
          cursor: 'pointer',
          borderRadius: 12,
          background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
          transition: 'background 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
          {icon}
          {!collapsed && (
            <span
              style={{
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.12em',
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
        {!collapsed && <ChevronIcon direction={expanded ? 'up' : 'down'} color={active ? colors.iconStrong : colors.icon} size={12} />}
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
      style={({ isActive }) => ({
        width: '100%',
        boxSizing: 'border-box',
        height: 38,
        border: 0,
        borderRadius: isActive ? 12 : 10,
        background: isActive ? colors.surfaceActive : 'transparent',
        color: isActive ? colors.textStrong : colors.text,
        font: 'inherit',
        padding: collapsed ? '0' : '0 10px 0 14px',
        margin: 0,
        textDecoration: 'none',
        textAlign: collapsed ? 'center' : 'left',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : undefined,
        gap: collapsed ? 0 : 10,
        boxShadow: isActive ? '0 8px 20px rgba(0, 0, 0, 0.18)' : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
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
                top: 0,
                bottom: 0,
                width: 3,
                background: colors.accent,
                borderRadius: '0 3px 3px 0',
                boxShadow: '0 0 12px rgba(255, 165, 61, 0.5)',
              }}
            />
          )}
          <span style={{ color: isActive ? colors.iconStrong : colors.icon, display: 'inline-flex' }}>
            {icon}
          </span>
          {!collapsed && (
            <span style={{ fontSize: 13, lineHeight: 1.2, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
function SectionButton({ icon, label, to, collapsed, active = false }) {
  const sharedStyle = {
    width: '100%',
    minHeight: 38,
    border: 0,
    background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
    color: active ? colors.textStrong : colors.text,
    padding: collapsed ? '0' : '0 0 0 12px',
    margin: 0,
    font: 'inherit',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'space-between',
    cursor: 'pointer',
    paddingRight: collapsed ? 0 : 12,
    textDecoration: 'none',
    borderRadius: 12,
    transition: 'background 0.2s ease, color 0.2s ease',
  }

  if (to) {
    return (
      <NavLink
        to={to}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
        style={({ isActive }) => ({
          ...sharedStyle,
          color: isActive || active ? colors.textStrong : colors.text,
          background: isActive || active ? colors.surfaceActive : 'transparent',
          boxShadow: isActive || active ? '0 8px 20px rgba(0, 0, 0, 0.18)' : 'none',
        })}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
          {icon}
          {!collapsed && (
            <span style={{ fontSize: 11, lineHeight: 1, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: active ? colors.textStrong : colors.textMuted, whiteSpace: 'nowrap' }}>
              {label}
            </span>
          )}
        </div>
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      style={sharedStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
        {icon}
        {!collapsed && (
          <span style={{ fontSize: 11, lineHeight: 1, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: active ? colors.textStrong : colors.textMuted, whiteSpace: 'nowrap' }}>
            {label}
          </span>
        )}
      </div>
      {!collapsed && <ChevronIcon color={active ? colors.iconStrong : colors.icon} size={12} />}
    </button>
  )
}
const Sidebar = React.memo(function Sidebar({ mobileOpen = false, onCloseMobile, collapsed = false, onToggleCollapse }) {
  const location = useLocation();
  const { logout } = useAuth()
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

  // Auto-abrir la sección que contiene la ruta activa
  useEffect(() => {
    if (activeSection === 'Configuración' || activeSection === 'Servicios' || activeSection === 'Operación') {
      setOpenSection(activeSection);
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
          width: 32,
          height: 32,
          borderRadius: 8,
          border: '1px solid rgba(255, 165, 61, 0.4)',
          background: colors.accent,
          color: colors.backgroundDeep,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(255, 165, 61, 0.35)',
          cursor: 'pointer',
          padding: 0,
          opacity: collapsed ? 1 : 0,
          pointerEvents: collapsed ? 'auto' : 'none',
          transition: 'opacity 0.25s ease 0.1s, transform 0.2s ease',
        }}
      >
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
          <path d="M4.25 3L8.25 7l-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: 13,
          overflowY: 'auto',
          marginLeft: collapsed ? -220 : 0,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6, flexShrink: 0 }}>
          {/* Botón cerrar SOLO para móvil/tablet */}
          <button
            type="button"
            aria-label="Cerrar menú móvil"
            onClick={onCloseMobile}
            className="mc-sidebar-close-btn"
            style={{
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
            }}
          >
            <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true">
              <path d="M8.25 3L4.25 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <BrandMark collapsed={false} />

        <nav style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 6, width: '100%', flex: 1 }}>
          <SectionToggle
            icon={<GearIcon />}
            label="Configuración"
            expanded={isSectionExpanded('Configuración')}
            onToggle={() => toggleSection('Configuración')}
            collapsed={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4, paddingLeft: 10 }}>
              <SubLink icon={<ShieldCheckIcon color={colors.iconStrong} />} label="Roles" to="/roles" end collapsed={false} />
            </div>
          </SectionToggle>

          <SectionButton icon={<UsersIcon />} label="Usuarios" to="/users" collapsed={false} active={activeSection === 'Usuarios'} />

          <SectionToggle
            icon={<BriefcaseIcon />}
            label="Servicios"
            expanded={isSectionExpanded('Servicios')}
            onToggle={() => toggleSection('Servicios')}
            collapsed={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4, paddingLeft: 10 }}>
              <SubLink icon={<CarIcon color={colors.iconStrong} />} label="Vehículos" to="/vehicles" end collapsed={false} />
              <SubLink icon={<SteeringWheelIcon color={colors.iconStrong} />} label="Conductores" to="/drivers" end collapsed={false} />
            </div>
          </SectionToggle>

          <SectionToggle
            icon={<ClipboardCheckIcon />}
            label="Ejecución"
            expanded={isSectionExpanded('Operación')}
            onToggle={() => toggleSection('Operación')}
            collapsed={false}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4, paddingLeft: 10 }}>
              <SubLink icon={<ContactCardIcon color={colors.iconStrong} />} label="Clientes" to="/clients" collapsed={false} />
              <SubLink icon={<FileTextIcon color={colors.iconStrong} />} label="Solicitudes" to="/service-requests" end collapsed={false} />
              <SubLink icon={<MapPinIcon color={colors.iconStrong} />} label="Trazabilidad y Control" to="/tracking" end collapsed={false} />
              <SubLink icon={<AlertTriangleIcon color={colors.iconStrong} />} label="Novedades" to="/incidents" end collapsed={false} />
            </div>
          </SectionToggle>

          <SectionButton icon={<LayoutDashboardIcon />} label="Dashboard" to="/dashboard" collapsed={false} active={activeSection === 'Dashboard'} />
        </nav>
      </aside>
    </>
  )
})

export default Sidebar;