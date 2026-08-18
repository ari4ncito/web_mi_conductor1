import { useState } from 'react'
import { NavLink } from 'react-router-dom'
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
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M16.5 18.5c0-2.5-2.1-4.5-4.5-4.5s-4.5 2-4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M12 12.75a3.25 3.25 0 1 0 0-6.5a3.25 3.25 0 1 0 0 6.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    </IconShell>
  )
}

function VehicleIcon({ color = colors.icon }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path
          d="M4.5 14.5h15l-1.3-5.4a1.7 1.7 0 0 0-1.65-1.3H7.45c-.8 0-1.5.52-1.72 1.28L4.5 14.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="M6.4 14.5v2.4M17.6 14.5v2.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path d="M8 10.3h8" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </IconShell>
  )
}

function ClipboardIcon({ color = colors.icon }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect x="6" y="5" width="12" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path d="M9 5.5h6M9 10h6M9 14h6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </IconShell>
  )
}

function ChartIcon({ color = colors.icon }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M5 19.5h14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M7 17V10M11 17V7M15 17v-4M19 17V5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M6.5 12.5L11 8l2.7 2.2 4.3-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </IconShell>
  )
}

function WarningIcon({ color = colors.icon }) {
  return (
    <IconShell color={color}>
      <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M12 4.5 20 18H4L12 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M12 9v4.5M12 16.8h.01" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
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
          <div style={{ marginTop: 3, fontSize: 12, lineHeight: 1.1, color: '#8ba4af', letterSpacing: '0.01em' }}>
            Enterprise Portal
          </div>
        </div>
      )}
    </div>
  )
}

function UserAvatar() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 35% 28%, rgba(239, 248, 250, 0.95) 0 16%, rgba(168, 191, 198, 0.75) 28%, rgba(48, 77, 83, 0.95) 54%, rgba(18, 42, 49, 1) 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.14), 0 8px 18px rgba(0, 0, 0, 0.28)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 50% 36%, rgba(255,255,255,0.38) 0 12%, transparent 13%), radial-gradient(circle at 50% 66%, rgba(255,255,255,0.1) 0 22%, transparent 23%)',
        }}
      />
    </div>
  )
}

