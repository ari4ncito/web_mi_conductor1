import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import PushAlertContainer from '../../../components/common/Toast/PushAlert.jsx';
import PermissionTree, { emptyModulePerms } from '../components/PermissionTree';
import RoleStatusBadge from '../components/RoleStatusBadge';
import { isSystemRole } from '../components/RoleTable';

import roleService from '../services/roleService';
import permisoService from '../services/permisoService.js';

function ArrowLeftIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function CheckIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ShieldIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function HashIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
    </svg>
  );
}

function DocumentTextIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function UsersGroupIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function FormField({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  mono = false,
  rows = 4,
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="relative">
        {icon && (
          <div
            className={`absolute left-0 pl-4 flex pointer-events-none text-slate-400 ${
              type === 'textarea' ? 'top-3.5 items-start' : 'inset-y-0 items-center'
            }`}
          >
            {icon}
          </div>
        )}

        {readOnly ? (
          <div
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm ${
              mono ? 'font-mono text-slate-600' : 'font-semibold text-slate-800'
            } ${type === 'textarea' ? 'min-h-[96px] items-start leading-relaxed font-normal text-slate-700' : 'min-h-[46px] items-center'} flex`}
          >
            {value ? (
              String(value)
            ) : (
              <span className="text-slate-400 font-normal italic">
                {placeholder || 'No especificado'}
              </span>
            )}
          </div>
        ) : type === 'textarea' ? (
          <textarea
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border ${
              error ? 'border-red-400 bg-red-50/50' : 'border-slate-200 bg-white'
            } focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition text-sm font-medium text-slate-700 resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border ${
              error ? 'border-red-400 bg-red-50/50' : 'border-slate-200 bg-white'
            } focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition text-sm ${
              mono ? 'font-mono text-slate-600' : 'font-medium text-slate-700'
            }`}
          />
        )}

        {label && (
          <label
            className={`absolute -top-2 left-3 bg-white px-1.5 text-[10px] font-bold uppercase tracking-wider rounded ${
              error ? 'text-red-500' : 'text-slate-500'
            }`}
          >
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}

function adaptarPermisosRol(permisos = []) {
  const resultado = emptyModulePerms();
  if (!Array.isArray(permisos)) return resultado;

  permisos.forEach((permiso) => {
    const codigo = permiso.codigo?.toLowerCase();
    if (!codigo) return;

    const partes = codigo.split('.');
    if (partes.length !== 2) return;

    const [accion, modulo] = partes;
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

    let frontendAccion;
    switch (accion) {
      case 'ver':
        frontendAccion = 'view';
        break;
      case 'editar':
        frontendAccion = 'edit';
        break;
      case 'crear':
        frontendAccion = 'add';
        break;
      case 'eliminar':
        frontendAccion = 'delete';
        break;
      default:
        return;
    }

    resultado[frontendModulo][frontendRecurso][frontendAccion] = true;
  });

  return resultado;
}

function adaptarRolDetalle(rol) {
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
    status: (rol.activo !== undefined ? rol.activo : rol.status === 'active') ? 'active' : 'inactive',
    accent: rol.esSistema ? 'admin' : 'client',
    system: rol.esSistema === true || rol.esSistema === 'true' || rol.system === true,
    permissions: adaptarPermisosRol(rol.permisos),
  };
}

function obtenerIdsPermisos(permissions, permisos = []) {
  const ids = [];
  if (!Array.isArray(permisos)) return ids;

  permisos.forEach((permiso) => {
    const codigo = permiso.codigo?.toLowerCase();
    if (!codigo) return;

    const partes = codigo.split('.');
    if (partes.length !== 2) return;

    const [accion, modulo] = partes;
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

    let frontendAccion;
    switch (accion) {
      case 'ver':
        frontendAccion = 'view';
        break;
      case 'editar':
        frontendAccion = 'edit';
        break;
      case 'crear':
        frontendAccion = 'add';
        break;
      case 'eliminar':
        frontendAccion = 'delete';
        break;
      default:
        return;
    }

    const marcado = permissions?.[frontendModulo]?.[frontendRecurso]?.[frontendAccion];
    if (marcado) {
      if (permiso._id) {
        ids.push(permiso._id);
      } else if (permiso.id) {
        ids.push(permiso.id);
      }
    }
  });

  return ids;
}

export default function RoleFormPage({ mode: propMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode =
    propMode ||
    (location.pathname.endsWith('/edit')
      ? 'edit'
      : location.pathname.endsWith('/new') || location.pathname.endsWith('/register')
      ? 'create'
      : id
      ? 'detail'
      : 'create');

  const isReadOnly = mode === 'detail';

  const initialRoleFromState = (() => {
    if ((mode !== 'detail' && mode !== 'edit') || !id) return null;
    const stateRole = location.state?.role;
    if (
      stateRole &&
      (String(stateRole.id) === String(id) || String(stateRole._id) === String(id))
    ) {
      return stateRole;
    }
    return null;
  })();

  const [name, setName] = useState(initialRoleFromState?.name || '');
  const [slug, setSlug] = useState(initialRoleFromState?.slug || '');
  const [description, setDescription] = useState(initialRoleFromState?.description || '');
  const [permissions, setPermissions] = useState(() => {
    if (
      initialRoleFromState?.permissions &&
      typeof initialRoleFromState.permissions === 'object' &&
      !Array.isArray(initialRoleFromState.permissions)
    ) {
      return initialRoleFromState.permissions;
    }
    if (Array.isArray(initialRoleFromState?.backendPermissions)) {
      return adaptarPermisosRol(initialRoleFromState.backendPermissions);
    }
    return emptyModulePerms();
  });
  const [roleMeta, setRoleMeta] = useState(() => ({
    usersAttached: initialRoleFromState?.usersAttached ?? 0,
    status: initialRoleFromState?.status || 'active',
    system: initialRoleFromState ? isSystemRole(initialRoleFromState) : false,
  }));

  const [permisosList, setPermisosList] = useState(
    Array.isArray(location.state?.permisos) ? location.state.permisos : []
  );
  const [loading, setLoading] = useState(
    (mode === 'detail' || mode === 'edit') && Boolean(id) && !initialRoleFromState
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    description: '',
    permissions: '',
  });

  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const alertId = Date.now() + Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id: alertId, type, title, message, duration }]);
  }, []);

  const removeAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  // Proteger roles del sistema si alguien accede directamente por URL a /roles/:id/edit
  useEffect(() => {
    if (mode === 'edit' && initialRoleFromState && isSystemRole(initialRoleFromState)) {
      navigate('/roles', {
        replace: true,
        state: {
          alert: {
            type: 'warning',
            title: 'Rol del sistema',
            message: 'El rol predeterminado del sistema no puede ser modificado.',
          },
        },
      });
    }
  }, [mode, initialRoleFromState, navigate]);

  // Cargar permisos en modo creación o edición si no vienen en location.state
  useEffect(() => {
    if (mode !== 'create' && mode !== 'edit') return;
    if (permisosList.length > 0) return;

    let cancelled = false;
    permisoService
      .getAll()
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setPermisosList(data);
      })
      .catch((err) => {
        console.error('Error al cargar permisos:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, permisosList.length]);

  // Cargar información del rol desde backend en modo consulta o edición si no vino en location.state
  useEffect(() => {
    if ((mode !== 'detail' && mode !== 'edit') || !id || initialRoleFromState) return;

    let cancelled = false;

    roleService
      .getById(id)
      .then((res) => {
        if (cancelled) return;
        const rawRol = res?.data || res;
        const adapted = adaptarRolDetalle(rawRol);

        if (mode === 'edit' && isSystemRole(adapted)) {
          navigate('/roles', {
            replace: true,
            state: {
              alert: {
                type: 'warning',
                title: 'Rol del sistema',
                message: 'El rol predeterminado del sistema no puede ser modificado.',
              },
            },
          });
          return;
        }

        setName(adapted.name || '');
        setSlug(adapted.slug || '');
        setDescription(adapted.description || '');
        setPermissions(adapted.permissions || emptyModulePerms());
        setRoleMeta({
          usersAttached: adapted.usersAttached ?? 0,
          status: adapted.status || 'inactive',
          system: isSystemRole(adapted),
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Error al obtener rol:', err);
        setError(
          err?.response?.data?.message || 'No se pudo encontrar la información del rol solicitado.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, id, initialRoleFromState, navigate]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    setSlug(generatedSlug);

    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: '' }));
    }
    if (error) setError('');
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (fieldErrors.description) {
      setFieldErrors((prev) => ({ ...prev, description: '' }));
    }
    if (error) setError('');
  };

  const handlePermissionsChange = (nextPerms) => {
    if (isReadOnly) return;
    setPermissions(nextPerms);
    if (fieldErrors.permissions) {
      setFieldErrors((prev) => ({ ...prev, permissions: '' }));
    }
    if (error) setError('');
  };

  const handleCancelOrBack = () => {
    if (saving) return;
    navigate('/roles');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReadOnly || saving) return;

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const nextErrors = { name: '', description: '', permissions: '' };

    if (!trimmedName) {
      nextErrors.name = 'El nombre del rol es obligatorio.';
    } else if (trimmedName.length < 3) {
      nextErrors.name = 'El nombre debe tener mínimo 3 caracteres.';
    } else if (trimmedName.length > 100) {
      nextErrors.name = 'El nombre no puede superar los 100 caracteres.';
    }

    if (!trimmedDesc) {
      nextErrors.description = 'La descripción es obligatoria.';
    } else if (trimmedDesc.length < 5) {
      nextErrors.description = 'La descripción debe tener mínimo 5 caracteres.';
    } else if (trimmedDesc.length > 250) {
      nextErrors.description = 'La descripción no puede superar los 250 caracteres.';
    }

    let currentPermisos = permisosList;
    if (currentPermisos.length === 0) {
      try {
        const res = await permisoService.getAll();
        currentPermisos = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setPermisosList(currentPermisos);
      } catch {
        currentPermisos = [];
      }
    }

    const permisosIds = obtenerIdsPermisos(permissions, currentPermisos);
    if (permisosIds.length === 0) {
      nextErrors.permissions =
        mode === 'edit'
          ? 'Debes asignar al menos un permiso al rol.'
          : 'Debes seleccionar al menos un permiso para el rol.';
    }

    if (nextErrors.name || nextErrors.description || nextErrors.permissions) {
      setFieldErrors(nextErrors);
      const firstError = nextErrors.name || nextErrors.description || nextErrors.permissions;
      setError(firstError);
      addAlert({
        type: 'warning',
        title: 'Datos no válidos',
        message: firstError,
      });
      return;
    }

    try {
      setSaving(true);
      setError('');

      const datos = {
        nombre: trimmedName,
        descripcion: trimmedDesc,
        permisos: permisosIds,
      };

      if (mode === 'edit') {
        await roleService.update(id, datos);
        navigate('/roles', {
          state: {
            alert: {
              type: 'success',
              title: '¡Rol actualizado con éxito!',
              message: `Los cambios para el rol "${trimmedName}" han sido guardados correctamente.`,
            },
          },
        });
      } else {
        await roleService.create(datos);
        navigate('/roles', {
          state: {
            alert: {
              type: 'success',
              title: '¡Rol creado con éxito!',
              message: `El rol "${trimmedName}" y sus permisos han sido configurados correctamente.`,
            },
          },
        });
      }
    } catch (err) {
      console.error(mode === 'edit' ? 'Error actualizando rol:' : 'Error creando rol:', err);
      const errorMsg =
        err?.response?.data?.message ||
        (mode === 'edit'
          ? 'No se pudo actualizar el rol. Intenta nuevamente.'
          : 'No se pudo guardar el rol. Verifica la información ingresada.');
      setError(errorMsg);
      addAlert({
        type: 'error',
        title: 'Error al guardar',
        message: errorMsg,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 mx-auto">
      <PushAlertContainer alerts={alerts} onDismiss={removeAlert} />

      {/* Top Header & Breadcrumb (Patrón del módulo de Vehículos) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelOrBack}
            disabled={saving}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center justify-center transition shadow-xs cursor-pointer disabled:opacity-60"
            title="Volver al listado de roles"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Módulo de Roles y Permisos
              </span>
              <span className="text-slate-300">•</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  mode === 'create'
                    ? 'bg-orange-100 text-orange-700'
                    : mode === 'edit'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {mode === 'create' ? 'Nuevo Registro' : mode === 'edit' ? 'Edición' : 'Detalle'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {mode === 'create'
                ? 'Registrar Nuevo Rol'
                : mode === 'edit'
                ? `Editar Rol${name ? `: ${name}` : ''}`
                : `Detalle del Rol: ${name || 'Rol'}`}
            </h1>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-3 shadow-xs">
          <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Cargando información del rol...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Columna Izquierda (5 cols): Datos Básicos y Metadatos en consulta */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Card 1: Datos Básicos del Rol */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h2 className="text-base font-bold text-slate-800">Datos Básicos del Rol</h2>
                </div>
                <p className="text-xs text-slate-500 mb-6 ml-3.5">
                  {isReadOnly
                    ? 'Información principal e identificación del rol consultado'
                    : mode === 'edit'
                    ? 'Actualiza el nombre y propósito del rol seleccionado'
                    : 'Define el nombre, identificador y propósito del nuevo rol'}
                </p>

                <FormField
                  label="NOMBRE DEL ROL"
                  value={name}
                  readOnly={isReadOnly}
                  error={fieldErrors.name}
                  onChange={handleNameChange}
                  placeholder={isReadOnly ? 'Sin nombre' : 'Ej. Supervisor Regional'}
                  icon={<ShieldIcon className="w-5 h-5" />}
                />

                <FormField
                  label="IDENTIFICADOR ÚNICO (SLUG)"
                  value={slug}
                  readOnly
                  mono
                  placeholder={isReadOnly ? '—' : 'supervisor_regional'}
                  icon={<HashIcon className="w-5 h-5" />}
                />

                <FormField
                  label="DESCRIPCIÓN"
                  type="textarea"
                  rows={4}
                  value={description}
                  readOnly={isReadOnly}
                  error={fieldErrors.description}
                  onChange={handleDescriptionChange}
                  placeholder={
                    isReadOnly
                      ? 'Sin descripción registrada'
                      : 'Describe el propósito y alcance de este rol...'
                  }
                  icon={<DocumentTextIcon className="w-5 h-5" />}
                />
              </div>

              {/* Card 2 (solo en modo Ver rol): Estado y Usuarios Asignados */}
              {isReadOnly && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                    <h2 className="text-base font-bold text-slate-800">Estado y Asignación</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-5 ml-3.5">
                    Resumen operativo y usuarios vinculados actualmente al rol
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        ESTADO ACTUAL
                      </span>
                      <div className="flex items-center gap-2 min-h-[28px]">
                        <RoleStatusBadge status={roleMeta.status} />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        USUARIOS ASIGNADOS
                      </span>
                      <div className="flex items-center gap-2 min-h-[28px] text-sm font-bold text-blue-700">
                        <UsersGroupIcon className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{roleMeta.usersAttached ?? 0} usuarios</span>
                      </div>
                    </div>
                  </div>

                  {roleMeta.system && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-800 font-medium">
                      Rol predeterminado del sistema con protección activa.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Columna Derecha (7 cols): Árbol de Permisos */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                    <h2 className="text-base font-bold text-slate-800">
                      {isReadOnly ? 'Permisos Asociados al Rol' : 'Asignación de Permisos'}
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {isReadOnly ? 'Solo Lectura' : 'Permisos Requeridos'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-5 ml-3.5">
                  {isReadOnly
                    ? 'Consulta los permisos habilitados por módulo para este rol'
                    : mode === 'edit'
                    ? 'Actualiza las acciones permitidas en cada módulo del sistema'
                    : 'Selecciona las acciones permitidas en cada módulo del sistema'}
                </p>

                <PermissionTree
                  value={permissions}
                  onChange={handlePermissionsChange}
                  readOnly={isReadOnly}
                />

                {fieldErrors.permissions && (
                  <p className="text-xs text-red-500 mt-3 ml-1">{fieldErrors.permissions}</p>
                )}
              </div>
            </div>
          </div>

          {/* Barra Inferior Fija de Acciones (Patrón del módulo de Vehículos) */}
          <div className="sticky bottom-4 mt-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleCancelOrBack}
              disabled={saving}
              className="px-6 h-12 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition cursor-pointer disabled:opacity-60"
            >
              {isReadOnly ? 'Volver a Roles' : 'Cancelar'}
            </button>

            {!isReadOnly && (
              <button
                type="submit"
                disabled={saving}
                className={`px-8 h-12 rounded-xl border-0 text-white text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
                  saving
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-[#0e3b43] hover:bg-[#155662] shadow-[0_4px_14px_rgba(14,59,67,0.3)]'
                }`}
              >
                {saving ? (
                  <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <CheckIcon className="w-5 h-5" />
                )}
                {saving
                  ? 'Guardando...'
                  : mode === 'edit'
                  ? 'Guardar Cambios'
                  : 'Guardar Rol'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
