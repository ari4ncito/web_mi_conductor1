import { useEffect, useState } from "react";

import axiosInstance from "../../../../services/api/axiosInstance";
import endpoints from "../../../../services/api/endpoints";
import useModalA11y from "../../../../hooks/useModalA11y";
import { NAME_REGEX } from "../../../../utils/validators";

const calcularEdad = (fechaStr) => {
  if (!fechaStr) return "";
  const hoy = new Date();
  const fechaNac = new Date(fechaStr + "T00:00:00");
  if (isNaN(fechaNac.getTime())) return "";
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad >= 0 ? edad : 0;
};

export default function EditUserModal({
  user,
  open,
  onClose,
  onSave,
}) {
  const modalRef = useModalA11y(open, onClose);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    edad: "",
    telefono: "",
    rol: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "nombreCompleto": {
        const trimmed = (value || "").trim();
        if (!trimmed) {
          return "El nombre completo es obligatorio.";
        }
        if (!NAME_REGEX.test(trimmed)) {
          return "Solo se permiten letras, tildes, ñ y espacios.";
        }
        const partes = trimmed.split(/\s+/);
        if (partes.length < 2) {
          return "Ingresa al menos nombre y apellido.";
        }
        if (trimmed.length < 5) {
          return "Debe tener al menos 5 caracteres.";
        }
        return "";
      }

      case "fechaNacimiento": {
        if (!value) return "";
        const fecha = new Date(value + "T00:00:00");
        if (isNaN(fecha.getTime())) return "Fecha no válida.";
        const hoy = new Date();
        if (fecha > hoy) return "La fecha no puede ser futura.";
        const edad = calcularEdad(value);
        if (edad < 18) return "Debe tener al menos 18 años.";
        return "";
      }

      case "telefono": {
        const tel = (value || "").trim();
        if (!tel) return "El teléfono es obligatorio.";
        if (!/^\+?[0-9]{7,15}$/.test(tel)) {
          return "Ingresa un teléfono válido (7 a 15 dígitos numéricos).";
        }
        return "";
      }

      case "rol":
        if (!value) return "Debes seleccionar un rol.";
        return "";

      default:
        return "";
    }
  };

  useEffect(() => {
    if (!open || !user) return;

    cargarRoles();
    setErrors({});
    setTouched({});

    const fechaFormatted = user.fechaNacimiento
      ? new Date(user.fechaNacimiento).toISOString().split("T")[0]
      : "";

    const nombreCompletoInicial =
      user.nombreCompleto ||
      `${user.nombre || ""} ${user.apellido || ""}`.trim();

    setForm({
      nombreCompleto: nombreCompletoInicial,
      fechaNacimiento: fechaFormatted,
      edad:
        user.edad !== undefined && user.edad !== null
          ? user.edad
          : calcularEdad(fechaFormatted),
      telefono: user.telefono || "",
      rol: user.rol?._id || user.rol || "",
    });
  }, [open, user]);

  const cargarRoles = async () => {
    try {
      setLoadingRoles(true);

      const response = await axiosInstance.get(endpoints.roles.getAll);

      let data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      data = data.filter((r) => {
        const nombre = (r.nombre || r.name || r.slug || "").toUpperCase();
        return nombre !== "CLIENTE" && nombre !== "CONDUCTOR";
      });

      setRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
    } finally {
      setLoadingRoles(false);
    }
  };

  if (!open || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let edadCalculada = form.edad;

    if (name === "fechaNacimiento") {
      edadCalculada = calcularEdad(value);
    }

    const updated = {
      ...form,
      [name]: value,
      ...(name === "fechaNacimiento" ? { edad: edadCalculada } : {}),
    };

    setForm(updated);

    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentErrors = {
      nombreCompleto: validateField("nombreCompleto", form.nombreCompleto),
      fechaNacimiento: validateField("fechaNacimiento", form.fechaNacimiento),
      telefono: validateField("telefono", form.telefono),
      rol: validateField("rol", form.rol),
    };

    setErrors(currentErrors);
    setTouched({
      nombreCompleto: true,
      fechaNacimiento: true,
      telefono: true,
      rol: true,
    });

    if (Object.values(currentErrors).some(Boolean)) {
      return;
    }

    const partes = form.nombreCompleto.trim().split(/\s+/);
    const nombre = partes[0] || "";
    const apellido = partes.slice(1).join(" ") || partes[0] || "";

    const usuarioActualizado = {
      ...user,
      nombreCompleto: form.nombreCompleto.trim(),
      nombre,
      apellido,
      fechaNacimiento: form.fechaNacimiento || null,
      edad: form.edad !== "" ? Number(form.edad) : null,
      telefono: form.telefono.trim(),
      rol: form.rol,
    };

    onSave(usuarioActualizado);
  };

  const nombreCompleto =
    form.nombreCompleto || `${user.nombre || ""} ${user.apellido || ""}`.trim();

  const labelStyle = {
    display: "block",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 4,
  };

  const getInputStyle = (fieldName) => {
    const isTouched = touched[fieldName];
    const hasError = errors[fieldName];
    const hasValue = form[fieldName] !== "" && form[fieldName] !== undefined;

    let borderColor = "#cbd5e1";
    let background = "#f8fafc";

    if (isTouched && hasError) {
      borderColor = "#ef4444";
      background = "#fff5f5";
    } else if (isTouched && !hasError && hasValue) {
      borderColor = "#22c55e";
    }

    return {
      width: "100%",
      height: 38,
      borderRadius: 9,
      border: `1px solid ${borderColor}`,
      padding: "0 12px",
      fontSize: 13.5,
      outline: "none",
      background,
      color: "#0f172a",
      boxSizing: "border-box",
      transition: "border-color 0.15s ease, background-color 0.15s ease",
    };
  };

  const renderError = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return (
        <span
          style={{
            display: "block",
            fontSize: 11,
            color: "#dc2626",
            marginTop: 2,
            lineHeight: 1.15,
          }}
        >
          {errors[fieldName]}
        </span>
      );
    }
    return null;
  };

  const readOnlyStyle = {
    width: "100%",
    height: 38,
    borderRadius: 9,
    border: "1px solid #e2e8f0",
    padding: "0 12px",
    fontSize: 13.5,
    background: "#f1f5f9",
    color: "#64748b",
    boxSizing: "border-box",
    cursor: "not-allowed",
  };

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        className="mc-modal"
        style={{
          maxWidth: 720,
          width: "100%",
          maxHeight: "none",
          borderRadius: 20,
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        <div
          style={{
            padding: "13px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div>
            <h2
              id="modal-title"
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#11384a",
                fontFamily: 'Georgia, "Times New Roman", serif',
                lineHeight: 1.2,
              }}
            >
              Editar usuario
            </h2>
            <span style={{ fontSize: 12.5, color: "#64748b" }}>
              {nombreCompleto || "Usuario"}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="mc-modal-close"
            style={{
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            padding: "15px 26px 18px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            overflow: "hidden",
            overflowY: "hidden",
          }}
        >
          {/* Identificadores fijos / protegidos */}
          <div
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              background: "#f8fafc",
              border: "1px dashed #cbd5e1",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11.5,
              color: "#475569",
            }}
          >
            <span>🔒</span>
            <span>
              <strong>Identificadores protegidos:</strong> El documento y correo electrónico no pueden modificarse para preservar la integridad de la cuenta.
            </span>
          </div>

          {/* Fila 1: Tipo Documento y Documento (Protegidos) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Tipo de documento <span style={{ fontSize: 11, color: "#64748b" }}>(Protegido)</span>
              </label>
              <input
                type="text"
                readOnly
                value={user.tipoDocumento || "Cédula de ciudadanía"}
                style={readOnlyStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Documento <span style={{ fontSize: 11, color: "#64748b" }}>(Protegido)</span>
              </label>
              <input
                type="text"
                readOnly
                value={user.documento || "No registrado"}
                style={readOnlyStyle}
              />
            </div>
          </div>

          {/* Fila 2: Nombre completo y Correo (Protegido) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Nombre completo <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <input
                name="nombreCompleto"
                value={form.nombreCompleto}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Ej. Juan Pérez Gómez"
                style={getInputStyle("nombreCompleto")}
              />
              {renderError("nombreCompleto")}
            </div>

            <div>
              <label style={labelStyle}>
                Correo electrónico <span style={{ fontSize: 11, color: "#64748b" }}>(Protegido)</span>
              </label>
              <input
                type="text"
                readOnly
                value={user.correo || ""}
                style={readOnlyStyle}
              />
            </div>
          </div>

          {/* Fila 3: Fecha de nacimiento y Edad */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 18px",
            }}
          >
            <div>
              <label style={labelStyle}>Fecha de nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date().toISOString().split("T")[0]}
                style={getInputStyle("fechaNacimiento")}
              />
              {renderError("fechaNacimiento")}
            </div>

            <div>
              <label style={labelStyle}>Edad</label>
              <input
                type="text"
                name="edad"
                value={form.edad !== "" ? `${form.edad} años` : ""}
                readOnly
                placeholder="Se calcula automáticamente"
                style={{
                  ...getInputStyle("edad"),
                  background: "#f1f5f9",
                  color: "#475569",
                  cursor: "default",
                }}
              />
            </div>
          </div>

          {/* Fila 4: Teléfono y Rol */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Teléfono <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Ej. 3001234567"
                style={getInputStyle("telefono")}
              />
              {renderError("telefono")}
            </div>

            <div>
              <label style={labelStyle}>
                Rol <span style={{ color: "#e11d48" }}>*</span>
              </label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loadingRoles}
                required
                style={getInputStyle("rol")}
              >
                {loadingRoles ? (
                  <option value="">Cargando roles...</option>
                ) : roles.length === 0 ? (
                  <option value="">No hay roles disponibles</option>
                ) : (
                  roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.nombre || role.name || role.slug}
                    </option>
                  ))
                )}
              </select>
              {renderError("rol")}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 2,
              paddingTop: 10,
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="mc-btn-secondary"
              style={{
                height: 38,
                padding: "0 20px",
                fontSize: 13.5,
                borderRadius: 9,
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="mc-btn-primary"
              style={{
                height: 40,
                padding: "0 22px",
                fontSize: 13.5,
                borderRadius: 12,
                background: "#0e3b43",
                color: "#ffffff",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(14, 59, 67, 0.3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Guardar cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
