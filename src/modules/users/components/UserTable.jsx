function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 20h4.5l10-10-4.5-4.5-10 10V20Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M13.5 5.5 18 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 7h16M9 7V5.5h6V7M8 7l.8 12h6.4L16 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

import { useState, useEffect, memo } from 'react';

const UserTable = memo(function UserTable({
  users,
  onViewDetails,
  onEditUser,
  onDeleteUser,
  onToggleState
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(users.length / pageSize);

  const showPagination = users.length > 0;

  return (
    <div style={{ overflowX: 'auto', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
      <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Usuario
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Correo
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Rol
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Estado
            </th>
            <th style={{ padding: '12px 18px', fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '40px 18px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                No existen usuarios registrados.
              </td>
            </tr>
          ) : (
            paginatedUsers.map((user) => {
              const nombreCompleto =
                `${user.nombre || ""} ${user.apellido || ""}`.trim();

              const initials = nombreCompleto
                ? nombreCompleto
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                : "U";

              const nombreRol =
                user.rol?.nombre ||
                user.rol?.name ||
                user.rol ||
                "Sin rol";

              return (
                <tr
                  key={user._id}
                  style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
                >
                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #fb923c, #ea580c)",
                          color: "#ffffff",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          textTransform: "uppercase",
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </div>

                      <div style={{ textAlign: "left" }}>
                        <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                          {nombreCompleto || "Sin nombre"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', color: '#334155', fontSize: 13.5, fontWeight: 500 }}>
                    {user.correo || "Sin correo"}
                  </td>

                  <td style={{ padding: '12px 18px', verticalAlign: 'middle' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 8,
                        background: '#f1f5f9',
                        color: '#334155',
                        fontSize: 12,
                        fontWeight: 700,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {nombreRol}
                    </span>
                  </td>

                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    {(() => {
                      // Check if this row is the currently logged-in user
                      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                      let isCurrentLoggedUser = false;
                      try {
                        if (token) {
                          const base64Url = token.split(".")[1];
                          if (base64Url) {
                            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                            const decoded = JSON.parse(decodeURIComponent(atob(base64).split("").map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
                            const currentId = decoded?.id || decoded?._id || decoded?.sub;
                            if (currentId && (user._id === currentId || user.id === currentId)) {
                              isCurrentLoggedUser = true;
                            } else if (decoded?.correo && user.correo && decoded.correo.toLowerCase() === user.correo.toLowerCase()) {
                              isCurrentLoggedUser = true;
                            }
                          }
                        }
                      } catch (e) {
                        // ignore parse errors
                      }

                      if (isCurrentLoggedUser) {
                        return (
                          <div
                            title="No puedes desactivar la cuenta con la que has iniciado sesión actualmente"
                            style={{
                              cursor: 'not-allowed',
                              width: '38px',
                              height: '22px',
                              borderRadius: '12px',
                              position: 'relative',
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '2px',
                              backgroundColor: '#86efac',
                              opacity: 0.7,
                              margin: '0 auto',
                            }}
                          >
                            <span
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                position: 'absolute',
                                top: '2px',
                                left: '18px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                              }}
                            />
                          </div>
                        );
                      }

                      return (
                        <div
                          title={user.estado ? 'Activo - Clic para desactivar' : 'Inactivo - Clic para activar'}
                          onClick={() => onToggleState(user)}
                          style={{
                            cursor: 'pointer',
                            width: '38px',
                            height: '22px',
                            borderRadius: '12px',
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px',
                            backgroundColor: user.estado ? '#22c55e' : '#cbd5e1',
                            transition: 'background-color 0.2s ease',
                            margin: '0 auto',
                          }}
                        >
                          <span
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: '#ffffff',
                              position: 'absolute',
                              top: '2px',
                              left: user.estado ? '18px' : '2px',
                              transition: 'left 0.2s ease',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                            }}
                          />
                        </div>
                      );
                    })()}
                  </td>

                  <td style={{ padding: '12px 18px', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                      <button type="button" className="mc-icon-btn" title="Ver detalle" onClick={() => onViewDetails(user)}>
                        <EyeIcon />
                      </button>
                      <button type="button" className="mc-icon-btn" title="Editar" onClick={() => onEditUser(user)}>
                        <PencilIcon />
                      </button>
                      <button type="button" className="mc-icon-btn mc-icon-btn--danger" title="Eliminar" onClick={() => onDeleteUser(user)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {showPagination && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 18px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ color: '#64748b', fontSize: 12.5, fontWeight: 500 }}>
            Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, users.length)} de {users.length} usuarios
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: currentPage === 1 ? '#cbd5e1' : '#475569',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              aria-label="Página anterior"
            >
              <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                style={{
                  minWidth: 28,
                  height: 28,
                  padding: '0 6px',
                  borderRadius: 6,
                  border: page === currentPage ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  background: page === currentPage ? '#0f172a' : '#ffffff',
                  color: page === currentPage ? '#ffffff' : '#475569',
                  fontSize: 12,
                  fontWeight: page === currentPage ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: (currentPage === totalPages || totalPages === 0) ? '#cbd5e1' : '#475569',
                cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                transform: 'rotate(180deg)',
              }}
              aria-label="Página siguiente"
            >
              <svg width="6" height="10" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default UserTable;
