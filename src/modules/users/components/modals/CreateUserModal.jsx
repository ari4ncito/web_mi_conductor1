import { useEffect, useState } from "react";
import { createUser } from "../../services/userStorage";
import { getRoles } from "../../../roles/services/roleStorage";

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}) {
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  });

  useEffect(() => {
    if (open) {
      const availableRoles = getRoles();

      setRoles(availableRoles);

      setForm({
        name: "",
        email: "",
        phone: "",
        role: availableRoles[0]?.name || "",
        status: "active",
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createUser(form);

    onCreated();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl bg-white shadow-2xl"
        style={{ maxWidth: 'min(640px, calc(100% - 64px))' }}
      >
        <div className="border-b px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            Nuevo usuario
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Crear usuario
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label className="text-sm font-medium">
              Nombre
            </label>

            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Correo
            </label>

            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Teléfono
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label className="text-sm font-medium">
                Rol
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border px-4 py-3"
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
              <label className="text-sm font-medium">
                Estado
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border px-4 py-3"
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

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-3"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Crear usuario
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}