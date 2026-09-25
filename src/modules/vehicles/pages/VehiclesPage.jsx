import { useState, useMemo } from 'react';
import VehicleTable from '../components/VehicleTable';
import EditVehicleModal from '../components/modals/EditVehicleModal';
import RegisterVehicleModal from '../components/modals/RegisterVehicleModal';
import VehicleDetailsModal from '../components/modals/VehicleDetailsModal';
import DeleteVehicleModal from '../components/modals/DeleteVehicleModal';
import VehiculoService from '../services/VehiculoService';
import { useEffect } from 'react';

const colors = {
  background: '#f3f6fb',
  surface: '#ffffff',
  text: '#111111',
  textMuted: '#667085',
  border: 'rgba(27, 46, 61, 0.08)',
  accent: '#ff9a2f',
  success: '#2cc04f',
};



function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
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
        flex: '1 1 200px',
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          borderRadius: 10,
          background: '#f0f5ff',
          border: '1px solid rgba(27, 46, 61, 0.08)',
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SearchIcon size={16} />
        </span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar vehículo..."
          style={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 13,
            color: '#111111',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  )
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await VehiculoService.getAll();
      const data = res.data || res;
      setVehicles(Array.isArray(data) ? data : (data.vehiculos || data.rows || []));
    } catch (err) {
      console.error(err);
      setError('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.toLowerCase();
      // En backend, placa, marca, y dueño (cliente.usuario.nombre)
      const placa = (v.placa || '').toLowerCase();
      const marca = (v.marca || '').toLowerCase();
      const owner = (v.cliente?.usuario?.nombre || '') + ' ' + (v.cliente?.usuario?.apellido || '');
      
      const matchesSearch = placa.includes(q) || marca.includes(q) || owner.toLowerCase().includes(q);
      
      if (filter === 'all') return matchesSearch;
      if (filter === 'active') return matchesSearch && v.estado === true;
      if (filter === 'off-duty') return matchesSearch && v.estado === false;
      return matchesSearch;
    });
  }, [vehicles, search, filter]);

  const handleRegisterVehicle = async () => {
    await fetchVehicles();
    setShowRegisterModal(false);
  };

  const handleUpdateVehicle = async () => {
    await fetchVehicles();
    setShowEditModal(false);
    setShowDetailsModal(false);
  };

  const handleDeleteVehicle = async () => {
    await fetchVehicles();
    setShowDeleteModal(false);
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
    const active = vehicles.filter(v => v.estado === true).length;
    const maintenance = vehicles.filter(v => v.estado === false).length; // Inactivos o fuera de servicio
    return { total, active, maintenance };
  }, [vehicles]);

  return (
    <main style={{ flex: 1, minWidth: 0, padding: '24px', boxSizing: 'border-box' }}>
      <section style={{ background: colors.surface, borderRadius: 28, border: `1px solid ${colors.border}`, boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 24px', borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
          <SearchPill value={search} onChange={setSearch} />
          
          <button
            onClick={() => setShowRegisterModal(true)}
            style={{
              height: 36,
              borderRadius: 10,
              border: 'none',
              background: colors.accent,
              color: '#111111',
              padding: '0 16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(255, 154, 47, 0.25)',
              cursor: 'pointer',
            }}
          >
            <PlusIcon />
            <span>Registrar Vehículo</span>
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          <VehicleTable
            vehicles={filteredVehicles}
            currentPage={currentPage}
            pageSize={5}
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