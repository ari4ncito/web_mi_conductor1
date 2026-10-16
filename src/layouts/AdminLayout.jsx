import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar/Sidebar.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/profile': 'Perfil del Administrador',
  '/roles': 'Roles',
  '/users': 'Usuarios',
  '/vehicles': 'Vehículos',
  '/clients': 'Clientes',
  '/drivers': 'Conductores',
  '/service-requests': 'Solicitudes',
  '/tracking': 'Trazabilidad y Control',
  '/incidents': 'Novedades',
}

const Topbar = React.memo(function Topbar({ currentTitle, logout, onToggleSidebar, isSidebarCollapsed }) {
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
  }

  return (
        <header
          className="px-4 lg:px-[18px]"
          style={{
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
            boxShadow: '0 6px 16px rgba(15, 23, 42, 0.02)',
            flexShrink: 0,
            gap: 12,
            transition: 'padding-left 0.25s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              minWidth: 0,
              paddingLeft: isSidebarCollapsed ? 34 : 0,
              transition: 'padding-left 0.25s ease',
            }}
          >
            {/* Botón hamburguesa solo para móvil y tablet */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden flex items-center justify-center"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background: '#f8fafc',
                color: '#0f172a',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
              }}
              aria-label="Abrir navegación"
              title="Menú"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', fontWeight: 700 }}>
                Mi Conductor
              </div>
              <div className="text-[17px] lg:text-[18px]" style={{ marginTop: 2, fontWeight: 700, color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentTitle}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                background: '#f8fafc',
                display: 'grid',
                placeItems: 'center',
                padding: 0,
                color: '#0f172a',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(15, 23, 42, 0.04)',
              }}
              title="Notificaciones"
              aria-label="Notificaciones"
            >
              <BellIcon />
            </button>

            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#f8fafc',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  borderRadius: 12,
                  padding: '7px 12px',
                  color: '#0f172a',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(15, 23, 42, 0.04)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="hidden sm:inline" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>Administrador</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 10px)',
                    width: 200,
                    background: '#ffffff',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: 12,
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
                    overflow: 'hidden',
                    zIndex: 30,
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 14px',
                      color: '#0f172a',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Mi Perfil</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      border: 0,
                      background: 'transparent',
                      color: '#dc2626',
                      textAlign: 'left',
                      padding: '12px 14px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#dc2626' }}>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
  )
})

export default function AdminLayout() {
  const location = useLocation()
  const { logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const currentTitle = Object.entries(pageTitles).find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[1] || 'Dashboard'

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: '#f3f6fb', color: '#0f172a', overflow: 'hidden' }}>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
      />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar
          currentTitle={currentTitle}
          logout={logout}
          onToggleSidebar={() => setMobileMenuOpen((prev) => !prev)}
          isSidebarCollapsed={sidebarCollapsed}
        />

        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 62px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