function SectionToggle({ icon, label, expanded = false, onToggle, collapsed, children }) {
  return (
    <div>
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle?.(); } }}
        style={{
          minHeight: 33,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 12,
          padding: collapsed ? '0' : '0 0 0 16px',
          paddingRight: collapsed ? 0 : 12,
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
          {icon}
          {!collapsed && (
            <span
              style={{
                fontSize: 12,
                lineHeight: 1,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: colors.textMuted,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          )}
        </div>
        {!collapsed && <ChevronIcon direction={expanded ? 'up' : 'down'} />}
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
        height: 48,
        border: 0,
        borderRadius: isActive ? 14 : 10,
        background: isActive ? colors.surfaceActive : 'transparent',
        color: isActive ? colors.textStrong : colors.text,
        font: 'inherit',
        padding: collapsed ? '0' : '0 14px 0 16px',
        margin: 0,
        textDecoration: 'none',
        textAlign: collapsed ? 'center' : 'left',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : undefined,
        gap: collapsed ? 0 : 12,
        boxShadow: isActive ? '0 12px 26px rgba(0, 0, 0, 0.22)' : 'none',
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
            <span style={{ fontSize: 16, lineHeight: 1.2, fontWeight: isActive ? 500 : 400, whiteSpace: 'nowrap' }}>
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
function SectionButton({ icon, label, to, collapsed }) {
  const sharedStyle = {
    width: '100%',
    minHeight: 40,
    border: 0,
    background: 'transparent',
    color: colors.text,
    padding: collapsed ? '0' : '0 0 0 16px',
    margin: 0,
    font: 'inherit',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'space-between',
    cursor: 'pointer',
    paddingRight: collapsed ? 0 : 12,
    textDecoration: 'none',
  }

  if (to) {
    return (
      <NavLink
        to={to}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
        style={({ isActive }) => ({
          ...sharedStyle,
          color: isActive ? colors.textStrong : colors.text,
          background: isActive ? colors.surfaceActive : 'transparent',
          borderRadius: 14,
          boxShadow: isActive ? '0 12px 26px rgba(0, 0, 0, 0.22)' : 'none',
        })}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
          {icon}
          {!collapsed && (
            <span style={{ fontSize: 12, lineHeight: 1, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: colors.textMuted, whiteSpace: 'nowrap' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 12, justifyContent: collapsed ? 'center' : undefined, minWidth: 0 }}>
        {icon}
        {!collapsed && (
          <span style={{ fontSize: 12, lineHeight: 1, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: colors.textMuted, whiteSpace: 'nowrap' }}>
            {label}
          </span>
        )}
      </div>
      {!collapsed && <ChevronIcon />}
    </button>
  )
}

export default function Sidebar() {
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    Configuración: true,
    Operación: true,
    Servicios: true,
  });

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <style>{`
        .mc-sidebar{ scrollbar-width: none; -ms-overflow-style: none; }
        .mc-sidebar::-webkit-scrollbar{ display: none; width: 0; height: 0; }
      `}</style>
      <aside
        className="mc-sidebar"
        style={{
          width: collapsed ? 80 : 280,
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.backgroundDeep} 100%)`,
          color: colors.text,
          position: 'relative',
          padding: collapsed ? '28px 8px 12px' : '28px 16px 24px',
          boxSizing: 'border-box',
          borderRight: `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.28s ease, padding 0.28s ease',
          fontSize: 13,
        }}
      >
      <button
        type="button"
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        onClick={() => setCollapsed((prev) => !prev)}
        style={{
          position: 'absolute',
          top: 28,
          right: -14,
          zIndex: 9999,
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
          transition: 'transform 0.22s ease',
        }}
      >
        <svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s ease' }}>
          <path d="M8.25 3L4.25 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <BrandMark collapsed={collapsed} />

      <nav style={{ marginTop: 38, display: 'flex', flexDirection: 'column', gap: 14, width: collapsed ? '100%' : 248, alignItems: collapsed ? 'center' : undefined }}>
        <SectionToggle
          icon={<GearIcon />}
          label="Configuración"
          expanded={expandedSections.Configuración}
          onToggle={() => toggleSection('Configuración')}
          collapsed={collapsed}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
            <SubLink icon={<UsersIcon color={colors.iconStrong} />} label="Roles" to="/roles" end collapsed={collapsed} />
          </div>
        </SectionToggle>

        <SectionButton icon={<UsersIcon />} label="Usuarios" to="/users" collapsed={collapsed} />

        <SectionToggle
          icon={<VehicleIcon />}
          label="Servicios"
          expanded={expandedSections.Servicios}
          onToggle={() => toggleSection('Servicios')}
          collapsed={collapsed}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
            <SubLink icon={<VehicleIcon color={colors.iconStrong} />} label="Vehículos" to="/vehicles" end collapsed={collapsed} />
          </div>
        </SectionToggle>

        <SectionToggle
          icon={<ClipboardIcon />}
          label="Ejecución"
          expanded={expandedSections.Operación}
          onToggle={() => toggleSection('Operación')}
          collapsed={collapsed}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
            <SubLink icon={<UsersIcon color={colors.iconStrong} />} label="Clientes" to="/clients" collapsed={collapsed} />
            <SubLink icon={<VehicleIcon color={colors.iconStrong} />} label="Conductores" to="/drivers" end collapsed={collapsed} />
            <SubLink icon={<ClipboardIcon color={colors.iconStrong} />} label="Solicitudes" to="/service-requests" end collapsed={collapsed} />
            <SubLink icon={<ChartIcon color={colors.iconStrong} />} label="Trazabilidad y Control" to="/tracking" end collapsed={collapsed} />
            <SubLink icon={<WarningIcon color={colors.iconStrong} />} label="Novedades" to="/incidents" end collapsed={collapsed} />
          </div>
        </SectionToggle>

        <SectionButton icon={<ChartIcon />} label="Dashboard" to="/dashboard" collapsed={collapsed} />
      </nav>

      <div style={{ marginTop: 'auto', width: collapsed ? '100%' : 248, paddingTop: 24, display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : undefined }}>

        <div style={{ borderTop: collapsed ? 'none' : `1px solid ${colors.borderSoft}`, marginTop: 12, paddingTop: 18, paddingBottom: 8 }}>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12, justifyContent: collapsed ? 'center' : undefined }}>
            <UserAvatar />
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ color: '#dfe9ee', fontSize: 13, lineHeight: 1.2, fontWeight: 600, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                  Administrador
                </div>
                <div style={{ marginTop: 2, color: '#8195a1', fontSize: 10, lineHeight: 1, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Enterprise
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 12, display: 'flex', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 10,
                justifyContent: 'center',
                width: collapsed ? 40 : '100%',
                height: 36,
                borderRadius: 10,
                border: 0,
                background: 'transparent',
                color: colors.text,
                cursor: 'pointer',
                padding: collapsed ? 0 : '0 12px',
              }}
            >
              <IconShell size={18} color={colors.icon}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M16 13v-2H7V8l-5 4 5 4v-3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 3h-7a2 2 0 0 0-2 2v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </IconShell>
              {!collapsed && <span style={{ fontSize: 13, color: colors.textMuted, fontWeight: 600 }}>Cerrar sesión</span>}
            </button>
          </div>
          </div>
        </div>
      </aside>
    </>
  )
}