import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DriverTable from '../components/DriverTable';
import EditDriverModal from '../components/modals/EditDriverModal';
import RegisterDriverModal from '../components/modals/RegisterDriverModal';
import DriverDetailsModal from '../components/modals/DriverDetailsModal';
import { getDrivers } from '../services/driverStorage';

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
        minHeight: 96,
        borderRadius: 20,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 8px 18px rgba(21, 42, 53, 0.06)',
        padding: '16px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ color: '#252525', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 400 }}>{label}</div>
        <div style={{ marginTop: 6, color: colors.text, fontSize: 17, fontWeight: 400 }}>{value}</div>
      </div>
      <div style={{ color: accent ? '#b96a00' : colors.text, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        {accent ? <span style={{ color: '#c97300' }}>↗</span> : null}
        <span style={{ fontSize: 14 }}>{detail}</span>
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
        flexShrink: 0,
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
        width: 230,
        height: 44,
        borderRadius: 14,
        background: '#dfeeff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        padding: '0 16px',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <span style={{ width: 16, display: 'inline-flex', flexShrink: 0 }}>
        <SearchIcon size={16} color="#9aa5b1" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar conductor..."
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 15,
          lineHeight: 1.15,
          color: '#1f2937',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState(getDrivers());
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const stats = useMemo(() => {
    const total = drivers.length;
    const activeNow = drivers.filter(d => d.currentState === 'in-route').length;
    const avgRating = total > 0 
      ? (drivers.reduce((sum, d) => sum + d.performance, 0) / total).toFixed(2)
      : 0;
    const expiredLicenses = drivers.filter(d => d.licenseStatus === 'Expired').length;
    return { total, activeNow, avgRating, expiredLicenses };
  }, [drivers]);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const q = search.toLowerCase();
      const matchesSearch = d.name.toLowerCase().includes(q) || 
                          d.license.toLowerCase().includes(q);
      if (filter === 'all') return matchesSearch;
      return matchesSearch && d.currentState === filter;
    });
  }, [drivers, search, filter]);

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsModal(true);
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
  };

  const handleUpdateDriver = () => {
    setDrivers(getDrivers());
  };

  const handleRegisterDriver = () => {
    setDrivers(getDrivers());
  };

  return (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        height: '100vh',
        maxHeight: '100vh',
        padding: '20px 24px 16px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 18, flexShrink: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b8f81', fontSize: 14 }}>
            <span>Admin</span>
            <BreadcrumbArrow />
            <span>Servicios</span>
            <BreadcrumbArrow />
            <span style={{ color: '#bb6a00', fontWeight: 700 }}>Gestión de Conductores</span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 20, lineHeight: 1.1, fontWeight: 400, color: '#111111', fontFamily: 'Georgia, Times New Roman, serif' }}>Gestión de Conductores</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 2, flexShrink: 0 }}>
          <button
            onClick={() => setShowRegisterModal(true)}
            style={{
              minWidth: 180,
              height: 42,
              borderRadius: 14,
              background: colors.accent,
              color: '#111111',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '0 18px',
              fontSize: 15,
              fontWeight: 400,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 18px rgba(255, 154, 47, 0.28)',
              flexShrink: 0,
            }}
          >
            <PlusIcon />
            <span>Registrar Conductor</span>
          </button>
          <HeaderAction width={40} height={42} background="#dceafb">
            <BellIcon />
          </HeaderAction>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 18, flexShrink: 0 }}>
        <MetricCard label="Conductores Totales" value={stats.total.toLocaleString()} detail="+12% este mes" accent />
        <MetricCard label="Activos Ahora" value={stats.activeNow.toLocaleString()} detail="En ruta" />
        <MetricCard label="Calificación Promedio" value={stats.avgRating} detail="De 5.00" />
        <MetricCard label="Licencias Vencidas" value={stats.expiredLicenses.toLocaleString()} detail="Requieren atención" />
      </section>

      <section
        style={{
          background: colors.surface,
          borderRadius: 24,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '16px 20px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {['all', 'in-route', 'available', 'off-duty'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  height: 40,
                  borderRadius: 12,
                  border: 0,
                  background: filter === f ? colors.accent : '#dceafb',
                  color: filter === f ? '#111111' : '#1f2937',
                  padding: '0 16px',
                  fontSize: 14,
                  fontWeight: filter === f ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {f === 'all' ? `Todos (${drivers.length})` : f === 'in-route' ? 'En Ruta' : f === 'available' ? 'Disponibles' : 'Fuera Servicio'}
              </button>
            ))}
          </div>
          <SearchPill value={search} onChange={setSearch} />
        </div>

        <div style={{ background: '#edf3fa', flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <DriverTable
            drivers={filteredDrivers}
            currentPage={currentPage}
            pageSize={10}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
          />
        </div>
      </section>

      <DriverDetailsModal
        driver={selectedDriver}
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onUpdate={handleUpdateDriver}
      />
      <EditDriverModal
        driver={selectedDriver}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateDriver}
      />
      <RegisterDriverModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegisterDriver}
      />
    </main>
  );
}