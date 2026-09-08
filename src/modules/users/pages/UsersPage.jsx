import { useEffect, useMemo, useState } from "react";

import ModulePage from "../../../components/common/ModulePage/ModulePage.jsx";

import UserTable from "../components/UserTable";
import EditUserModal from "../components/modals/EditUserModal";
import CreateUserModal from "../components/modals/CreateUserModal";
import UserDetailsModal from "../components/modals/UserDetailsModal";
import DeleteUserModal from "../components/modals/DeleteUserModal";
import ReportUnavailableModal from "../components/modals/ReportUnavailableModal";

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

function ReportSVG() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            aria-hidden="true"
            style={{ color: "#111111" }}
        >
            <path
                d="M9 12h6M9 16h6M9 8h2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />

            <path
                d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
            />
        </svg>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /*
     * =====================================================
     * CARGAR USUARIOS DESDE EL BACKEND
     * =====================================================
     */

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await UsuarioService.getAll();

            /*
             * El backend puede devolver:
             *
             * {
             *   success: true,
             *   data: [...]
             * }
             *
             * o directamente [...]
             *
             * Por eso manejamos ambos casos.
             */

            const usuarios = Array.isArray(data)
                ? data
                : data?.data || [];

            setUsers(usuarios);
        } catch (error) {
            console.error(
                "Error al cargar usuarios:",
                error
            );

            setError(
                error.response?.data?.message ||
                "No se pudieron cargar los usuarios."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * =====================================================
     * CARGAR AL ABRIR LA PÁGINA
     * =====================================================
     */

    useEffect(() => {
        loadUsers();
    }, []);

    /*
     * =====================================================
     * BUSCADOR
     * =====================================================
     */

    const filteredUsers = useMemo(() => {
        const value = search.toLowerCase();

        return users.filter((user) => {
            const nombre = `${user.nombre || ""} ${user.apellido || ""}`;

            const correo = user.correo || "";

            const rol =
                user.rol?.nombre ||
                user.rol?.name ||
                "";

            return `${nombre} ${correo} ${rol}`
                .toLowerCase()
                .includes(value);
        });
    }, [users, search]);

    /*
     * =====================================================
     * VER USUARIO
     * =====================================================
     */

    const handleView = (user) => {
        setSelectedUser(user);
        setShowDetails(true);
    };

    /*
     * =====================================================
     * EDITAR USUARIO
     * =====================================================
     */

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEdit(true);
    };

    /*
     * =====================================================
     * ELIMINAR USUARIO
     * =====================================================
     */

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDelete(true);
    };

    /*
     * =====================================================
     * GUARDAR CAMBIOS
     * =====================================================
     */

    const handleSaveUser = async (updatedUser) => {
        try {
            setError("");

            await UsuarioService.update(
                updatedUser._id,
                updatedUser
            );

            await loadUsers();

            setShowEdit(false);
            setSelectedUser(null);

        } catch (error) {
            console.error(
                "Error al actualizar usuario:",
                error
            );

            setError(
                error.response?.data?.message ||
                "No se pudo actualizar el usuario."
            );
        }
    };

    /*
     * =====================================================
     * USUARIO CREADO
     * =====================================================
     */

    const handleUserCreated = async () => {
        await loadUsers();

        setShowCreate(false);
    };

    /*
     * =====================================================
     * CONFIRMAR ELIMINACIÓN
     * =====================================================
     */

    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {
            setError("");

            await UsuarioService.delete(
                selectedUser._id
            );

            await loadUsers();

            setShowDelete(false);
            setSelectedUser(null);

        } catch (error) {
            console.error(
                "Error al eliminar usuario:",
                error
            );

            setError(
                error.response?.data?.message ||
                "No se pudo eliminar el usuario."
            );
        }
    };

    return (
        <ModulePage
            label="Usuarios"
            title="Gestión de Usuarios"
            description="Administra usuarios, roles y permisos del sistema."
        >
            <div style={{ display: "grid", gap: 24 }}>

                {/* BOTONES */}

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 20,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 12,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setShowReport(true)}
                            style={{
                                height: 44,
                                borderRadius: 14,
                                border:
                                    "1px solid rgba(27, 46, 61, 0.08)",
                                background: "#ffffff",
                                padding: "0 20px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                                fontWeight: 400,
                                color: "#111111",
                                boxShadow:
                                    "0 10px 18px rgba(21, 42, 53, 0.08)",
                                cursor: "pointer",
                            }}
                        >
                            <ReportSVG />

                            Generar Reporte
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowCreate(true)}
                            style={{
                                minWidth: 192,
                                height: 44,
                                borderRadius: 14,
                                border: "none",
                                background: "#ff9a2f",
                                color: "#111111",
                                padding: "0 18px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                fontSize: 16,
                                fontWeight: 400,
                                boxShadow:
                                    "0 10px 18px rgba(255, 154, 47, 0.28)",
                                cursor: "pointer",
                            }}
                        >
                            + Nuevo Usuario
                        </button>
                    </div>
                </div>

                {/* MENSAJE DE ERROR */}

                {error && (
                    <div
                        style={{
                            padding: "14px 18px",
                            borderRadius: 14,
                            background: "#fff1f2",
                            border: "1px solid #fecdd3",
                            color: "#be123c",
                            fontSize: 14,
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* CONTENEDOR */}

                <section
                    style={{
                        background: "#ffffff",
                        borderRadius: 28,
                        border:
                            "1px solid rgba(27, 46, 61, 0.08)",
                        boxShadow:
                            "0 10px 22px rgba(18, 39, 52, 0.05)",
                        overflow: "hidden",
                    }}
                >
                    {/* CABECERA */}

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 20,
                            padding: "24px",
                        }}
                    >
                        <div style={{ minWidth: 0 }}>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: 22,
                                    fontWeight: 600,
                                    color: "#111111",
                                }}
                            >
                                Usuarios
                            </h3>

                            <p
                                style={{
                                    margin: "10px 0 0",
                                    color: "#667085",
                                    fontSize: 15,
                                }}
                            >
                                Administra todos los usuarios registrados.
                            </p>
                        </div>

                        {/* BUSCADOR */}

                        <div
                            style={{
                                flex: "1 1 280px",
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "14px 18px",
                                    borderRadius: 16,
                                    background: "#f0f5ff",
                                    border:
                                        "1px solid rgba(27, 46, 61, 0.08)",
                                }}
                            >
                                <span
                                    style={{
                                        width: 18,
                                        height: 18,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SearchSVG />
                                </span>

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Buscar por nombre o correo..."
                                    style={{
                                        width: "100%",
                                        border: "none",
                                        background: "transparent",
                                        outline: "none",
                                        fontSize: 15,
                                        color: "#111111",
                                    }}
                                />
                            </div>
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
                                }}
                            >
                                No hay usuarios para mostrar.
                            </div>
                        ) : (
                            <UserTable
                                users={filteredUsers}
                                onViewDetails={handleView}
                                onEditUser={handleEdit}
                                onDeleteUser={handleDelete}
                            />
                        )}

                    </div>
                </section>
            </div>

            {/* CREAR */}

            <CreateUserModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={handleUserCreated}
            />

            {/* EDITAR */}

            <EditUserModal
                user={selectedUser}
                open={showEdit}
                onClose={() => {
                    setShowEdit(false);
                    setSelectedUser(null);
                }}
                onSave={handleSaveUser}
            />

            {/* DETALLES */}

            <UserDetailsModal
                user={selectedUser}
                open={showDetails}
                onClose={() => {
                    setShowDetails(false);
                    setSelectedUser(null);
                }}
            />

            {/* ELIMINAR */}

            <DeleteUserModal
                user={selectedUser}
                open={showDelete}
                onClose={() => {
                    setShowDelete(false);
                    setSelectedUser(null);
                }}
                onConfirm={confirmDelete}
            />

            {/* REPORTE */}

            <ReportUnavailableModal
                open={showReport}
                onClose={() => setShowReport(false)}
            />
        </ModulePage>
    );
}