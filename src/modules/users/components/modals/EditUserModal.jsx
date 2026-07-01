import { useEffect, useState } from "react";
import { getRoles } from "../../../roles/services/roleStorage";

export default function EditUserModal({
  user,
  open,
  onClose,
  onSave,
}) {
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "active",
  });

  useEffect(() => {
    setRoles(getRoles());

    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        status: user.status || "active",
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...user,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Editar Usuario
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {user.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-slate-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">
                Nombre
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                Correo
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">
                Rol
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              >
                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.name}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">
                Estado
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border p-3"
              >
                <option value="active">
                  Activo
                </option>

                <option value="inactive">
                  Inactivo
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3 font-semibold"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}