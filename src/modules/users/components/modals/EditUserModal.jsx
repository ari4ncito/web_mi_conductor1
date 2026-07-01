import { useEffect, useState } from 'react';

export default function EditUserModal({ user, open, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Administrador', status: 'active' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Administrador',
        status: user.status || 'active',
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...user, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Editar usuario</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{user.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Nombre
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Correo electrónico
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Rol asignado
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="Administrador">Administrador</option>
                <option value="Operador">Operador</option>
                <option value="Visualizador">Visualizador</option>
              </select>
            </label>
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Estado</p>
              <div className="flex flex-wrap gap-3">
                {['active', 'inactive'].map((option) => {
                  const selected = form.status === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, status: option }))}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {option === 'active' ? 'Activo' : 'Inactivo'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}