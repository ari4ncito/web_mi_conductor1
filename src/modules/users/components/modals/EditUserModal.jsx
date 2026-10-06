import { useEffect, useState } from "react";

import axiosInstance from "../../../../services/api/axiosInstance";
import endpoints from "../../../../services/api/endpoints";

export default function EditUserModal({
    user,
    open,
    onClose,
    onSave,
}) {
    const [roles, setRoles] = useState([]);

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        rol: "",
        estado: true,
    });

    const [loadingRoles, setLoadingRoles] = useState(false);

    useEffect(() => {
        if (!open || !user) return;

        cargarRoles();

        setForm({
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            telefono: user.telefono || "",
            rol: user.rol?._id || user.rol || "",
            estado: user.estado ?? true,
        });
    }, [open, user]);

    const cargarRoles = async () => {
        try {
            setLoadingRoles(true);

            const response = await axiosInstance.get(
                endpoints.roles.getAll
            );

            let data = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];

            data = data.filter(r => {
                const nombre = (r.nombre || r.name || r.slug || "").toUpperCase();
                return nombre !== 'CLIENTE' && nombre !== 'CONDUCTOR';
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

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleEstadoChange = (e) => {
        setForm((current) => ({
            ...current,
            estado: e.target.value === "true",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const usuarioActualizado = {
            ...user,

            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            telefono: form.telefono.trim(),

            rol: form.rol,

            estado: form.estado,
        };

        onSave(usuarioActualizado);
    };

    const nombreCompleto =
        `${user.nombre || ""} ${user.apellido || ""}`.trim();

    return (
        <div
            className="mc-modal-overlay"
            onClick={onClose}
        >
            <div
                className="mc-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="mc-modal-header"
                >
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.12em",
                                color: "#ff9a2f",
                            }}
                        >
                            Editar Usuario
                        </p>

                        <h2
                            className="mc-modal-title"
                        >
                            {nombreCompleto || "Usuario"}
                        </h2>
                    </div>

                    <button
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
                        padding: '24px',
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: 16,
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
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                                style={inputStyle}
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
                                name="apellido"
                                value={form.apellido}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: 16,
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
                                Teléfono
                            </label>

                            <input
                                type="text"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                required
                                style={inputStyle}
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
                                Rol
                            </label>

                            <select
                                name="rol"
                                value={form.rol}
                                onChange={handleChange}
                                disabled={loadingRoles}
                                required
                                style={inputStyle}
                            >
                                {loadingRoles ? (
                                    <option value="">
                                        Cargando roles...
                                    </option>
                                ) : roles.length === 0 ? (
                                    <option value="">
                                        No hay roles disponibles
                                    </option>
                                ) : (
                                    roles.map((role) => (
                                        <option
                                            key={role._id}
                                            value={role._id}
                                        >
                                            {role.nombre ||
                                                role.name ||
                                                role.slug}
                                        </option>
                                    ))
                                )}
                            </select>
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
                            Estado
                        </label>

                        <select
                            name="estado"
                            value={form.estado ? "true" : "false"}
                            onChange={handleEstadoChange}
                            style={inputStyle}
                        >
                            <option value="true">
                                Activo
                            </option>

                            <option value="false">
                                Inactivo
                            </option>
                        </select>
                    </div>

                    <div
                        className="mc-modal-footer"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                height: 44,
                                borderRadius: 14,
                                border:
                                    "1px solid rgba(17, 17, 17, 0.08)",
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
                            className="mc-btn-primary"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    height: 44,
    borderRadius: 12,
    border: "1px solid rgba(17, 17, 17, 0.08)",
    padding: "0 16px",
    fontSize: 14,
    outline: "none",
    background: "#f8f9fa",
    boxSizing: "border-box",
};
