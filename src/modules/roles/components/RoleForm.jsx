// modules/roles/components/RoleForm.jsx

/**
 * Campos de cabecera del formulario de rol (nombre, slug, descripción).
 * Compartido por CreateRoleModal y EditRoleModal.
 *
 * @param {{
 *   name: string,
 *   slug: string,
 *   description: string,
 *   onNameChange: (v: string) => void,
 *   onSlugChange: (v: string) => void,
 *   onDescriptionChange: (v: string) => void,
 *   readOnly?: boolean,
 * }} props
 */
export default function RoleForm({
  name,
  slug,
  description,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
  readOnly = false,
}) {
  /** Genera un slug válido a partir del nombre */
  const handleNameChange = (e) => {
    const val = e.target.value;
    onNameChange(val);
    // Autogenerar slug solo si readOnly es false
    if (!readOnly) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
      onSlugChange(generated);
    }
  };

  return (
    <div className="space-y-4">
      {/* Nombre + Slug en dos columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre del Rol */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nombre del Rol
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={handleNameChange}
            readOnly={readOnly}
            placeholder="Ej. Regional Supervisor"
            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5
                       text-sm text-slate-700 placeholder:text-slate-400
                       outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                       read-only:bg-slate-50 transition-shadow"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Identificador Único (Slug)
          </label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            readOnly={readOnly}
            placeholder="regional_supervisor"
            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5
                       text-sm font-mono text-slate-600 bg-slate-50
                       outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                       transition-shadow"
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Descripción
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          readOnly={readOnly}
          placeholder="Describe el propósito y alcance de este rol…"
          className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5
                     text-sm text-slate-700 placeholder:text-slate-400
                     outline-none resize-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                     read-only:bg-slate-50 transition-shadow"
        />
      </div>
    </div>
  );
}