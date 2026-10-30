import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ModulePage from '../../../components/common/ModulePage/ModulePage.jsx';
import PushAlertContainer from '../../../components/common/Toast/PushAlert.jsx';

import RoleTable, { isSystemRole } from '../components/RoleTable';
import DeleteRoleModal from '../components/modals/DeleteRoleModal';

import roleService from '../services/roleService';
import permisoService from '../services/permisoService.js';

const PAGE_SIZE = 5;

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
};

function SearchSVG() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      style={{ color: '#9aa5b1' }}
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

function PlusSVG() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="#111111"
      strokeWidth={2.2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
}

function adaptarPermisos(permisos = []) {
  const accionesVacias = () => ({
    view: false,
    edit: false,
    add: false,
    delete: false,
  });

  const resultado = {
    configuration: {
      roles: accionesVacias(),
      permisos: accionesVacias(),
    },
    users: {
      usuarios: accionesVacias(),
      clientes: accionesVacias(),
    },
    vehicles: {
      vehiculos: accionesVacias(),
    },
    execution: {
      conductores: accionesVacias(),
      novedades: accionesVacias(),
    },
  };

  if (!Array.isArray(permisos)) {
    return resultado;
  }

  permisos.forEach((permiso) => {
    const codigo = permiso.codigo?.toLowerCase();
    if (!codigo) return;

    const [accion, modulo] = codigo.split('.');

    let frontendModulo;
    let frontendRecurso;

    switch (modulo) {
      case 'roles':
        frontendModulo = 'configuration';
        frontendRecurso = 'roles';
        break;
      case 'permisos':
        frontendModulo = 'configuration';
        frontendRecurso = 'permisos';
        break;
      case 'usuarios':
        frontendModulo = 'users';
        frontendRecurso = 'usuarios';
        break;
      case 'clientes':
        frontendModulo = 'users';
        frontendRecurso = 'clientes';
        break;
      case 'vehiculos':
      case 'vehículos':
        frontendModulo = 'vehicles';
        frontendRecurso = 'vehiculos';
        break;
      case 'conductores':
        frontendModulo = 'execution';
        frontendRecurso = 'conductores';
        break;
      case 'novedades':
        frontendModulo = 'execution';
        frontendRecurso = 'novedades';
        break;
      default:
        return;
    }

    let accionFrontend;
    switch (accion) {
      case 'ver':
        accionFrontend = 'view';
        break;
      case 'editar':
        accionFrontend = 'edit';
        break;
      case 'crear':
        accionFrontend = 'add';
        break;
      case 'eliminar':
        accionFrontend = 'delete';
        break;
      default:
        return;
    }

    if (frontendModulo && frontendRecurso && accionFrontend) {
      resultado[frontendModulo][frontendRecurso][accionFrontend] = true;
    }
  });

  return resultado;
}

function adaptarRol(rol, todosLosPermisos = []) {
  const roleId = rol._id || rol.id || rol._id?.toString() || rol.id?.toString();
  return {
    id: roleId,
    _id: roleId,
    raw: rol,
    name: rol.nombre
      ? rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1).toLowerCase()
      : rol.name || 'Sin nombre',
    slug: rol.slug || (rol.nombre ? rol.nombre.toLowerCase().replace(/\s+/g, '_') : ''),
    description: rol.descripcion || rol.description || '',
    usersAttached: rol.usuariosAsignados ?? rol.usersAttached ?? 0,
    status: (rol.activo !== undefined ? rol.activo : (rol.status === 'active')) ? 'active' : 'inactive',
    accent: rol.esSistema ? 'admin' : 'client',
    system: rol.esSistema === true || rol.esSistema === 'true' || rol.system === true,
    permissions: adaptarPermisos(rol.permisos, todosLosPermisos),
    backendPermissions: rol.permisos || [],
  };
}

