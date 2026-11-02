import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsuarioService from "../../users/services/usuarioService.js";
import useModalA11y from "../../../hooks/useModalA11y.js";
import PushAlertContainer from "../../../components/common/Toast/PushAlert.jsx";
import { ONLY_DIGITS_REGEX, validateCorreo } from "../../../utils/validators.js";

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

function validateTelefono(val) {
  const trimmed = (val ?? "").toString().trim();
  if (!trimmed) {
    return "El número de teléfono es obligatorio.";
  }
  if (!ONLY_DIGITS_REGEX.test(trimmed)) {
    return "El número de teléfono solo debe contener números (0-9), sin espacios ni caracteres especiales.";
  }
  if (trimmed.length < 7 || trimmed.length > 10) {
    return "El número de teléfono debe tener entre 7 y 10 dígitos.";
  }
  return "";
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

  const [contactForm, setContactForm] = useState({
    correo: "",
    telefono: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    correo: "",
    telefono: "",
  });
  const [savingContact, setSavingContact] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback(({ type = "info", title, message, duration = 4500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const decoded = parseJwt(token);
        const targetId = decoded?.id || decoded?._id || decoded?.sub;

        let currentUser = null;

        if (targetId) {
          try {
            const byIdRes = await UsuarioService.getById(targetId);
            const userObj = byIdRes?.data || byIdRes;
            if (userObj && (userObj._id || userObj.id)) {
              currentUser = userObj;
            }
          } catch (byIdErr) {
            console.error("Error obteniendo perfil por ID:", byIdErr);
          }
        }

        if (!currentUser) {
          const usersRes = await UsuarioService.getAll();
          let usersList = [];
          if (Array.isArray(usersRes)) usersList = usersRes;
          else if (Array.isArray(usersRes?.data)) usersList = usersRes.data;
          else if (Array.isArray(usersRes?.data?.rows)) usersList = usersRes.data.rows;
          else if (Array.isArray(usersRes?.rows)) usersList = usersRes.rows;

          if (targetId) {
            currentUser = usersList.find(
              (u) => String(u._id || u.id) === String(targetId)
            );
          }

          if (!currentUser && decoded?.correo) {
            currentUser = usersList.find(
              (u) => u.correo?.toLowerCase() === decoded.correo?.toLowerCase()
            );
          }
        }

        setProfile(currentUser || null);
        if (currentUser) {
          setContactForm({
            correo: currentUser.correo || "",
            telefono: currentUser.telefono || "",
          });
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        setSaveError("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleCorreoChange = (e) => {
    const val = e.target.value;
    setContactForm((prev) => ({ ...prev, correo: val }));
    if (fieldErrors.correo) {
      setFieldErrors((prev) => ({ ...prev, correo: validateCorreo(val) }));
    }
    if (saveError) setSaveError("");
    if (saveSuccess) setSaveSuccess("");
  };

  const handleTelefonoChange = (e) => {
    const val = e.target.value;
    setContactForm((prev) => ({ ...prev, telefono: val }));
    if (fieldErrors.telefono) {
      setFieldErrors((prev) => ({ ...prev, telefono: validateTelefono(val) }));
    }
    if (saveError) setSaveError("");
    if (saveSuccess) setSaveSuccess("");
  };

  const handleCorreoBlur = () => {
    setFieldErrors((prev) => ({
      ...prev,
      correo: validateCorreo(contactForm.correo),
    }));
  };

  const handleTelefonoBlur = () => {
    setFieldErrors((prev) => ({
      ...prev,
      telefono: validateTelefono(contactForm.telefono),
    }));
  };

  const handleResetContact = () => {
    if (savingContact || !profile) return;
    setContactForm({
      correo: profile.correo || "",
      telefono: profile.telefono || "",
    });
    setFieldErrors({ correo: "", telefono: "" });
    setSaveError("");
    setSaveSuccess("");
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (savingContact) return;

    setSaveError("");
    setSaveSuccess("");

    const correoError = validateCorreo(contactForm.correo);
    const telefonoError = validateTelefono(contactForm.telefono);

    if (correoError || telefonoError) {
      setFieldErrors({
        correo: correoError,
        telefono: telefonoError,
      });
      const firstErr = correoError || telefonoError;
      setSaveError(firstErr);
      addAlert({
        type: "warning",
        title: "Datos no válidos",
        message: firstErr,
      });
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const decoded = parseJwt(token);
    const authenticatedId = decoded?.id || decoded?._id || decoded?.sub;
    const profileId = profile?._id || profile?.id;

    if (!profileId || (authenticatedId && String(authenticatedId) !== String(profileId))) {
      const authErr = "No se pudo verificar la identidad del administrador autenticado.";
      setSaveError(authErr);
      addAlert({
        type: "error",
        title: "Error de autorización",
        message: authErr,
      });
      return;
    }

    const normalizedCorreo = contactForm.correo.trim().toLowerCase();
    const normalizedTelefono = contactForm.telefono.trim();

    setSavingContact(true);
    try {
      const response = await UsuarioService.update(profileId, {
        correo: normalizedCorreo,
        telefono: normalizedTelefono,
      });

      const updatedUser = response?.data || response;
      const confirmedCorreo = updatedUser?.correo ?? normalizedCorreo;
      const confirmedTelefono = updatedUser?.telefono ?? normalizedTelefono;

      setProfile((prev) => ({
        ...prev,
        ...(updatedUser && typeof updatedUser === "object" ? updatedUser : {}),
        correo: confirmedCorreo,
        telefono: confirmedTelefono,
      }));

      setContactForm({
        correo: confirmedCorreo,
        telefono: confirmedTelefono,
      });
      setFieldErrors({ correo: "", telefono: "" });

      const confirmMsg = "Los cambios en el correo electrónico y el teléfono fueron guardados correctamente.";
      setSaveSuccess(confirmMsg);
      addAlert({
        type: "success",
        title: "¡Perfil actualizado!",
        message: confirmMsg,
      });
    } catch (err) {
      console.error("Error actualizando perfil del administrador:", err);
      const status = err?.response?.status;
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Ocurrió un problema al actualizar los datos del perfil. Intente nuevamente.";

      if (status === 409 || backendMsg.toLowerCase().includes("correo")) {
        setFieldErrors((prev) => ({ ...prev, correo: backendMsg }));
      } else if (backendMsg.toLowerCase().includes("teléfono") || backendMsg.toLowerCase().includes("telefono")) {
        setFieldErrors((prev) => ({ ...prev, telefono: backendMsg }));
      }

      setSaveError(backendMsg);
      addAlert({
        type: "error",
        title: "Error al guardar",
        message: backendMsg,
      });
    } finally {
      setSavingContact(false);
    }
  };

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

  const hasUnsavedChanges =
    Boolean(profile) &&
    (contactForm.correo !== (profile.correo || "") ||
      contactForm.telefono !== (profile.telefono || ""));

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
      <PushAlertContainer alerts={alerts} onDismiss={removeAlert} />

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
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
                  wordBreak: "break-all",
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

            {/* Cambio de contraseña */}
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
            </div>
          </div>

          {/* Columna Derecha: Información Personal y Credenciales Integradas */}
          <form
            onSubmit={handleSaveContact}
            noValidate
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
            {/* Mensajes de confirmación o error */}
            {(saveError || saveSuccess) && (
              <div>
                {saveError && (
                  <div
                    role="alert"
                    style={{
                      padding: "11px 16px",
                      borderRadius: 12,
                      background: "#fef2f2",
                      color: "#b91c1c",
                      fontSize: 13,
                      fontWeight: 500,
                      border: "1px solid #fecaca",
                    }}
                  >
                    {saveError}
                  </div>
                )}

                {saveSuccess && (
                  <div
                    role="status"
                    style={{
                      padding: "11px 16px",
                      borderRadius: 12,
                      background: "#f0fdf4",
                      color: "#166534",
                      fontSize: 13,
                      fontWeight: 500,
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    {saveSuccess}
                  </div>
                )}
              </div>
            )}

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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

                {/* Teléfono de Contacto — EDITABLE */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: fieldErrors.telefono ? "1px solid #fca5a5" : "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "12px 16px",
                  }}
                >
                  <label
                    htmlFor="admin-profile-telefono"
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: fieldErrors.telefono ? "#dc2626" : "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 6,
                    }}
                  >
                    Teléfono de Contacto
                  </label>
                  <input
                    id="admin-profile-telefono"
                    name="telefono"
                    type="tel"
                    inputMode="numeric"
                    value={contactForm.telefono}
                    onChange={handleTelefonoChange}
                    onBlur={handleTelefonoBlur}
                    placeholder="Ej. 3001234567"
                    disabled={savingContact}
                    style={{
                      width: "100%",
                      height: 38,
                      borderRadius: 10,
                      border: fieldErrors.telefono
                        ? "1px solid #ef4444"
                        : "1px solid rgba(15, 23, 42, 0.14)",
                      padding: "0 12px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#0f172a",
                      background: "#ffffff",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {fieldErrors.telefono && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "#dc2626", lineHeight: 1.35 }}>
                      {fieldErrors.telefono}
                    </p>
                  )}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-stretch">
                {/* Correo de acceso — EDITABLE */}
                <div
                  style={{
                    background: "#f8fafc",
                    border: fieldErrors.correo ? "1px solid #fca5a5" : "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: "14px 18px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <label
                    htmlFor="admin-profile-correo"
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: fieldErrors.correo ? "#dc2626" : "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 6,
                    }}
                  >
                    Correo Electrónico de Acceso
                  </label>
                  <input
                    id="admin-profile-correo"
                    name="correo"
                    type="email"
                    value={contactForm.correo}
                    onChange={handleCorreoChange}
                    onBlur={handleCorreoBlur}
                    placeholder="correo@ejemplo.com"
                    disabled={savingContact}
                    style={{
                      width: "100%",
                      height: 40,
                      borderRadius: 10,
                      border: fieldErrors.correo
                        ? "1px solid #ef4444"
                        : "1px solid rgba(15, 23, 42, 0.14)",
                      padding: "0 12px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#0f172a",
                      background: "#ffffff",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {fieldErrors.correo && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "#dc2626", lineHeight: 1.35 }}>
                      {fieldErrors.correo}
                    </p>
                  )}
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

            {/* Acciones del formulario de contacto */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
                paddingTop: 14,
                borderTop: "1px solid rgba(15, 23, 42, 0.06)",
                flexWrap: "wrap",
              }}
            >
              {hasUnsavedChanges && (
                <button
                  type="button"
                  onClick={handleResetContact}
                  disabled={savingContact}
                  className="mc-btn-secondary"
                  style={{
                    height: 40,
                    padding: "0 18px",
                    fontSize: 13,
                    borderRadius: 12,
                  }}
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                disabled={savingContact || !profile}
                className="mc-btn-primary"
                style={{
                  height: 40,
                  padding: "0 20px",
                  fontSize: 13,
                  borderRadius: 12,
                }}
              >
                {savingContact ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
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
