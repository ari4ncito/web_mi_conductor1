import { useEffect, useMemo, useState } from 'react';
import ModulePage from '../../../components/common/ModulePage/ModulePage.jsx';
import RoleTable from '../components/RoleTable';
import CreateRoleModal from '../components/modals/CreateRoleModal';
import EditRoleModal from '../components/modals/EditRoleModal';
import RoleDetailsModal from '../components/modals/RoleDetailsModal';
import ChangeStatusModal from '../components/modals/ChangeStatusModal';
import { getRoles } from '../services/roleStorage';

const PAGE_SIZE = 3;

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
};

function BellSVG() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2b2b2b" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function SearchSVG() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: '#9aa5b1' }}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusSVG() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111111" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function MetricCard({ label, value, detail, accent = false }) {
  return (
    <article
      style={{
        minHeight: 134,
        borderRadius: 24,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 22px rgba(21, 42, 53, 0.06)',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ color: '#252525', fontSize: 17, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 400 }}>{label}</div>
        <div style={{ marginTop: 10, color: colors.text, fontSize: 18, fontWeight: 400 }}>{value}</div>
      </div>
      <div style={{ color: accent ? '#b96a00' : colors.text, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        {accent ? <span style={{ color: '#c97300' }}>↗</span> : null}
        <span style={{ fontSize: 17 }}>{detail}</span>
      </div>
    </article>
  );
}

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
  useEffect(() => { setCurrentPage(1); }, [search]);

  const filteredRoles = useMemo(
    () => roles.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [roles, search]
  );

  const pagedRoles = useMemo(() => {
    const from = (currentPage - 1) * PAGE_SIZE;
    return filteredRoles.slice(from, from + PAGE_SIZE);
  }, [filteredRoles, currentPage]);

  const totalPermissions = useMemo(
    () => roles.reduce((s, r) => s + (r.permissions ? Object.keys(r.permissions).length : 0), 0),
    [roles]
  );
  const activeRoles = useMemo(() => roles.filter((r) => r.status === 'active').length, [roles]);

  const handleEdit = (role) => {
    if (role.system) { alert('El rol Administrador no puede modificarse.'); return; }
    setSelectedRole(role); setShowEdit(true);
  };
  const handleDetails = (role) => { setSelectedRole(role); setShowDetails(true); };
  const handleStatus  = (role) => {
    if (role.system) { alert('El rol Administrador permanece siempre activo.'); return; }
    setSelectedRole(role); setShowStatus(true);
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
              style={{ minWidth: 192, height: 44, borderRadius: 14, border: 'none', background: '#ff9a2f', color: '#111111', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 18px', fontSize: 16, fontWeight: 400, boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)', cursor: 'pointer' }}
            >
              <PlusSVG />
              Nuevo rol
            </button>
            <button
              type="button"
              aria-label="Notificaciones"
              style={{ width: 40, height: 44, borderRadius: 14, border: '1px solid rgba(27, 46, 61, 0.08)', background: '#dceafb', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
            >
              <BellSVG />
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          <MetricCard label="Roles totales" value={roles.length} detail="Activos en el sistema" />
          <MetricCard label="Permisos totales" value={totalPermissions} detail="En toda la plataforma" />
          <MetricCard label="Roles activos" value={activeRoles} detail="Operando actualmente" />
        </div>

        <section style={{ background: '#ffffff', borderRadius: 28, border: '1px solid rgba(27, 46, 61, 0.08)', boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '24px' }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#111111' }}>Roles del sistema</h3>
              <p style={{ margin: '10px 0 0', color: '#667085', fontSize: 15 }}>Busca y administra los roles activos del sistema.</p>
            </div>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderRadius: 16, background: '#f0f5ff', border: '1px solid rgba(27, 46, 61, 0.08)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18 }}>
                  <SearchSVG />
                </span>
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