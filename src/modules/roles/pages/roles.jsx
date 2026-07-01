// modules/roles/pages/Roles.jsx
import { useEffect, useMemo, useState } from 'react';
import './RolesPage.css';
import ModulePage from '../../../components/common/ModulePage/ModulePage.jsx';
import RoleTable from '../components/RoleTable';
import CreateRoleModal from '../components/modals/CreateRoleModal';
import EditRoleModal from '../components/modals/EditRoleModal';
import RoleDetailsModal from '../components/modals/RoleDetailsModal';
import ChangeStatusModal from '../components/modals/ChangeStatusModal';
import { getRoles } from '../services/roleStorage';

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
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredRoles = useMemo(
    () => roles.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    ),
    [roles, search]
  );

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
    if (role.system) { alert('El rol Administrador permanece siempre activo.'); return; }
    setSelectedRole(role);
    setShowStatus(true);
  };

  return (
    <ModulePage
      label="Roles"
      title="Gestión de Roles"
      description="Administra roles y permisos de acceso del sistema."
    >
      <div style={{ display: 'grid', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 14, border: 'none', background: '#ff9a2f', color: '#111111', padding: '0 22px', height: 44, fontWeight: 600, boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)' }}
            >
              <PlusIcon className="w-4 h-4" />
              Nuevo rol
            </button>
            <button
              type="button"
              aria-label="Notificaciones"
              style={{ width: 44, height: 44, borderRadius: 14, border: '1px solid rgba(27, 46, 61, 0.08)', background: '#f3f6fb', display: 'grid', placeItems: 'center' }}
            >
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <StatCard
            iconBg="bg-cyan-100"
            icon={<ShieldCheckIcon className="w-6 h-6 text-cyan-600" />}
            badge="ACTIVO"
            badgeColor="bg-teal-50 text-teal-700"
            caption="Roles totales"
            value={roles.length}
          />
          <StatCard
            iconBg="bg-orange-100"
            icon={<ShieldCheckIcon className="w-6 h-6 text-orange-500" />}
            badge="+2 Hoy"
            badgeColor="text-orange-600 font-semibold text-xs"
            caption="Permisos totales"
            value={totalPermissions}
          />
          <StatCard
            iconBg="bg-slate-100"
            icon={<HistoryIcon className="w-6 h-6 text-slate-500" />}
            caption="Roles activos"
            subValue={activeRoles}
            extra={<AvatarStack count={2} extra={5} />}
          />
        </div>

        <section style={{ background: '#ffffff', borderRadius: 28, border: '1px solid rgba(27, 46, 61, 0.08)', boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '24px' }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111111' }}>Roles del sistema</h3>
              <p style={{ margin: '10px 0 0', color: '#667085', fontSize: 15 }}>Busca y administra los roles activos del sistema.</p>
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 16, background: '#f0f5ff', border: '1px solid rgba(27, 46, 61, 0.08)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, color: '#9aa5b1' }}>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar roles"
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: '#111111' }}
                />
              </div>
            </div>
          </div>
          <div style={{ padding: '24px' }}>
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
        </section>
      </div>

      {/* ── Modales ───────────────────────────────────────────────────── */}
      <footer className="roles-page__footer">
        <div className="roles-page__footer-brand">
          <span className="font-serif font-bold text-orange-700 text-sm">Mi Conductor</span>
          <span className="text-slate-400 text-xs">
            © 2024 Mi Conductor. Soluciones de movilidad.
          </span>
        </div>
        <nav className="roles-page__footer-links">
          {['Privacidad', 'Términos', 'Ayuda'].map((l) => (
            <a key={l} href="#">
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
    </ModulePage>
  );
}