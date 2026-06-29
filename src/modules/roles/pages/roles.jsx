import { useEffect, useMemo, useState } from "react";

import RoleTable from "../components/RoleTable";

import CreateRoleModal from "../components/modals/CreateRoleModal";
import EditRoleModal from "../components/modals/EditRoleModal";
import RoleDetailsModal from "../components/modals/RoleDetailsModal";
import ChangeStatusModal from "../components/modals/ChangeStatusModal";

import {
  getRoles,
} from "../services/roleStorage";

export default function Roles() {

  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedRole, setSelectedRole] = useState(null);

  const [showCreate, setShowCreate] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [showStatus, setShowStatus] = useState(false);

  //----------------------------------------------------

  const loadRoles = () => {
    setRoles(getRoles());
  };

  //----------------------------------------------------

  useEffect(() => {
    loadRoles();
  }, []);

  //----------------------------------------------------

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [roles, search]);

  //----------------------------------------------------

  const handleCreate = () => {
    setShowCreate(true);
  };

  //----------------------------------------------------

  const handleEdit = (role) => {

    if (role.system) {

      alert(
        "El rol Administrador no puede modificarse."
      );

      return;
    }

    setSelectedRole(role);

    setShowEdit(true);

  };

  //----------------------------------------------------

  const handleDetails = (role) => {

    setSelectedRole(role);

    setShowDetails(true);

  };

  //----------------------------------------------------

  const handleStatus = (role) => {

    if (role.system) {

      alert(
        "El rol Administrador siempre debe permanecer activo."
      );

      return;

    }

    setSelectedRole(role);

    setShowStatus(true);

  };

  //----------------------------------------------------

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">

            Administración / Configuración

          </p>

          <h1 className="text-4xl font-bold text-slate-900">

            Gestión de Roles

          </h1>

        </div>

        <button
          onClick={handleCreate}
          className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600 transition"
        >
          + Nuevo Rol
        </button>

      </div>

      {/* TARJETAS */}

      <div className="grid grid-cols-3 gap-6">

        <div className="rounded-3xl bg-white p-8 shadow">

          <p className="text-sm uppercase text-gray-400">

            Roles Totales

          </p>

          <h2 className="mt-4 text-5xl font-bold">

            {roles.length}

          </h2>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow">

          <p className="text-sm uppercase text-gray-400">

            Permisos

          </p>

          <h2 className="mt-4 text-5xl font-bold">

            84

          </h2>

        </div>

        <div className="rounded-3xl bg-white p-8 shadow">

          <p className="text-sm uppercase text-gray-400">

            Estado

          </p>

          <h2 className="mt-4 text-2xl font-semibold text-green-600">

            Sistema Operativo

          </h2>

        </div>

      </div>

      {/* TABLA */}

      <div className="rounded-3xl bg-white shadow">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-semibold">

            Roles

          </h2>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Buscar..."
            className="w-72 rounded-xl border px-4 py-2 outline-none focus:border-orange-500"
          />

        </div>

        <RoleTable
          roles={filteredRoles}
          refresh={loadRoles}
          onEdit={handleEdit}
          onDetails={handleDetails}
          onStatus={handleStatus}
        />

      </div>

      {/* MODALES */}

      <CreateRoleModal
        open={showCreate}
        refresh={loadRoles}
        onClose={() => {

          setShowCreate(false);

          loadRoles();

        }}
      />

      <EditRoleModal
        role={selectedRole}
        open={showEdit}
        refresh={loadRoles}
        onClose={() => {

          setShowEdit(false);

          loadRoles();

        }}
      />

      <RoleDetailsModal
        role={selectedRole}
        open={showDetails}
        onClose={() =>
          setShowDetails(false)
        }
      />

      <ChangeStatusModal
        role={selectedRole}
        refresh={loadRoles}
        open={showStatus}
        onClose={() => {

          setShowStatus(false);

          loadRoles();

        }}
      />

    </div>

  );

}