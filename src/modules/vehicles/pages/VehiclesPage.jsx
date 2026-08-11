import { useState, useMemo } from 'react';
import VehicleTable from '../components/VehicleTable';
import EditVehicleModal from '../components/modals/EditVehicleModal';
import RegisterVehicleModal from '../components/modals/RegisterVehicleModal';
import VehicleDetailsModal from '../components/modals/VehicleDetailsModal';
import DeleteVehicleModal from '../components/modals/DeleteVehicleModal';
import { getVehicles } from '../services/vehicleStorage';

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
  success: '#2cc04f',
};

function BreadcrumbArrow() {
  return (
    <svg viewBox="0 0 8 12" width="8" height="12" aria-hidden="true">
      <path d="M2 1.5 5.5 6 2 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: '#2b2b2b' }}>
      <path d="M12 4a4.5 4.5 0 0 0-4.5 4.5V11c0 .8-.3 1.6-.8 2.1L5.5 15h13l-1.2-1.9c-.5-.5-.8-1.3-.8-2.1V8.5A4.5 4.5 0 0 0 12 4Z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M10 18.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MetricCard({ label, value, detail, accent = false }) {
  return (
    <article
      style={{
        minHeight: 112,
        borderRadius: 24,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 22px rgba(21, 42, 53, 0.06)',
        padding: 18,
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
  )
}

function HeaderAction({ children, width = 40, height = 40, background = colors.surface }) {
  return (
    <button
      type="button"
      style={{
        width,
        height,
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        background,
        display: 'grid',
        placeItems: 'center',
        padding: 0,
        color: '#2b2b2b',
      }}
    >
      {children}
    </button>
  )
}

function SearchIcon({ size = 18, color = '#b3b7bf' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ color }}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SearchPill({ value, onChange }) {
  return (
    <div
      style={{
        width: 250,
        height: 66,
        borderRadius: 18,
        background: '#dfeeff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        padding: '0 18px',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ width: 18, display: 'inline-flex', flexShrink: 0 }}>
        <SearchIcon size={18} color="#9aa5b1" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar vehículo..."
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 18,
          lineHeight: 1.15,
          color: '#1f2937',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(getVehicles());
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.toLowerCase();
      const matchesSearch = v.name.toLowerCase().includes(q) ||
        v.licensePlate.toLowerCase().includes(q) ||
        v.owner.toLowerCase().includes(q);
      if (filter === 'all') return matchesSearch;
      return matchesSearch && v.status === filter;
    });
  }, [vehicles, search, filter]);

  const handleRegisterVehicle = () => {
    setVehicles(getVehicles());
  };

  const handleUpdateVehicle = () => {
    setVehicles(getVehicles());
  };

  const handleDeleteVehicle = () => {
    setVehicles(getVehicles());
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailsModal(true);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleDeleteRequest = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const stats = useMemo(() => {
    const total = vehicles.length;
    const active = vehicles.filter(v => v.status === 'active').length;
    const maintenance = vehicles.filter(v => v.status === 'maintenance').length;
    return { total, active, maintenance };
  }, [vehicles]);

  return (
    <main style={{ flex: 1, minWidth: 0, height: '100vh', overflowY: 'auto', padding: '20px 18px 24px 20px', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 20 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b8f81', fontSize: 16 }}>
            <span>Admin</span>
            <BreadcrumbArrow />
            <span>Servicios</span>
            <BreadcrumbArrow />
            <span style={{ color: '#bb6a00', fontWeight: 700 }}>Gestión de Vehículos</span>
          </div>
          <h1 style={{ margin: '8px 0 0', fontSize: 22, lineHeight: 1.1, fontWeight: 400, color: '#111111', fontFamily: 'Georgia, Times New Roman, serif' }}>Gestión de Vehículos</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 2 }}>
          <button
            onClick={() => setShowRegisterModal(true)}
            style={{
              minWidth: 192,
              height: 44,
              borderRadius: 14,
              background: colors.accent,
              color: '#111111',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '0 18px',
              fontSize: 16,
              fontWeight: 400,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)',
            }}
          >
            <PlusIcon />
            <span>Registrar Vehículo</span>
          </button>
          <HeaderAction width={40} height={44} background="#dceafb">
            <BellIcon />
          </HeaderAction>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, marginBottom: 20 }}>
        <MetricCard label="Total Vehículos" value={stats.total.toLocaleString()} detail="Flota completa" accent />
        <MetricCard label="Activos" value={stats.active.toLocaleString()} detail="En circulación" />
        <MetricCard label="En Mantenimiento" value={stats.maintenance.toLocaleString()} detail="Requieren atención" />
      </section>

      <section style={{ background: colors.surface, borderRadius: 28, border: `1px solid ${colors.border}`, boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {['all', 'active', 'off-duty'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  height: 44,
                  borderRadius: 12,
                  border: 0,
                  background: filter === f ? colors.accent : '#dceafb',
                  color: filter === f ? '#111111' : '#1f2937',
                  padding: '0 18px',
                  fontSize: 15,
                  fontWeight: filter === f ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {f === 'all' ? `Todos (${vehicles.length})` : f === 'active' ? 'Activos' : 'Fuera Servicio'}
              </button>
            ))}
          </div>
          <SearchPill value={search} onChange={setSearch} />
        </div>

        <div style={{ background: '#edf3fa' }}>
          <VehicleTable
            vehicles={filteredVehicles}
            currentPage={currentPage}
            pageSize={10}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        </div>
      </section>

      <EditVehicleModal
        vehicle={selectedVehicle}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateVehicle}
      />

      <RegisterVehicleModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterVehicle}
      />
      <VehicleDetailsModal
        vehicle={selectedVehicle}
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onUpdate={handleUpdateVehicle}
      />
      <DeleteVehicleModal
        vehicle={selectedVehicle}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteVehicle}
      />
    </main>
  );
}