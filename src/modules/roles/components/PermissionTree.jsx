// modules/roles/components/PermissionTree.jsx

// ─── Constantes (puedes moverlas a config/permissions.js) ───────────────────
export const MODULES = [
  {
    id: 'configuration',
    label: 'Configuración',
    description: 'Ajustes del sistema y llaves API.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'users',
    label: 'Usuarios',
    description: 'Gestión de conductores y personal.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'vehicles',
    label: 'Vehículos',
    description: 'Inventario de flota y mantenimiento.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h.01M16 17h.01M5 11l1.5-6h11L19 11M3 11h18v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" />
      </svg>
    ),
  },
  {
    id: 'execution',
    label: 'Ejecución',
    description: 'Despacho en vivo y optimización.',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export const CRUD_ACTIONS = [
  { key: 'view',   label: 'Ver' },
  { key: 'edit',   label: 'Editar' },
  { key: 'add',    label: 'Agregar' },
  { key: 'delete', label: 'Eliminar' },
];

/** Valor vacío por módulo */
export const emptyModulePerms = () =>
  Object.fromEntries(
    MODULES.map((m) => [m.id, { view: false, edit: false, add: false, delete: false }])
  );

// ─── Componente ─────────────────────────────────────────────────────────────

/**
 * @param {{
 *   value: Record<string, { view: boolean, edit: boolean, add: boolean, delete: boolean }>,
 *   onChange: (next: typeof value) => void,
 *   readOnly?: boolean,
 * }} props
 */
export default function PermissionTree({ value, onChange, readOnly = false }) {
  const toggle = (moduleId, actionKey) => {
    if (readOnly) return;
    onChange({
      ...value,
      [moduleId]: {
        ...value[moduleId],
        [actionKey]: !value[moduleId]?.[actionKey],
      },
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-semibold text-slate-900">Permisos de Módulo</span>
        <span className="text-sm font-semibold text-teal-600">
          {MODULES.length} Módulos Disponibles
        </span>
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODULES.map((mod) => {
          const perms = value?.[mod.id] ?? {};
          return (
            <div
              key={mod.id}
              className="border border-slate-200 rounded-xl p-4"
            >
              {/* Fila superior: icono + título + checkboxes */}
              <div className="flex items-start justify-between gap-3">
                {/* Icono + título */}
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-teal-800 flex items-center justify-center shrink-0">
                    {mod.icon}
                  </span>
                  <span className="font-semibold text-slate-900 text-sm pt-1.5">
                    {mod.label}
                  </span>
                </div>

                {/* Grid 2×2 de checkboxes */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 shrink-0">
                  {CRUD_ACTIONS.map((action) => {
                    const checked = !!perms[action.key];
                    return (
                      <label
                        key={action.key}
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <div className="relative inline-flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(mod.id, action.key)}
                            disabled={readOnly}
                            className="peer h-4 w-4 appearance-none rounded border border-slate-300
                                       checked:bg-orange-500 checked:border-orange-500
                                       disabled:opacity-60 disabled:cursor-not-allowed
                                       cursor-pointer transition-colors"
                          />
                          {/* checkmark */}
                          <svg
                            className="pointer-events-none absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-600">{action.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Descripción */}
              <p className="text-xs text-slate-400 mt-3">{mod.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}