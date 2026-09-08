import { useEffect, useState } from "react";

import RoleService from "../../../roles/services/roleService";
import UsuarioService from "../../services/usuarioService";

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}) {
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "CC",
    documento: "",
    correo: "",
    password: "",
    telefono: "",
    rol: "",
    estado: true,
  });

  useEffect(() => {
    if (!open) return;

    const cargarRoles = async () => {
      try {
        const response = await RoleService.getAll();

        console.log("Respuesta de roles:", response);

        let availableRoles = [];

        if (Array.isArray(response)) {
          availableRoles = response;
        } else if (Array.isArray(response?.data)) {
          availableRoles = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          availableRoles = response.data.data;
        }

        setRoles(availableRoles);

        setForm({
          nombre: "",
          apellido: "",
          tipoDocumento: "CC",
          documento: "",
          correo: "",
          password: "",
          telefono: "",
          rol: availableRoles[0]?._id || "",
          estado: true,
        });
      } catch (error) {
        console.error("Error al cargar roles:", error);
        setRoles([]);
      }
    };

    cargarRoles();
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: name === "estado" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Usuario que se enviará:", form);

      await UsuarioService.create(form);

      await onCreated();

      onClose();
    } catch (error) {
      console.error("Error al crear usuario:", error);

      console.error(
        "Respuesta del servidor:",
        error.response?.data
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 40,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(640px, calc(100% - 40px))",
          maxWidth: "100%",
          maxHeight: "90vh",
          borderRadius: 30,
          background: "#ffffff",
          boxShadow: "0 30px 90px rgba(5, 16, 24, 0.28)",
          overflowY: "auto",
          border: "1px solid rgba(17, 17, 17, 0.08)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            padding: "28px 32px 24px",
            borderBottom: "1px solid rgba(17, 17, 17, 0.08)",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#ff9a2f",
              }}
            >
              Nuevo usuario
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                fontSize: 22,
                fontWeight: 700,
                color: "#11384a",
                lineHeight: 1.2,
              }}
            >
              Crear usuario
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              flexShrink: 0,
              padding: 4,
              fontSize: 22,
            }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Nombre
              </label>

              <input
                required
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Apellido
              </label>

              <input
                required
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Tipo de documento
              </label>

              <select
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              >
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Documento
              </label>

              <input
                required
                name="documento"
                value={form.documento}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#3d4f5c",
                marginBottom: 6,
              }}
            >
              Correo
            </label>

            <input
              required
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                border: "1px solid rgba(17, 17, 17, 0.08)",
                padding: "0 16px",
                fontSize: 14,
                outline: "none",
                background: "#f8f9fa",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Contraseña
              </label>

              <input
                required
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Teléfono
              </label>

              <input
                required
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Rol
              </label>

              <select
                required
                name="rol"
                value={form.rol}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              >
                <option value="">Seleccione un rol</option>

                {Array.isArray(roles) &&
                  roles.map((role) => (
                    <option
                      key={role._id}
                      value={role._id}
                    >
                      {role.nombre ||
                        role.name ||
                        role.slug ||
                        "Sin nombre"}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#3d4f5c",
                  marginBottom: 6,
                }}
              >
                Estado
              </label>

              <select
                name="estado"
                value={String(form.estado)}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  padding: "0 16px",
                  fontSize: 14,
                  outline: "none",
                  background: "#f8f9fa",
                }}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              paddingTop: 8,
              borderTop: "1px solid rgba(17, 17, 17, 0.08)",
              marginTop: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 44,
                borderRadius: 14,
                border: "1px solid rgba(17, 17, 17, 0.08)",
                background: "#ffffff",
                color: "#1b1b1b",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                padding: "0 24px",
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={{
                height: 44,
                borderRadius: 14,
                border: 0,
                background: "#ff9a2f",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                padding: "0 24px",
                boxShadow:
                  "0 8px 16px rgba(255, 154, 47, 0.28)",
              }}
            >
              Crear usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