export default function Roles() {
  const navigate = useNavigate();
  const location = useLocation();

  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRole, setSelectedRole] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* =========================================================
     SISTEMA DE ALERTAS PUSH (NOTIFICACIONES TOAST)
  ========================================================= */
  const [alerts, setAlerts] = useState(() => {
    if (location.state?.alert) {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      return [{ id, duration: 4500, ...location.state.alert }];
    }
    return [];
  });

  const addAlert = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  useEffect(() => {
    if (location.state?.alert) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /* =========================================================
     CARGA DE DATOS
  ========================================================= */
  const loadRoles = async (permisosActuales = permisos) => {
    try {
      setLoading(true);
      setError('');

      const rolesResponse = await roleService.getAll();
      const rolesBackend = Array.isArray(rolesResponse?.data)
        ? rolesResponse.data
        : Array.isArray(rolesResponse)
        ? rolesResponse
        : [];

      const rolesAdaptados = rolesBackend.map((rol) =>
        adaptarRol(rol, permisosActuales)
      );

      setRoles(rolesAdaptados);
    } catch (err) {
      console.error('Error cargando roles:', err);
      const msg = err?.response?.data?.message || 'No se pudieron cargar los roles.';
      setError(msg);
      addAlert({
        type: 'error',
        title: 'Error al cargar',
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');

        const [permisosResponse, rolesResponse] = await Promise.all([
          permisoService.getAll().catch(() => ({ data: [] })),
          roleService.getAll().catch((err) => { throw err; }),
        ]);

        const permisosBackend = Array.isArray(permisosResponse?.data)
          ? permisosResponse.data
          : Array.isArray(permisosResponse)
          ? permisosResponse
          : [];
        setPermisos(permisosBackend);

        const rolesBackend = Array.isArray(rolesResponse?.data)
          ? rolesResponse.data
          : Array.isArray(rolesResponse)
          ? rolesResponse
          : [];

        const rolesAdaptados = rolesBackend.map((rol) =>
          adaptarRol(rol, permisosBackend)
        );

        setRoles(rolesAdaptados);
      } catch (err) {
        console.error('Error cargando información:', err);
        const msg = err?.response?.data?.message || 'No se pudo cargar la información de roles.';
        setError(msg);
        addAlert({
          type: 'error',
          title: 'Error de conexión',
          message: msg,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [addAlert]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* =========================================================
     BUSCADOR MULTI-COLUMNA
     Busca en TODAS las columnas visibles de la tabla:
     - Rol (Nombre, Subtítulo, Slug)
     - Descripción
     - Usuarios (Conteo y formato texto)
     - Estado (Activo / Inactivo en español e inglés)
  ========================================================= */
  const filteredRoles = useMemo(() => {
    const query = search.trim();
    if (!query) return roles;

    const normalize = (text) =>
      String(text ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const normalizedQuery = normalize(query);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    return roles.filter((role) => {
      // 1. Columna Rol
      const name = normalize(role.name);
      const subtitle = normalize(role.subtitle);
      const slug = normalize(role.slug);

      // 2. Columna Descripción
      const description = normalize(role.description);

      // 3. Columna Usuarios asignados
      const usersCount =
        role.usersAttached !== undefined && role.usersAttached !== null
          ? String(role.usersAttached)
          : '0';
      const usersPadded = usersCount.padStart(2, '0');
      const usersText = `${usersCount} usuarios ${usersPadded} usuarios usuario`;

      // 4. Columna Estado
      const isActive = role.status === 'active';
      const statusSpanish = isActive
        ? 'activo'
        : role.status === 'locked'
        ? 'bloqueado'
        : 'inactivo';
      const statusEnglish = normalize(role.status);

      // Texto unificado de todas las columnas visibles
      const allColumnsText = `${name} ${subtitle} ${slug} ${description} ${usersText} ${statusSpanish} ${statusEnglish}`;

      // Todas las palabras del buscador deben coincidir
      return queryTokens.every((token) => allColumnsText.includes(token));
    });
  }, [roles, search]);

  const pagedRoles = useMemo(() => {
    const from = (currentPage - 1) * PAGE_SIZE;
    return filteredRoles.slice(from, from + PAGE_SIZE);
  }, [filteredRoles, currentPage]);

  /* =========================================================
     ACCIONES
  ========================================================= */
  const handleEdit = (role) => {
    if (!role) return;

    if (isSystemRole(role)) {
      addAlert({
        type: 'warning',
        title: 'Rol del sistema',
        message: 'El rol predeterminado del sistema no puede ser modificado.',
      });
      return;
    }

    const roleId = role.id || role._id;
    navigate(`/roles/${roleId}/edit`, { state: { role, permisos } });
  };

  const handleDetails = (role) => {
    if (!role) return;
    const roleId = role.id || role._id;
    navigate(`/roles/${roleId}`, { state: { role } });
  };

  /* =========================================================
     CAMBIO DE ESTADO (SWITCH EN LA TABLA)
  ========================================================= */
  const handleToggleStatus = async (role) => {
    if (isSystemRole(role)) {
      addAlert({
        type: 'warning',
        title: 'Acción no permitida',
        message: 'Los roles predeterminados del sistema permanecen siempre activos y no pueden desactivarse.',
      });
      return;
    }

    const isCurrentlyActive = role.status === 'active';
    const nuevoActivo = !isCurrentlyActive;
    const nuevoStatusStr = nuevoActivo ? 'active' : 'inactive';

    try {
      // Actualización en API
      await roleService.update(role.id, { activo: nuevoActivo });

      // Actualización optimista local inmediata
      setRoles((prev) =>
        prev.map((r) =>
          r.id === role.id ? { ...r, status: nuevoStatusStr } : r
        )
      );

      addAlert({
        type: 'success',
        title: '¡Estado actualizado!',
        message: `El rol "${role.name}" ahora se encuentra ${nuevoActivo ? 'ACTIVO' : 'INACTIVO'}.`,
      });
    } catch (err) {
      console.error('Error al cambiar estado del rol:', err);
      addAlert({
        type: 'error',
        title: 'Error al guardar',
        message:
          err?.response?.data?.message ||
          'No se pudo actualizar el estado del rol en el servidor.',
      });
      loadRoles();
    }
  };

  /* =========================================================
     ELIMINACIÓN DE ROL (CON MODAL DE CONFIRMACIÓN)
  ========================================================= */
  const handleDeleteClick = (role) => {
    if (!role) return;

    if (isSystemRole(role)) {
      addAlert({
        type: 'warning',
        title: 'Acción no permitida',
        message: 'El rol predeterminado de Administrador no puede ser eliminado del sistema.',
      });
      return;
    }

    setSelectedRole(role);
    setShowDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRole) return;

    const roleId =
      selectedRole.id ||
      selectedRole._id ||
      selectedRole.raw?._id ||
      selectedRole.raw?.id;

    if (!roleId) {
      addAlert({
        type: 'error',
        title: 'Error al eliminar',
        message: 'No se encontró el identificador del rol para eliminarlo.',
      });
      return;
    }

    const roleName = selectedRole.name || 'este rol';

    try {
      setDeleting(true);
      console.log('Eliminando rol con ID:', roleId);

      // 1. Llamar al backend DELETE /roles/:id
      await roleService.delete(roleId);

      // 2. Cerrar el modal
      setShowDelete(false);
      setSelectedRole(null);

      // 3. Actualización optimista inmediata en la tabla
      setRoles((prevRoles) =>
        prevRoles.filter((r) => r.id !== roleId && r._id !== roleId)
      );

      // 4. Notificación push de éxito
      addAlert({
        type: 'success',
        title: '¡Rol eliminado con éxito!',
        message: `El rol "${roleName}" ha sido eliminado correctamente del sistema.`,
      });

      // 5. Recargar la lista desde el servidor
      await loadRoles();
    } catch (err) {
      console.error('Error al eliminar rol:', err);
      const errorMsg =
        err?.response?.data?.message ||
        'No se pudo eliminar el rol. Verifica que no tenga usuarios asignados.';
      addAlert({
        type: 'error',
        title: 'Error al eliminar',
        message: errorMsg,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ModulePage>
      {/* ALERTAS PUSH TOAST FLOTANTES */}
      <PushAlertContainer alerts={alerts} onDismiss={removeAlert} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* ERROR GENERAL SI LO HAY */}
        {error && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: 12,
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#be123c',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {/* TABLA Y CONTENEDOR PRINCIPAL */}
        <section
          style={{
            background: colors.surface,
            borderRadius: 24,
            border: '1px solid rgba(27, 46, 61, 0.08)',
            boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)',
            overflow: 'hidden',
          }}
        >
          {/* BUSCADOR Y BOTÓN REGISTRAR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '18px 24px',
              borderBottom: '1px solid rgba(27, 46, 61, 0.08)',
              flexWrap: 'wrap',
            }}
          >
            {/* BUSCADOR MULTI-COLUMNA */}
            <div
              style={{
                flex: '1 1 280px',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 16px',
                  borderRadius: 12,
                  background: '#f0f5ff',
                  border: '1px solid rgba(27, 46, 61, 0.08)',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                  }}
                >
                  <SearchSVG />
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Buscar por rol, descripción, usuarios o estado (activo/inactivo)..."
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: 13.5,
                    color: '#111111',
                    fontFamily: 'inherit',
                  }}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 14,
                      padding: '0 4px',
                    }}
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* BOTÓN REGISTRAR */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/roles/new', { state: { permisos } })}
                style={{
                  height: 38,
                  borderRadius: 12,
                  border: 'none',
                  background: '#ff9a2f',
                  color: '#111111',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '0 18px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(255, 154, 47, 0.28)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <PlusSVG />
                Nuevo rol
              </button>
            </div>
          </div>

          {/* CUERPO DE TABLA */}
          <div style={{ padding: '24px' }}>
            {loading ? (
              <div
                style={{
                  padding: 40,
                  textAlign: 'center',
                  color: '#667085',
                  minHeight: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                Cargando roles...
              </div>
            ) : (
              <RoleTable
                roles={pagedRoles}
                onEdit={handleEdit}
                onDetails={handleDetails}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteClick}
                currentPage={currentPage}
                totalRoles={filteredRoles.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </section>
      </div>

      {/* MODAL ELIMINAR ROL */}
      <DeleteRoleModal
        role={selectedRole}
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedRole(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </ModulePage>
  );
}
