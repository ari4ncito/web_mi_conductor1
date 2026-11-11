import { useEffect, useMemo, useState, lazy, Suspense, useCallback } from "react";

import ModulePage from "../../../components/common/ModulePage/ModulePage.jsx";
import UserTable from "../components/UserTable";
import PushAlertContainer from "../../../components/common/Toast/PushAlert.jsx";
import { exportUsersToExcel } from "../utils/exportUsersExcel.js";

const EditUserModal = lazy(() => import("../components/modals/EditUserModal"));
const CreateUserModal = lazy(() => import("../components/modals/CreateUserModal"));
const UserDetailsModal = lazy(() => import("../components/modals/UserDetailsModal"));
const DeleteUserModal = lazy(() => import("../components/modals/DeleteUserModal"));
const ChangeUserStatusModal = lazy(() => import("../components/modals/ChangeUserStatusModal"));

import UsuarioService from "../services/usuarioService.js";

function SearchSVG() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            style={{ color: "#9aa5b1" }}
        >
            <circle
                cx="11"
                cy="11"
                r="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M16 16l4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function DownloadIcon({ width = 17, height = 17 }) {
    return (
        <svg viewBox="0 0 24 24" width={width} height={height} aria-hidden="true">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 15V3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [userToChangeStatus, setUserToChangeStatus] = useState(null);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    // Sistema de notificaciones / alertas Push
    const [alerts, setAlerts] = useState([]);

    const addAlert = useCallback(({ type = "info", title, message, duration = 4500 }) => {
        const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
        setAlerts((prev) => [...prev, { id, type, title, message, duration }]);
    }, []);

    const dismissAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await UsuarioService.getAll();

            let usuarios = Array.isArray(data)
                ? data
                : data?.data || [];

            // Filtrar para el módulo administrativo exclusivo de personal/administración
            usuarios = usuarios.filter((u) => {
                const r = u.rol;
                const nombreRol = typeof r === "string" ? r : (r?.nombre || r?.name || r?.slug || "");
                const nombreMayus = String(nombreRol).toUpperCase();
                return nombreMayus !== "CLIENTE" && nombreMayus !== "CONDUCTOR";
            });

            setUsers(usuarios);
        } catch (err) {
            console.error("Error al cargar usuarios:", err);
            const msg = err.response?.data?.message || "No se pudieron cargar los usuarios.";
            setError(msg);
            addAlert({
                type: "error",
                title: "Error al cargar usuarios",
                message: msg,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const value = search.toLowerCase();

        return users.filter((user) => {
            const nombre = `${user.nombreCompleto || ""} ${user.nombre || ""} ${user.apellido || ""}`;
            const correo = user.correo || "";
            const documento = user.documento || "";
            const rol = user.rol?.nombre || user.rol?.name || user.rol?.slug || (typeof user.rol === "string" ? user.rol : "");

            return `${nombre} ${correo} ${documento} ${rol}`.toLowerCase().includes(value);
        });
    }, [users, search]);

    const handleView = useCallback((user) => {
        setSelectedUser(user);
        setShowDetails(true);
    }, []);

    const handleEdit = useCallback((user) => {
        setSelectedUser(user);
        setShowEdit(true);
    }, []);

    const handleDelete = useCallback((user) => {
        setSelectedUser(user);
        setShowDelete(true);
    }, []);

    const handleSaveUser = async (updatedUser) => {
        try {
            setActionLoading(true);
            setError("");

            await UsuarioService.update(updatedUser._id, updatedUser);
            await loadUsers();

            setShowEdit(false);
            setSelectedUser(null);

            addAlert({
                type: "success",
                title: "Usuario actualizado",
                message: `Los datos del usuario ${updatedUser.nombreCompleto || updatedUser.correo} fueron actualizados exitosamente.`,
            });
        } catch (err) {
            console.error("Error al actualizar usuario:", err);
            const msg = err.response?.data?.message || "No se pudo actualizar el usuario.";
            setError(msg);
            addAlert({
                type: "error",
                title: "Error al actualizar",
                message: msg,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUserCreated = async () => {
        await loadUsers();
        setShowCreate(false);

        addAlert({
            type: "success",
            title: "Usuario creado exitosamente",
            message: "La cuenta se registró correctamente. Se envió un correo electrónico con el enlace de activación para que el usuario configure su contraseña.",
            duration: 6000,
        });
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);
            setError("");

            await UsuarioService.delete(selectedUser._id);
            await loadUsers();

            const nombreEliminado =
                selectedUser.nombreCompleto ||
                `${selectedUser.nombre || ""} ${selectedUser.apellido || ""}`.trim() ||
                selectedUser.correo;

            setShowDelete(false);
            setSelectedUser(null);

            addAlert({
                type: "success",
                title: "Usuario eliminado",
                message: `El usuario "${nombreEliminado}" ha sido eliminado definitivamente del sistema.`,
            });
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            const msg = err.response?.data?.message || "No se pudo eliminar el usuario.";
            setError(msg);
            addAlert({
                type: "error",
                title: "No fue posible eliminar",
                message: msg,
                duration: 6500,
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Validación y apertura de modal para cambio de estado (Activar / Desactivar)
    const handleToggleStateRequest = useCallback((user) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            try {
                const base64Url = token.split(".")[1];
                if (base64Url) {
                    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                    const decoded = JSON.parse(
                        decodeURIComponent(
                            atob(base64)
                                .split("")
                                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                                .join("")
                        )
                    );
                    const currentId = decoded?.id || decoded?._id || decoded?.sub;
                    if (
                        (currentId && (user._id === currentId || user.id === currentId)) ||
                        (decoded?.correo && user.correo && decoded.correo.toLowerCase() === user.correo.toLowerCase())
                    ) {
                        addAlert({
                            type: "warning",
                            title: "Acción no permitida",
                            message: "No puedes desactivar la cuenta con la que has iniciado sesión actualmente.",
                        });
                        return;
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        setUserToChangeStatus(user);
        setShowStatusModal(true);
    }, [addAlert]);

    const confirmChangeStatus = async () => {
        if (!userToChangeStatus) return;

        try {
            setActionLoading(true);
            const nuevoEstado = !userToChangeStatus.estado;

            const usuarioActualizado = await UsuarioService.cambiarEstado(
                userToChangeStatus._id,
                nuevoEstado
            );

            setUsers((prev) =>
                prev.map((u) =>
                    u._id === userToChangeStatus._id
                        ? { ...u, estado: usuarioActualizado.estado }
                        : u
                )
            );

            setShowStatusModal(false);
            setUserToChangeStatus(null);

            addAlert({
                type: "success",
                title: nuevoEstado ? "Cuenta activada" : "Cuenta desactivada",
                message: nuevoEstado
                    ? "La cuenta ha sido reactivada. El usuario ahora puede ingresar al sistema."
                    : "La cuenta ha sido desactivada. El acceso al sistema ha sido revocado de forma inmediata.",
            });
        } catch (err) {
            console.error("Error cambiando estado del usuario:", err);
            const msg = err.response?.data?.message || "No se pudo cambiar el estado del usuario.";
            addAlert({
                type: "error",
                title: "Error al cambiar estado",
                message: msg,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleExportExcel = () => {
        try {
            if (filteredUsers.length === 0) {
                addAlert({
                    type: "warning",
                    title: "Sin registros",
                    message: "No hay usuarios que coincidan con la búsqueda actual para exportar.",
                });
                return;
            }

            exportUsersToExcel(filteredUsers);

            addAlert({
                type: "success",
                title: "Reporte generado",
                message: `Se descargó exitosamente el archivo Excel con ${filteredUsers.length} usuario(s).`,
            });
        } catch (err) {
            addAlert({
                type: "error",
                title: "Error al exportar",
                message: err.message || "No fue posible generar el reporte en Excel.",
            });
        }
    };

    return (
        <ModulePage>
            {/* Contenedor de Alertas Push */}
            <PushAlertContainer alerts={alerts} onDismiss={dismissAlert} />

            <div style={{ display: "grid", gap: 24 }}>
                {/* MENSAJE DE ERROR SUPERIOR (si existe) */}
                {error && (
                    <div
                        style={{
                            padding: "16px 20px",
                            borderRadius: 14,
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            color: "#be123c",
                            fontSize: 13.5,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#be123c",
                                cursor: "pointer",
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* CONTENEDOR PRINCIPAL */}
                <section
                    style={{
                        background: "#ffffff",
                        borderRadius: 28,
                        border: "1px solid rgba(27, 46, 61, 0.08)",
                        boxShadow: "0 10px 22px rgba(18, 39, 52, 0.05)",
                        overflow: "hidden",
                    }}
                >
                    {/* CABECERA: BUSCADOR + BOTONES */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 12,
                            padding: "18px 24px",
                        }}
                    >
                        {/* BUSCADOR */}
                        <div
                            style={{
                                flex: "1 1 200px",
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 14px",
                                    borderRadius: 10,
                                    background: "#f0f5ff",
                                    border: "1px solid rgba(27, 46, 61, 0.08)",
                                }}
                            >
                                <span
                                    style={{
                                        width: 16,
                                        height: 16,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <SearchSVG />
                                </span>

                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por nombre, documento o correo..."
                                    style={{
                                        width: "100%",
                                        border: "none",
                                        background: "transparent",
                                        outline: "none",
                                        fontSize: 13,
                                        color: "#111111",
                                    }}
                                />
                            </div>
                        </div>

                        {/* BOTONES */}
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                                flexShrink: 0,
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleExportExcel}
                                disabled={filteredUsers.length === 0}
                                title="Descargar reporte completo en formato Excel"
                                style={{
                                    height: 36,
                                    borderRadius: 10,
                                    border: "1px solid rgba(27, 46, 61, 0.12)",
                                    background: "#ffffff",
                                    color: "#166534",
                                    padding: "0 14px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 7,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: filteredUsers.length === 0 ? "not-allowed" : "pointer",
                                    opacity: filteredUsers.length === 0 ? 0.5 : 1,
                                    transition: "all 0.15s ease",
                                }}
                            >
                                <DownloadIcon />
                                <span>Exportar Excel</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowCreate(true)}
                                style={{
                                    height: 36,
                                    borderRadius: 10,
                                    border: "none",
                                    background: "#ff9a2f",
                                    color: "#111111",
                                    padding: "0 16px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    boxShadow: "0 4px 10px rgba(255, 154, 47, 0.25)",
                                    cursor: "pointer",
                                }}
                            >
                                + Nuevo Usuario
                            </button>
                        </div>
                    </div>

                    {/* TABLA */}
                    <div style={{ padding: "24px" }}>
                        {loading ? (
                            <div
                                style={{
                                    padding: 40,
                                    textAlign: "center",
                                    color: "#667085",
                                    minHeight: 400,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                Cargando usuarios...
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div
                                style={{
                                    padding: 40,
                                    textAlign: "center",
                                    color: "#667085",
                                    minHeight: 400,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                No hay usuarios para mostrar.
                            </div>
                        ) : (
                            <UserTable
                                users={filteredUsers}
                                onToggleState={handleToggleStateRequest}
                                onViewDetails={handleView}
                                onEditUser={handleEdit}
                                onDeleteUser={handleDelete}
                            />
                        )}
                    </div>
                </section>
            </div>

            {/* CREAR */}
            <Suspense fallback={null}>
                {showCreate && (
                    <CreateUserModal
                        open={showCreate}
                        onClose={() => setShowCreate(false)}
                        onCreated={handleUserCreated}
                    />
                )}
            </Suspense>

            {/* EDITAR */}
            <Suspense fallback={null}>
                {showEdit && (
                    <EditUserModal
                        user={selectedUser}
                        open={showEdit}
                        onClose={() => {
                            setShowEdit(false);
                            setSelectedUser(null);
                        }}
                        onSave={handleSaveUser}
                    />
                )}
            </Suspense>

            {/* DETALLES */}
            <Suspense fallback={null}>
                {showDetails && (
                    <UserDetailsModal
                        user={selectedUser}
                        open={showDetails}
                        onClose={() => {
                            setShowDetails(false);
                            setSelectedUser(null);
                        }}
                    />
                )}
            </Suspense>

            {/* ELIMINAR */}
            <Suspense fallback={null}>
                {showDelete && (
                    <DeleteUserModal
                        user={selectedUser}
                        open={showDelete}
                        loading={actionLoading}
                        onClose={() => {
                            setShowDelete(false);
                            setSelectedUser(null);
                        }}
                        onConfirm={confirmDelete}
                    />
                )}
            </Suspense>

            {/* CONFIRMAR CAMBIO DE ESTADO (ACTIVAR / DESACTIVAR) */}
            <Suspense fallback={null}>
                {showStatusModal && (
                    <ChangeUserStatusModal
                        user={userToChangeStatus}
                        open={showStatusModal}
                        loading={actionLoading}
                        onClose={() => {
                            setShowStatusModal(false);
                            setUserToChangeStatus(null);
                        }}
                        onConfirm={confirmChangeStatus}
                    />
                )}
            </Suspense>
        </ModulePage>
    );
}
