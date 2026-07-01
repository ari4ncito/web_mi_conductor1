import { useMemo, useState } from "react";

import ModulePage from '../../../components/common/ModulePage/ModulePage.jsx';
import UserTable from "../components/UserTable";

import EditUserModal from "../components/modals/EditUserModal";
import CreateUserModal from "../components/modals/CreateUserModal";
import UserDetailsModal from "../components/modals/UserDetailsModal";
import DeleteUserModal from "../components/modals/DeleteUserModal";
import ReportUnavailableModal from "../components/modals/ReportUnavailableModal";

import {
  getUsers,
  updateUser,
  deleteUser,
} from "../services/userStorage";

export default function UsersPage() {
  const [users, setUsers] = useState(getUsers());

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const reloadUsers = () => {
    setUsers(getUsers());
  };

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase();

    return users.filter((user) =>
      `${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(value)
    );
  }, [users, search]);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const handleSaveUser = (updatedUser) => {
    updateUser(updatedUser.id, updatedUser);
    reloadUsers();
    setShowEdit(false);
  };

  const handleUserCreated = () => {
    reloadUsers();
    setShowCreate(false);
  };

  const confirmDelete = () => {
    if (!selectedUser) return;

    deleteUser(selectedUser.id);

    reloadUsers();

    setShowDelete(false);

    setSelectedUser(null);
  };

  return (
    <ModulePage
      label="Usuarios"
      title="Gestión de Usuarios"
      description="Administra usuarios, roles y permisos del sistema."
    >
      <div style={{ display: 'grid', gap: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              type="button"
              onClick={() => setShowReport(true)}
              style={{ borderRadius: 14, border: '1px solid rgba(27, 46, 61, 0.08)', background: '#ffffff', padding: '0 20px', display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 600, color: '#111111', boxShadow: '0 10px 18px rgba(21, 42, 53, 0.08)' }}
            >
              📄 Generar Reporte
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              style={{ borderRadius: 14, border: 'none', background: '#ff9a2f', color: '#111111', padding: '0 22px', display: 'inline-flex', alignItems: 'center', height: 44, fontWeight: 600, boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)' }}
            >
              + Nuevo Usuario
            </button>
          </div>
        </div>

        <section style={{ background: '#ffffff', borderRadius: 28, border: '1px solid rgba(27, 46, 61, 0.08)', boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '24px' }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111111' }}>Usuarios</h3>
              <p style={{ margin: '10px 0 0', color: '#667085', fontSize: 15 }}>Administra todos los usuarios registrados.</p>
            </div>

            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 16, background: '#f0f5ff', border: '1px solid rgba(27, 46, 61, 0.08)' }}>
                <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#9aa5b1' }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre o correo..."
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: '#111111' }}
                />
              </div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <UserTable
              users={filteredUsers}
              onViewDetails={handleView}
              onEditUser={handleEdit}
              onDeleteUser={handleDelete}
            />
          </div>
        </section>
      </div>

      {/* Crear */}

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleUserCreated}
      />

      {/* Editar */}

      <EditUserModal
        user={selectedUser}
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={handleSaveUser}
      />

      {/* Ver detalles */}

      <UserDetailsModal
        user={selectedUser}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />

      {/* Eliminar */}

      <DeleteUserModal
        user={selectedUser}
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />

      {/* Reporte */}

      <ReportUnavailableModal
        open={showReport}
        onClose={() => setShowReport(false)}
      />

    </ModulePage>
  );
}