import { useEffect, useState, useRef, useCallback } from "react";

import RoleService from "../../../roles/services/roleService";
import UsuarioService from "../../services/usuarioService";
import AuthService from "../../../auth/services/authService";
import useModalA11y from "../../../../hooks/useModalA11y";
import {
  NAME_REGEX,
  validateDocumento,
  validateCorreo,
} from "../../../../utils/validators";

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

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}) {
  const modalRef = useModalA11y(open, onClose);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const [form, setForm] = useState({
    tipoDocumento: "CC",
    documento: "",
    nombreCompleto: "",
    fechaNacimiento: "",
    edad: "",
    correo: "",
    telefono: "",
    rol: "",
    estado: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [validatingDoc, setValidatingDoc] = useState(false);
  const [docAvailable, setDocAvailable] = useState(null);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const docAbortRef = useRef(null);
  const emailAbortRef = useRef(null);

  // Validación de campos individuales
  const validateField = useCallback((name, value, currentForm = form) => {
    switch (name) {
      case "tipoDocumento":
        if (!value) return "Selecciona un tipo de documento.";
        return "";

      case "documento": {
        const docErr = validateDocumento(value, currentForm.tipoDocumento);
        return docErr || "";
      }

      case "nombreCompleto": {
        const trimmed = (value || "").trim();
        if (!trimmed) {
          return "El nombre completo es obligatorio.";
        }
        if (!NAME_REGEX.test(trimmed)) {
          return "Solo se permiten letras, tildes, ñ, espacios, guiones y apóstrofes.";
        }
        const partes = trimmed.split(/\s+/).filter(Boolean);
        if (partes.length < 2) {
          return "Ingresa al menos un nombre y un apellido.";
        }
        if (trimmed.length < 4) {
          return "Debe tener al menos 4 caracteres.";
        }
        if (trimmed.length > 100) {
          return "No puede superar los 100 caracteres.";
        }
        return "";
      }

      case "fechaNacimiento": {
        if (!value) {
          return "La fecha de nacimiento es obligatoria.";
        }
        const fecha = new Date(value + "T00:00:00");
        if (isNaN(fecha.getTime())) {
          return "Fecha no válida.";
        }
        const hoy = new Date();
        if (fecha > hoy) {
          return "La fecha no puede ser futura.";
        }
        const edad = calcularEdad(value);
        if (edad < 18) {
          return "El usuario debe ser mayor de edad (mínimo 18 años).";
        }
        if (edad > 115) {
          return "Ingresa una fecha de nacimiento válida.";
        }
        return "";
      }

      case "correo":
        return validateCorreo(value) || "";

      case "telefono": {
        const tel = (value || "").trim();
        if (!tel) {
          return "El teléfono es obligatorio.";
        }
        if (!/^\+?[0-9]{7,15}$/.test(tel)) {
          return "Ingresa un teléfono válido (entre 7 y 15 dígitos).";
        }
        return "";
      }

      case "rol":
        if (!value) return "Debes seleccionar un rol.";
        return "";

      default:
        return "";
    }
  }, [form]);

  // Verificación anticipada de documento en backend
  const checkDocumentInBackend = useCallback(async (doc, tipoDoc) => {
    if (!doc || validateDocumento(doc, tipoDoc)) {
      setDocAvailable(null);
      return;
    }

    if (docAbortRef.current) {
      docAbortRef.current.abort();
    }
    const controller = new AbortController();
    docAbortRef.current = controller;

    try {
      setValidatingDoc(true);
      const res = await AuthService.checkDocument(doc, controller.signal, tipoDoc);
      const data = res?.data || res;
      if (data?.exists) {
        setErrors((prev) => ({
          ...prev,
          documento: "Este número de documento ya está registrado en el sistema.",
        }));
        setDocAvailable(false);
      } else {
        setDocAvailable(true);
        setErrors((prev) => {
          if (prev.documento === "Este número de documento ya está registrado en el sistema.") {
            const { documento: _, ...rest } = prev;
            return rest;
          }
          return prev;
        });
      }
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.warn("Error en verificación anticipada de documento:", err);
      }
    } finally {
      setValidatingDoc(false);
    }
  }, []);

  // Verificación anticipada de correo en backend
  const checkEmailInBackend = useCallback(async (correoVal) => {
    if (!correoVal || validateCorreo(correoVal)) {
      setEmailAvailable(null);
      return;
    }

    if (emailAbortRef.current) {
      emailAbortRef.current.abort();
    }
    const controller = new AbortController();
    emailAbortRef.current = controller;

    try {
      setValidatingEmail(true);
      const res = await AuthService.checkEmail(correoVal, controller.signal);
      const data = res?.data || res;
      if (data?.exists) {
        setErrors((prev) => ({
          ...prev,
          correo: "Este correo electrónico ya se encuentra registrado.",
        }));
        setEmailAvailable(false);
      } else {
        setEmailAvailable(true);
        setErrors((prev) => {
          if (prev.correo === "Este correo electrónico ya se encuentra registrado.") {
            const { correo: _, ...rest } = prev;
            return rest;
          }
          return prev;
        });
      }
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.warn("Error en verificación anticipada de correo:", err);
      }
    } finally {
      setValidatingEmail(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    setServerError("");
    setErrors({});
    setTouched({});
    setDocAvailable(null);
    setEmailAvailable(null);

    const cargarRoles = async () => {
      try {
        setLoadingRoles(true);
        const response = await RoleService.getAll();

        let availableRoles = [];
        if (Array.isArray(response)) {
          availableRoles = response;
        } else if (Array.isArray(response?.data)) {
          availableRoles = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          availableRoles = response.data.data;
        }

        availableRoles = availableRoles.filter((r) => {
          const nombre = (r.nombre || r.name || r.slug || "").toUpperCase();
          return nombre !== "CLIENTE" && nombre !== "CONDUCTOR";
        });

        setRoles(availableRoles);

        const initialRol = availableRoles[0]?._id || "";
        setForm({
          tipoDocumento: "CC",
          documento: "",
          nombreCompleto: "",
          fechaNacimiento: "",
          edad: "",
          correo: "",
          telefono: "",
          rol: initialRol,
          estado: true,
        });
      } catch (error) {
        console.error("Error al cargar roles:", error);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    cargarRoles();
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let edadCalculada = form.edad;

    if (name === "fechaNacimiento") {
      edadCalculada = calcularEdad(value);
    }

    const updatedForm = {
      ...form,
      [name]: value,
      ...(name === "fechaNacimiento" ? { edad: edadCalculada } : {}),
    };

    setForm(updatedForm);

    // Validación síncrona
    const fieldError = validateField(name, value, updatedForm);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
      ...(name === "tipoDocumento" && form.documento
        ? { documento: validateField("documento", form.documento, updatedForm) }
        : {}),
    }));

    // Verificación asíncrona de duplicados en documento
    if (name === "documento" || (name === "tipoDocumento" && form.documento)) {
      const docToVerify = name === "documento" ? value : form.documento;
      const tipoToVerify = name === "tipoDocumento" ? value : form.tipoDocumento;
      if (!fieldError) {
        checkDocumentInBackend(docToVerify, tipoToVerify);
      } else {
        setDocAvailable(null);
      }
    }

    // Verificación asíncrona de duplicados en correo
    if (name === "correo") {
      if (!fieldError) {
        checkEmailInBackend(value);
      } else {
        setEmailAvailable(null);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value, form);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const currentErrors = {
      tipoDocumento: validateField("tipoDocumento", form.tipoDocumento),
      documento: validateField("documento", form.documento),
      nombreCompleto: validateField("nombreCompleto", form.nombreCompleto),
      fechaNacimiento: validateField("fechaNacimiento", form.fechaNacimiento),
      correo: validateField("correo", form.correo),
      telefono: validateField("telefono", form.telefono),
      rol: validateField("rol", form.rol),
    };

    if (errors.documento) {
      currentErrors.documento = errors.documento;
    }
    if (errors.correo) {
      currentErrors.correo = errors.correo;
    }

    setErrors(currentErrors);
    setTouched({
      tipoDocumento: true,
      documento: true,
      nombreCompleto: true,
      fechaNacimiento: true,
      correo: true,
      telefono: true,
      rol: true,
    });

    const hasErrors = Object.values(currentErrors).some(Boolean);
    if (hasErrors) {
      return;
    }

    setSubmitting(true);

    try {
      const partes = form.nombreCompleto.trim().split(/\s+/).filter(Boolean);
      const nombre = partes[0] || "";
      const apellido = partes.slice(1).join(" ") || partes[0] || "";

      // El usuario se crea sin contraseña establecida por el administrador.
      // El backend genera un token de activación y envía el correo con el enlace.
      const payload = {
        nombreCompleto: form.nombreCompleto.trim(),
        nombre,
        apellido,
        tipoDocumento: form.tipoDocumento,
        documento: form.documento.trim(),
        fechaNacimiento: form.fechaNacimiento || undefined,
        edad: form.edad !== "" ? Number(form.edad) : undefined,
        correo: form.correo.trim().toLowerCase(),
        telefono: form.telefono.trim(),
        rol: form.rol,
        estado: true,
      };

      console.log("Enviando usuario al backend para activación por correo:", payload);

      await UsuarioService.create(payload);

      await onCreated({
        success: true,
        nombre: form.nombreCompleto,
        correo: form.correo,
      });

      onClose();
    } catch (error) {
      console.error("Error al crear usuario en backend:", error);
      const backendMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al crear el usuario. Por favor verifica los datos ingresados.";
      setServerError(backendMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = {
    display: "block",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 4,
  };

  const requiredAsterisk = (
    <span style={{ color: "#ef4444", marginLeft: 3 }} title="Campo obligatorio">
      *
    </span>
  );

  const getInputStyle = (fieldName) => {
    const isTouched = touched[fieldName];
    const hasError = errors[fieldName];
    const hasValue = form[fieldName] !== "" && form[fieldName] !== undefined;

    let borderColor = "#cbd5e1";
    let background = "#f8fafc";

    if (isTouched && hasError) {
      borderColor = "#ef4444";
      background = "#fff5f5";
    } else if (
      (isTouched && !hasError && hasValue) ||
      (fieldName === "documento" && docAvailable === true) ||
      (fieldName === "correo" && emailAvailable === true)
    ) {
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

  const renderFeedback = (fieldName) => {
    if (fieldName === "documento" && validatingDoc) {
      return (
        <span style={{ display: "block", fontSize: 11, color: "#64748b", marginTop: 2 }}>
          Verificando documento...
        </span>
      );
    }
    if (fieldName === "documento" && docAvailable === true && !errors.documento) {
      return (
        <span style={{ display: "block", fontSize: 11, color: "#16a34a", marginTop: 2 }}>
          ✓ Documento disponible
        </span>
      );
    }

    if (fieldName === "correo" && validatingEmail) {
      return (
        <span style={{ display: "block", fontSize: 11, color: "#64748b", marginTop: 2 }}>
          Verificando correo...
        </span>
      );
    }
    if (fieldName === "correo" && emailAvailable === true && !errors.correo) {
      return (
        <span style={{ display: "block", fontSize: 11, color: "#16a34a", marginTop: 2 }}>
          ✓ Correo disponible
        </span>
      );
    }

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

  return (
    <div className="mc-modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="mc-modal"
        style={{
          maxWidth: 720,
          width: "100%",
          maxHeight: "none",
          borderRadius: 20,
          overflow: "hidden",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Encabezado sin subtítulo */}
        <div
          style={{
            padding: "13px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
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
            Crear usuario
          </h2>

          <button
            type="button"
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
          {serverError && (
            <div
              style={{
                padding: "8px 14px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                color: "#dc2626",
                fontSize: 12.5,
                lineHeight: 1.35,
              }}
            >
              {serverError}
            </div>
          )}

          {/* Fila 1: Tipo de documento y Documento */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Tipo de documento {requiredAsterisk}
              </label>
              <select
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("tipoDocumento")}
              >
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="PAS">Pasaporte</option>
              </select>
              {renderFeedback("tipoDocumento")}
            </div>

            <div>
              <label style={labelStyle}>
                Documento {requiredAsterisk}
              </label>
              <input
                required
                name="documento"
                placeholder="Número de documento"
                value={form.documento}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("documento")}
              />
              {renderFeedback("documento")}
            </div>
          </div>

          {/* Fila 2: Nombre completo y Correo electrónico */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Nombre completo {requiredAsterisk}
              </label>
              <input
                required
                name="nombreCompleto"
                placeholder="Ej. Juan Carlos Pérez Gómez"
                value={form.nombreCompleto}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("nombreCompleto")}
              />
              {renderFeedback("nombreCompleto")}
            </div>

            <div>
              <label style={labelStyle}>
                Correo electrónico {requiredAsterisk}
              </label>
              <input
                required
                type="email"
                name="correo"
                placeholder="correo@ejemplo.com"
                value={form.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("correo")}
              />
              {renderFeedback("correo")}
            </div>
          </div>

          {/* Fila 3: Fecha de nacimiento y Edad (automática) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px 18px",
            }}
          >
            <div>
              <label style={labelStyle}>
                Fecha de nacimiento {requiredAsterisk}
              </label>
              <input
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date().toISOString().split("T")[0]}
                style={getInputStyle("fechaNacimiento")}
              />
              {renderFeedback("fechaNacimiento")}
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
                Teléfono {requiredAsterisk}
              </label>
              <input
                required
                name="telefono"
                placeholder="Ej. 3001234567"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                style={getInputStyle("telefono")}
              />
              {renderFeedback("telefono")}
            </div>

            <div>
              <label style={labelStyle}>
                Rol {requiredAsterisk}
              </label>
              <select
                required
                name="rol"
                value={form.rol}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loadingRoles}
                style={getInputStyle("rol")}
              >
                <option value="">Seleccione un rol</option>
                {Array.isArray(roles) &&
                  roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.nombre || role.name || role.slug || "Sin nombre"}
                    </option>
                  ))}
              </select>
              {renderFeedback("rol")}
            </div>
          </div>

          {/* Notificación informativa del enlace seguro de activación */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 12px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 8,
              color: "#1e40af",
              fontSize: 11.5,
              lineHeight: 1.35,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>
              Por seguridad, la contraseña se establecerá mediante un enlace de activación seguro enviado automáticamente al correo del usuario.
            </span>
          </div>

          {/* Botones de acción */}
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
              disabled={submitting}
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
              disabled={submitting || validatingDoc || validatingEmail || docAvailable === false || emailAvailable === false}
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
                cursor: submitting || docAvailable === false || emailAvailable === false ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(14, 59, 67, 0.3)",
                opacity: submitting || docAvailable === false || emailAvailable === false ? 0.7 : 1,
              }}
            >
              {submitting ? (
                "Creando usuario..."
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Crear usuario</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
