import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DeleteActionButton,
  EditActionButton,
  ViewActionButton,
} from '../components/ClientActions.jsx'

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
  success: '#2cc04f',
}

function BreadcrumbArrow() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function SearchIcon({ size = 18, color = '#8b98a8' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="#2b2b2b"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  )
}

function UserPlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M19 8v6" />
      <path d="M22 11h-6" />
    </svg>
  )
}

function UserAvatar({ name, size = 40 }) {
  const initials = name
    ? name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
    : ''

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: '#ffedd5',
        color: '#c2410c',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        lineHeight: 1,
        textTransform: 'uppercase',
      }}
    >
      {initials}
    </div>
  )
}

function MetricCard({ label, value, detail, accent = false }) {
  return (
    <article
      style={{
        minHeight: 134,
        borderRadius: 24,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 22px rgba(21, 42, 53, 0.06)',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          color: '#252525',
          fontSize: 17,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 400,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 10,
          color: colors.text,
          fontSize: 18,
          fontWeight: 400,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: accent ? '#b96a00' : colors.text,
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {accent ? (
          <span style={{ color: '#c97300' }}>
            ↗
          </span>
        ) : null}

        <span style={{ fontSize: 17 }}>
          {detail}
        </span>
      </div>
    </article>
  )
}

function HeaderAction({
  children,
  width = 40,
  height = 40,
  background = colors.surface,
}) {
  return (
    <button
      type="button"
      style={{
        width,
        height,
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        background,
        display: 'grid',
        placeItems: 'center',
        padding: 0,
        color: '#2b2b2b',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function OrangeButton() {
  return (
    <Link
      to="/clients/register"
      style={{
        minWidth: 192,
        height: 44,
        borderRadius: 14,
        background: colors.accent,
        color: '#111111',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '0 18px',
        fontSize: 16,
        fontWeight: 400,
        textDecoration: 'none',
        boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)',
        boxSizing: 'border-box',
      }}
    >
      <UserPlusIcon />
      Registrar Cliente
    </Link>
  )
}

function SearchPill({ value, onChange }) {
  return (
    <div
      style={{
        width: 315,
        height: 66,
        borderRadius: 18,
        background: '#dfeeff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        padding: '0 18px',
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          display: 'inline-flex',
          flexShrink: 0,
        }}
      >
        <SearchIcon />
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o correo..."
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 17,
          lineHeight: 1.15,
          color: '#1f2937',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  )
}

function StatusDot() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: colors.success,
        display: 'inline-block',
      }}
    />
  )
}

export default function ClientsPage({
  clients = [],
  onRequestDelete,
  searchQuery,
  onSearchChange,
  filterType,
  onFilterTypeChange,
  filterDateFrom,
  filterDateTo,
  onFilterDateChange,
  onClearFilters,
  error,
  success
}) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)

  const typeOptions = ['', 'Corporativo', 'Particular']

  const activeFilters = filterType || filterDateFrom || filterDateTo

  return (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        padding: '44px 24px 32px 28px',
        boxSizing: 'border-box',
        background: colors.background,
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 34,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#9b8f81',
              fontSize: 16,
            }}
          >
            <span>Admin</span>

            <span style={{ color: '#bb6a00' }}>
              /
            </span>

            <span>
              Ejecución
            </span>

            <span style={{ color: '#bb6a00', fontWeight: 700 }}>
              / Gestión de Clientes
            </span>
          </div>

          <h1
            style={{
              margin: '8px 0 0',
              fontSize: 22,
              lineHeight: 1.1,
              fontWeight: 400,
              color: '#111111',
              fontFamily: 'Georgia, Times New Roman, serif',
            }}
          >
            Gestión de Clientes
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingTop: 2,
          }}
        >
          <OrangeButton />

          <HeaderAction
            width={40}
            height={44}
            background="#dceafb"
          >
            <BellIcon />
          </HeaderAction>
        </div>
      </header>

      {/* MENSAJES DE ESTADO */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 14,
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            color: "#be123c",
            fontSize: 14,
            margin: "0 28px 24px"
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 14,
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            fontSize: 14,
            margin: "0 28px 24px"
          }}
        >
          {success}
        </div>
      )}

      {/* METRICAS */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 20,
          marginBottom: 34,
        }}
      >
        <MetricCard
          label="Total clientes"
          value={clients.length.toLocaleString()}
          detail="+12% este mes"
          accent
        />

        <MetricCard
          label="Vehículos"
          value="3,592"
          detail="Registrados en total"
        />

        <MetricCard
          label="Servicios mes"
          value="8,421"
          detail="En ejecución"
        />
      </section>

      {/* TABLA */}
      <section
        style={{
          background: colors.surface,
          borderRadius: 28,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)',
          overflow: 'hidden',
        }}
      >
        {/* FILTROS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            padding: '22px 24px 18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* FILTRO TIPO */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown)
                  setShowDateDropdown(false)
                }}
                style={{
                  height: 44,
                  borderRadius: 12,
                  border: 0,
                  background: '#dceafb',
                  padding: '0 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#1f2937',
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                <FilterIcon />

                <span>
                  {filterType || 'Filter By Type'}
                </span>
              </button>

              {showTypeDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 4,
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1px solid rgba(27, 46, 61, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 20,
                    minWidth: 180,
                    overflow: 'hidden',
                  }}
                >
                  {typeOptions.map((opt) => (
                    <button
                      key={opt || 'all'}
                      type="button"
                      onClick={() => {
                        onFilterTypeChange(opt)
                        setShowTypeDropdown(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 18px',
                        border: 'none',
                        background:
                          filterType === opt
                            ? '#dceafb'
                            : 'transparent',
                        color: '#1f2937',
                        fontSize: 15,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'block',
                      }}
                    >
                      {opt || 'Todos'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FILTRO FECHA */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDateDropdown(!showDateDropdown)
                  setShowTypeDropdown(false)
                }}
                style={{
                  height: 44,
                  borderRadius: 12,
                  border: 0,
                  background: '#dceafb',
                  padding: '0 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#1f2937',
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                <CalendarIcon />

                <span>
                  Registration Date
                </span>
              </button>

              {showDateDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 4,
                    background: '#ffffff',
                    borderRadius: 12,
                    border: '1px solid rgba(27, 46, 61, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    zIndex: 20,
                    minWidth: 240,
                    padding: 16,
                  }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 13,
                        color: '#667085',
                        marginBottom: 4,
                      }}
                    >
                      Desde
                    </label>

                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) =>
                        onFilterDateChange(
                          e.target.value,
                          filterDateTo
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border:
                          '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 13,
                        color: '#667085',
                        marginBottom: 4,
                      }}
                    >
                      Hasta
                    </label>

                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) =>
                        onFilterDateChange(
                          filterDateFrom,
                          e.target.value
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border:
                          '1px solid rgba(27, 46, 61, 0.12)',
                        fontSize: 14,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onFilterDateChange('', '')
                        setShowDateDropdown(false)
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        border:
                          '1px solid rgba(27, 46, 61, 0.12)',
                        background: '#fff',
                        color: '#667085',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* LIMPIAR FILTROS */}
            {activeFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                style={{
                  height: 44,
                  borderRadius: 12,
                  border: 0,
                  background: '#fee2e2',
                  padding: '0 18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#991b1b',
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>

          {/* BUSQUEDA */}
          <SearchPill
            value={searchQuery}
            onChange={onSearchChange}
          />

          {/* ACCIONES */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              paddingRight: 6,
            }}
          >
            <button
              type="button"
              aria-label="Descargar"
              style={{
                border: 0,
                background: 'transparent',
                padding: 0,
                color: '#111111',
                cursor: 'pointer',
              }}
            >
              <DownloadIcon />
            </button>

            <button
              type="button"
              aria-label="Imprimir"
              style={{
                border: 0,
                background: 'transparent',
                padding: 0,
                color: '#111111',
                cursor: 'pointer',
              }}
            >
              <PrintIcon />
            </button>
          </div>
        </div>

        {/* CONTENEDOR TABLA */}
        <div
          style={{
            background: '#edf3fa',
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 850,
            }}
          >
            <thead>
              <tr>
                {[
                  'CLIENT NAME',
                  'VEHICLES',
                  'TOTAL SERVICES',
                  'STATUS',
                  'ACTIONS',
                ].map((label) => (
                  <th
                    key={label}
                    style={{
                      padding: '18px 20px',
                      color: '#0d3349',
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',

                      // CLIENT NAME a la izquierda,
                      // los demás centrados
                      textAlign:
                        label === 'CLIENT NAME'
                          ? 'left'
                          : 'center',
                    }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {clients.length > 0 ? (
                clients.map((row, index) => (
                  <tr
                    key={row._id}
                    style={{
                      background:
                        index % 2 === 1
                          ? '#f0f1f3'
                          : '#f8fbff',
                    }}
                  >
                    {/* CLIENTE */}
                    <td
                      style={{
                        padding: '18px 24px',
                        verticalAlign: 'middle',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          justifyContent: 'flex-start',
                          width: '100%',
                        }}
                      >
                        {/* AVATAR A LA IZQUIERDA */}
                        <UserAvatar
                          name={`${row.nombre || ''} ${row.apellido || ''}`}
                          size={50}
                        />

                        {/* INFORMACION */}
                        <div
                          style={{
                            textAlign: 'left',
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              color: '#111111',
                              fontSize: 16,
                              lineHeight: 1.2,
                              fontWeight: 500,
                            }}
                          >
                            {`${row.nombre || ''} ${row.apellido || ''}`}
                          </div>

                          <div
                            style={{
                              color: '#111111',
                              fontSize: 15,
                              lineHeight: 1.2,
                              marginTop: 4,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.correo}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* VEHICULOS */}
                    <td
                      style={{
                        padding: '18px 20px',
                        color: '#111111',
                        fontSize: 16,
                        textAlign: 'center',
                      }}
                    >
                      0
                    </td>

                    {/* SERVICIOS */}
                    <td
                      style={{
                        padding: '18px 20px',
                        color: '#111111',
                        fontSize: 16,
                        textAlign: 'center',
                      }}
                    >
                      0
                    </td>

                    {/* ESTADO */}
                    <td
                      style={{
                        padding: '18px 20px',
                        textAlign: 'center',
                        color: '#111111',
                        fontSize: 16,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <StatusDot />

                        {row.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td
                      style={{
                        padding: '18px 20px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                        }}
                      >
                        <EditActionButton
                          to={`/clients/${row._id}/edit`}
                        />

                        <ViewActionButton
                          to={`/clients/${row._id}`}
                        />

                        <DeleteActionButton
                          onClick={() =>
                            onRequestDelete(row)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      padding: '50px 20px',
                      textAlign: 'center',
                      color: '#667085',
                      fontSize: 16,
                      background: '#f8fbff',
                    }}
                  >
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACION */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '28px 24px 24px',
            background: '#e8f1fb',
          }}
        >
          <div
            style={{
              color: '#111111',
              fontSize: 16,
            }}
          >
            Mostrando 1–10 de 1,284 clientes
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {/* ANTERIOR */}
            <button
              type="button"
              aria-label="Página anterior"
              style={{
                width: 28,
                height: 40,
                borderRadius: 10,
                border:
                  '1px solid rgba(17,17,17,0.08)',
                background: colors.surface,
                color: '#111111',
                display: 'grid',
                placeItems: 'center',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <BreadcrumbArrow
                style={{
                  transform: 'rotate(180deg)',
                }}
              />
            </button>

            {/* PAGINA 1 */}
            <button
              type="button"
              style={{
                width: 38,
                height: 48,
                borderRadius: 10,
                border: 0,
                background: colors.accent,
                color: '#111111',
                fontSize: 18,
                fontWeight: 400,
                cursor: 'pointer',
              }}
            >
              1
            </button>

            {/* PAGINA 2 */}
            <button
              type="button"
              style={{
                width: 38,
                height: 48,
                borderRadius: 10,
                border: 0,
                background: 'transparent',
                color: '#111111',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              2
            </button>

            {/* PAGINA 3 */}
            <button
              type="button"
              style={{
                width: 38,
                height: 48,
                borderRadius: 10,
                border: 0,
                background: 'transparent',
                color: '#111111',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              3
            </button>

            {/* SIGUIENTE */}
            <button
              type="button"
              aria-label="Página siguiente"
              style={{
                width: 28,
                height: 40,
                borderRadius: 10,
                border:
                  '1px solid rgba(17,17,17,0.08)',
                background: colors.surface,
                color: '#111111',
                display: 'grid',
                placeItems: 'center',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <BreadcrumbArrow />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}