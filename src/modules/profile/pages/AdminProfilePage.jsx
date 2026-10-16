import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsuarioService from "../../users/services/usuarioService.js";
import useModalA11y from "../../../hooks/useModalA11y.js";

// Helper to decode JWT payload safely
function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
}

// Modal for changing administrator password
function ChangePasswordModal({ open, onClose, userId, userEmail }) {
  const modalRef = useModalA11y(open, onClose);
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await UsuarioService.update(userId, {
        password: form.newPassword,
      });

      setSuccess("¡Contraseña actualizada exitosamente!");
      setTimeout(() => {
        setForm({ newPassword: "", confirmPassword: "" });
        setSuccess("");
        onClose();
      }, 1400);
    } catch (err) {
      console.error("Error actualizando contraseña:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "No se pudo actualizar la contraseña. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        className="mc-modal mc-modal--sm"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="mc-modal-header">
          <div>
            <p className="mc-modal-subtitle">Seguridad</p>
            <h2 className="mc-modal-title" style={{ fontSize: 22, marginTop: 4 }}>
              Cambiar Contraseña
            </h2>
            <p className="mc-modal-desc" style={{ marginTop: 4, fontSize: 13 }}>
              Actualice la clave de acceso de <strong>{userEmail}</strong>
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="mc-modal-close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <div className="mc-modal-body" style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 13, border: "1px solid #fecaca" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "#f0fdf4", color: "#166534", fontSize: 13, border: "1px solid #bbf7d0" }}>
                {success}
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Nueva Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  style={{
                    width: "100%",
                    height: 42,
                    borderRadius: 12,
                    border: "1px solid rgba(17, 17, 17, 0.12)",
                    padding: "0 40px 0 14px",
                    fontSize: 14,
                    background: "#f8fafc",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#64748b",
                    padding: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Confirmar Nueva Contraseña
              </label>
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Repita la contraseña"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                style={{
                  width: "100%",
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.12)",
                  padding: "0 14px",
                  fontSize: 14,
                  background: "#f8fafc",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div className="mc-modal-footer" style={{ padding: "16px 28px" }}>
            <button type="button" onClick={onClose} className="mc-btn-secondary" style={{ height: 40, padding: "0 18px", fontSize: 13 }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="mc-btn-primary" style={{ height: 40, padding: "0 20px", fontSize: 13 }}>
              {loading ? "Actualizando..." : "Guardar Contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const decoded = parseJwt(token);

        const usersRes = await UsuarioService.getAll();
        let usersList = [];
        if (Array.isArray(usersRes)) usersList = usersRes;
        else if (Array.isArray(usersRes?.data)) usersList = usersRes.data;
        else if (Array.isArray(usersRes?.data?.rows)) usersList = usersRes.data.rows;
        else if (Array.isArray(usersRes?.rows)) usersList = usersRes.rows;

        let currentUser = null;
        if (decoded?.id || decoded?._id || decoded?.sub) {
          const targetId = decoded.id || decoded._id || decoded.sub;
          currentUser = usersList.find((u) => u._id === targetId || u.id === targetId);
        }

        if (!currentUser && decoded?.correo) {
          currentUser = usersList.find(
            (u) => u.correo?.toLowerCase() === decoded.correo?.toLowerCase()
          );
        }

        if (!currentUser) {
          currentUser = usersList.find((u) => {
            const roleName =
              u.rol?.nombre || u.rol?.name || u.role || (typeof u.rol === "string" ? u.rol : "");
            return roleName.toUpperCase().includes("ADMIN");
          });
        }

        if (!currentUser && usersList.length > 0) {
          currentUser = usersList[0];
        }

        setProfile(currentUser || null);
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const fullName = profile
    ? `${profile.nombre || ""} ${profile.apellido || ""}`.trim() || "Administrador"
    : "Administrador";

  const initials = profile
    ? `${profile.nombre?.[0] || ""}${profile.apellido?.[0] || ""}`.toUpperCase() || "AD"
    : "AD";

  const roleName =
    profile?.rol?.nombre ||
    profile?.rol?.name ||
    (typeof profile?.rol === "string" ? profile?.rol : "Administrador");

  return (
    <div
      className="p-3 sm:p-5 lg:p-[16px_22px_20px]"
      style={{
        minHeight: "100%",
        boxSizing: "border-box",
        background: "#f4f7fb",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Top action bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mc-btn-secondary"
          style={{
            height: 38,
            padding: "0 16px",
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 12,
            gap: 6,
            boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Volver al Dashboard</span>
        </button>

        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#f97316",
            background: "rgba(249, 115, 22, 0.1)",
            padding: "5px 12px",
            borderRadius: 20,
          }}
        >
          Cuenta Principal
        </span>
      </div>

      {loading ? (
        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: 36,
            textAlign: "center",
            border: "1px solid rgba(17, 17, 17, 0.08)",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "3px solid #ff9a2f",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
              marginBottom: 12,
            }}
          />
          <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500, margin: 0 }}>
            Cargando perfil del administrador...
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch"
        >
          {/* Columna Izquierda: Identidad Hero Compacta */}
          <div
            className="lg:col-span-4 xl:col-span-3"
            style={{
              background: "#ffffff",
              borderRadius: 20,
              padding: "20px 18px",
              border: "1px solid rgba(17, 17, 17, 0.08)",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #fb923c, #ea580c)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  boxShadow: "0 8px 20px rgba(234, 88, 12, 0.25)",
                  marginBottom: 12,
                }}
              >
                {initials}
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.2,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}
              >
                {fullName}
              </h1>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                {profile?.correo || "Sin correo"}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 10,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 10px",
                    borderRadius: 16,
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#e0f2fe",
                    color: "#0369a1",
                    border: "1px solid #bae6fd",
                  }}
                >
                  {roleName}
                </span>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px",
                    borderRadius: 16,
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#dcfce7",
                    color: "#15803d",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22c55e",
                    }}
                  />
                  Activo
                </span>
              </div>
            </div>

            {/* Accesos directos y cambio de contraseña */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              <button
                type="button"
                onClick={() => setPasswordModalOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  height: 40,
                  borderRadius: 12,
                  background: "#ff9a2f",
                  color: "#ffffff",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(255, 154, 47, 0.28)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#ea580c")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#ff9a2f")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5-1.5 1.5 1.5 1.5-4 4-2-2L2 17l5 5 4.5-4.5-2-2 4-4 1.5 1.5 1.5-1.5L15 10l3.5-3.5L21 2z" />
                </svg>
                <span>Cambiar Contraseña</span>
              </button>

              <Link
                to="/users"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: 12,
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontSize: 12.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(15, 23, 42, 0.06)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Gestión de Usuarios</span>
                </span>
                <span style={{ color: "#94a3b8" }}>→</span>
              </Link>

              <Link
                to="/roles"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: 12,
                  background: "#f8fafc",
                  color: "#0f172a",
                  fontSize: 12.5,
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid rgba(15, 23, 42, 0.06)",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Roles y Permisos</span>
                </span>
                <span style={{ color: "#94a3b8" }}>→</span>
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Información Personal y Credenciales Integradas */}
          <div
            className="lg:col-span-8 xl:col-span-9 p-4 sm:p-6 md:p-7"
            style={{
              background: "#ffffff",
              borderRadius: 20,
              border: "1px solid rgba(17, 17, 17, 0.08)",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 20,
              minHeight: 0,
            }}
          >
            {/* Sección 1: Información Personal y de Identificación */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: "rgba(255, 154, 47, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ea580c",
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                      Información Personal y de Contacto
                    </h3>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                      Datos registrados del titular de la cuenta administrativa
                    </p>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#0369a1",
                    background: "#e0f2fe",
                    padding: "4px 10px",
                    borderRadius: 20,
                  }}
                >
                  Perfil Activo
                </span>
              </div>

              {/* Grid de 6 campos estilizados en tarjetas individuales */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
              >
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Nombre
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>
                    {profile?.nombre || "—"}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Apellido
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>
                    {profile?.apellido || "—"}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Tipo de Documento
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>
                    {profile?.tipoDocumento || "CC"}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Número de Documento
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>
                    {profile?.documento || "—"}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Teléfono de Contacto
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>
                    {profile?.telefono || "—"}
                  </div>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Plataforma / Módulo
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>
                    Mi Conductor Web
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Credenciales, Estado y Seguridad del Sistema */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "rgba(1, 37, 56, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#012538",
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                    Seguridad y Parámetros de Sesión
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                    Credenciales autorizadas y privilegios de acceso
                  </p>
                </div>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch"
              >
                {/* Correo de acceso */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "14px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    Correo Electrónico de Acceso
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", wordBreak: "break-all" }}>
                    {profile?.correo || "—"}
                  </div>
                </div>

                {/* Banner de seguridad */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 18px",
                    borderRadius: 14,
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#dcfce7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#166534",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
                      Sesión Autenticada y Protegida
                    </div>
                    <div style={{ fontSize: 11.5, color: "#15803d", marginTop: 2 }}>
                      Cuenta administrativa activa con cifrado de tokens JWT y privilegios completos del sistema.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cambiar contraseña */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        userId={profile?._id || profile?.id}
        userEmail={profile?.correo}
      />
    </div>
  );
}
