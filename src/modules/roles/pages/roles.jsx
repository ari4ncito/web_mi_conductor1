// modules/roles/pages/Roles.jsx
import { useEffect, useMemo, useState } from 'react';
import RoleTable      from '../components/RoleTable';
import CreateRoleModal from '../components/modals/CreateRoleModal';
import EditRoleModal   from '../components/modals/EditRoleModal';
import RoleDetailsModal from '../components/modals/RoleDetailsModal';
import ChangeStatusModal from '../components/modals/ChangeStatusModal';
import { getRoles }   from '../services/roleStorage';

const PAGE_SIZE = 3;

// ─── Iconos inline ───────────────────────────────────────────────────────────
function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
function HistoryIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function BellIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
    </svg>
  );
}
function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

// ─── Tarjeta de estadística ───────────────────────────────────────────────────
function StatCard({ iconBg, icon, badge, badgeColor, caption, value, subValue, extra }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </span>
        {badge && (
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {caption}
      </p>
      {value !== undefined && (
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      )}
      {subValue && (
        <p className="text-lg font-semibold text-slate-900">{subValue}</p>
      )}
      {extra}
    </div>
  );
}

// ─── Avatar stack ─────────────────────────────────────────────────────────────
function AvatarStack({ count = 2, extra = 5 }) {
  const colors = ['bg-teal-500', 'bg-slate-600', 'bg-blue-500'];
  return (
    <div className="flex items-center -space-x-2 mt-4">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`w-7 h-7 rounded-full border-2 border-white ${colors[i % colors.length]}`}
        />
      ))}
      {extra > 0 && (
        <span className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 text-slate-500 text-[10px] font-semibold flex items-center justify-center">
          +{extra}
        </span>
      )}
    </div>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function Roles() {
  const [roles,        setRoles]        = useState([]);
  const [search,       setSearch]       = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showCreate,   setShowCreate]   = useState(false);
  const [showEdit,     setShowEdit]     = useState(false);
  const [showDetails,  setShowDetails]  = useState(false);
  const [showStatus,   setShowStatus]   = useState(false);

  const loadRoles = () => setRoles(getRoles());

  useEffect(() => { loadRoles(); }, []);

  /* Reiniciar paginación al buscar */
  const filteredRoles = useMemo(() => {
    setCurrentPage(1);
    return roles.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, search]);

  /* Página actual */
  const pagedRoles = useMemo(() => {
    const from = (currentPage - 1) * PAGE_SIZE;
    return filteredRoles.slice(from, from + PAGE_SIZE);
  }, [filteredRoles, currentPage]);

  /* Stats */
  const totalPermissions = useMemo(
    () => roles.reduce((s, r) => s + (r.permissions ? Object.keys(r.permissions).length : 0), 0),
    [roles]
  );
  const activeRoles = useMemo(() => roles.filter((r) => r.status === 'active').length, [roles]);

  /* Handlers */
  const handleEdit = (role) => {
    if (role.system) { alert('El rol Administrador no puede modificarse.'); return; }
    setSelectedRole(role);
    setShowEdit(true);
  };
  const handleDetails = (role) => { setSelectedRole(role); setShowDetails(true); };
  const handleStatus  = (role) => {
    if (role.system) { alert('El rol Administrador siempre debe permanecer activo.'); return; }
    setSelectedRole(role);
    setShowStatus(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Cabecera / Topbar ─────────────────────────────────────────── */}
      <div className="px-10 pt-8 pb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          {/* Breadcrumb */}
          <p className="text-xs text-slate-400 mb-2">
            Admin &rsaquo; Servicios &rsaquo;{' '}
            <span className="text-orange-600 font-medium">Gestión de Roles</span>
          </p>
          {/* Título */}
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Role Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón nuevo rol */}
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                       text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            New Role
          </button>

          {/* Bell */}
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative w-10 h-10 rounded-full bg-blue-50 text-blue-600
                       flex items-center justify-center hover:bg-blue-100 transition-colors"
          >
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {/* ── Contenido ─────────────────────────────────────────────────── */}
      <div className="px-10 pb-10 flex-1 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total roles */}
          <StatCard
            iconBg="bg-cyan-100"
            icon={<ShieldCheckIcon className="w-6 h-6 text-cyan-600" />}
            badge="ACTIVE"
            badgeColor="bg-teal-50 text-teal-700"
            caption="Total System Roles"
            value={roles.length}
          />

          {/* Permission toggles */}
          <StatCard
            iconBg="bg-orange-100"
            icon={<ShieldCheckIcon className="w-6 h-6 text-orange-500" />}
            badge="+2 Today"
            badgeColor="text-orange-600 font-semibold text-xs"
            caption="Permission Toggles"
            value={totalPermissions}
          />

          {/* Audit log */}
          <StatCard
            iconBg="bg-slate-100"
            icon={<HistoryIcon className="w-6 h-6 text-slate-500" />}
            caption="Audit Log Status"
            subValue="All Systems Normal"
            extra={<AvatarStack count={2} extra={5} />}
          />
        </div>

        {/* Tabla de roles */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Header de la tabla */}
          <div className="flex items-center justify-between px-6 py-5 flex-wrap gap-3">
            <h2 className="font-serif text-lg font-semibold text-slate-900">
              System Roles
            </h2>
            {/* Buscador */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-64">
              <SearchIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter roles…"
                className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none w-full"
              />
            </div>
          </div>

          {/* Tabla con paginación */}
          <RoleTable
            roles={pagedRoles}
            onEdit={handleEdit}
            onDetails={handleDetails}
            onStatus={handleStatus}
            currentPage={currentPage}
            totalRoles={filteredRoles.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between px-10 py-6 border-t border-slate-100 flex-wrap gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-serif font-bold text-orange-700 text-sm">Mi Conductor</span>
          <span className="text-slate-400 text-xs">
            © 2024 Mi Conductor. Premium Driving Solutions.
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-slate-500">
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map((l) => (
            <a key={l} href="#" className="hover:text-slate-700 transition-colors underline-offset-2 hover:underline">
              {l}
            </a>
          ))}
        </nav>
      </footer>

      {/* ── Modales ───────────────────────────────────────────────────── */}
      <CreateRoleModal
        open={showCreate}
        onClose={() => { setShowCreate(false); loadRoles(); }}
        refresh={loadRoles}
      />
      <EditRoleModal
        role={selectedRole}
        open={showEdit}
        onClose={() => { setShowEdit(false); loadRoles(); }}
        refresh={loadRoles}
      />
      <RoleDetailsModal
        role={selectedRole}
        open={showDetails}
        onClose={() => setShowDetails(false)}
      />
      <ChangeStatusModal
        role={selectedRole}
        open={showStatus}
        onClose={() => { setShowStatus(false); loadRoles(); }}
        refresh={loadRoles}
      />
    </div>
  );
}