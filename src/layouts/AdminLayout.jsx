import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar/Sidebar.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/roles': 'Roles',
  '/users': 'Usuarios',
  '/vehicles': 'Vehículos',
  '/clients': 'Clientes',
  '/drivers': 'Conductores',
  '/service-requests': 'Solicitudes',
  '/tracking': 'Trazabilidad y Control',
  '/incidents': 'Novedades',
}

export default function AdminLayout() {
  const location = useLocation()
  const { logout } = useAuth()
  const menuRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const currentTitle = Object.entries(pageTitles).find(([path]) => location.pathname === path || location.pathname.startsWith(`${path}/`))?.[1] || 'Dashboard'

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
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: '#f3f6fb', color: '#0f172a', overflow: 'hidden' }}>
      <Sidebar />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header
          style={{
            height: 62,
            padding: '0 18px 0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
            boxShadow: '0 6px 16px rgba(15, 23, 42, 0.02)',
            flexShrink: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7a8d9a', fontWeight: 700 }}>
              Mi Conductor
            </div>
            <div style={{ marginTop: 2, fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {currentTitle}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                <span aria-hidden="true" style={{ fontSize: 14 }}>👤</span>
                <span style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>Administrador</span>
                <span aria-hidden="true" style={{ fontSize: 13, color: '#64748b' }}>☰</span>
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 10px)',
                    width: 220,
                    background: '#ffffff',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderRadius: 12,
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
                    overflow: 'hidden',
                    zIndex: 30,
                  }}
                >
                  <div style={{ padding: '12px 14px', color: '#0f172a', fontSize: 14, fontWeight: 600, borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
                    Administrador
                  </div>
                  <div style={{ padding: '12px 14px', color: '#475569', fontSize: 14, fontWeight: 500, borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
                    Enterprise
                  </div>
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
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', height: 'calc(100vh - 62px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
