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

import { useState, useEffect } from 'react';

export default function UserTable({
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
    <div>
      <div className="mc-table-wrap">
        <table className="mc-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="mc-table-empty">
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

                const ultimoAcceso = user.ultimoAcceso
                  ? new Date(user.ultimoAcceso).toLocaleString("es-CO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                  : "Sin registros";

                return (
                  <tr key={user._id}>
                    <td className="mc-cell-entity">
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
                          <div style={{ color: "#1e293b", fontSize: 15, lineHeight: 1.2 }}>
                            {nombreCompleto || "Sin nombre"}
                          </div>
                          <div style={{ color: "#667085", fontSize: 13, lineHeight: 1.2, marginTop: 4 }}>
                            {user.correo || "Sin correo"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="mc-badge" style={{ background: "#f1f5f9", color: "#334155" }}>
                        {nombreRol}
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => onToggleState(user)}
                        title={user.estado ? "Desactivar usuario" : "Activar usuario"}
                        style={{
                          width: "54px",
                          height: "34px",
                          border: "none",
                          borderRadius: "20px",
                          cursor: "pointer",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          padding: "3px",
                          margin: "0 auto",
                          transition: "all 0.25s ease",
                          backgroundColor: user.estado ? "#22c55e" : "#ef4444",
                          boxShadow: user.estado
                            ? "0 3px 10px rgba(34, 197, 94, 0.25)"
                            : "0 3px 10px rgba(239, 68, 68, 0.25)"
                        }}
                      >
                        <span
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            position: "absolute",
                            top: "3px",
                            left: user.estado ? "23px" : "3px",
                            transition: "left 0.25s ease",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.20)"
                          }}
                        />
                        <span
                          style={{
                            width: "100%",
                            textAlign: user.estado ? "left" : "right",
                            padding: user.estado ? "0 0 0 8px" : "0 8px 0 0",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: 700,
                            lineHeight: "28px",
                            userSelect: "none"
                          }}
                        >
                          {user.estado ? "✓" : "✕"}
                        </span>
                      </button>
                    </td>

                    <td>{ultimoAcceso}</td>

                    <td>
                      <div className="mc-actions">
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
      </div>

      {showPagination && (
        <div className="mc-pagination">
          <div className="mc-pagination-info">
            Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, users.length)} de {users.length} usuarios
          </div>
          <div className="mc-pagination-controls">
            <button
              type="button"
              className="mc-pagination-arrow"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`mc-pagination-num${page === currentPage ? ' mc-pagination-num--active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="mc-pagination-arrow"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{ transform: 'rotate(180deg)' }}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 10.5 2.5 6 6 1.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
