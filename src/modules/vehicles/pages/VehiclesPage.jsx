import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import VehicleTable from '../components/VehicleTable';
const DeleteVehicleModal = lazy(() => import('../components/modals/DeleteVehicleModal'));
const VehicleConfirmDialog = lazy(() => import('../components/modals/VehicleConfirmDialog'));
const VehicleImagesModal = lazy(() => import('../components/modals/VehicleImagesModal'));
const ChangeVehicleStatusModal = lazy(() => import('../components/modals/ChangeVehicleStatusModal'));
import VehiculoService from '../services/VehiculoService';
import exportVehiclesExcel from '../utils/exportVehiclesExcel';

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

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15V3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
          placeholder="Buscar vehículo por placa, marca, modelo, dueño, color..."
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
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [imagesVehicle, setImagesVehicle] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusModalVehicle, setStatusModalVehicle] = useState(null);

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

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      const timer = setTimeout(() => setSuccess(''), 4000);
      // Clean history state so reload doesn't re-show the message
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

const formatExpDateForSearch = (dateValue) => {
  if (!dateValue) return '';
  const cleanStr = String(dateValue).split('T')[0];
  const parts = cleanStr.split('-');
  let targetDate;
  if (parts.length === 3) {
    targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    targetDate = new Date(dateValue);
  }
  if (isNaN(targetDate.getTime())) return cleanStr;
  targetDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = String(targetDate.getDate()).padStart(2, '0');
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const year = targetDate.getFullYear();
  const isExpired = targetDate.getTime() < today.getTime();
  return `${day}/${month}/${year} ${cleanStr} ${isExpired ? 'vencido vencida' : 'vigente'}`;
};

  const filteredVehicles = useMemo(() => {
    const searchWords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return vehicles.filter((v) => {
      const vStatus = v.estadoVehiculo || (v.estado === false ? 'inactivo' : 'activo');

      // 1. Filtro por estatus
      if (filter === 'active' && vStatus !== 'activo') return false;
      if (filter === 'en_mantenimiento' && vStatus !== 'en_mantenimiento') return false;
      if (filter === 'inactive' && vStatus !== 'inactivo') return false;
      if (filter === 'vendido' && vStatus !== 'vendido') return false;
      // Por defecto en "all": NO listar los vehículos que ya están vendidos
      if (filter === 'all' && vStatus === 'vendido') return false;

      // 2. Búsqueda por todas las columnas de la tabla
      if (searchWords.length === 0) return true;

      const ownerName = `${v.cliente?.usuario?.nombre || v.cliente?.nombre || ''} ${v.cliente?.usuario?.apellido || v.cliente?.apellido || ''}`.trim();
      const ownerDoc = v.cliente?.usuario?.documento || v.cliente?.documento || '';
      const ownerEmail = v.cliente?.usuario?.correo || v.cliente?.correo || '';
      const ownerPhone = v.cliente?.usuario?.telefono || v.cliente?.telefono || '';
      const soatStr = formatExpDateForSearch(v.fechaVencimientoSoat || v.soatVencimiento);
      const tecnoStr = formatExpDateForSearch(v.fechaVencimientoTecnomecanica || v.tecnomecanicaVencimiento);
      const estadoStr = `${vStatus} ${v.estado ? 'activo' : 'inactivo'}`;

      const searchableText = [
        v.marca || '',
        v.modelo || '',
        v.placa || '',
        v.matricula || '',
        v.tipoVehiculo || '',
        v.color || '',
        v.anio ? String(v.anio) : '',
        v.numeroChasis || '',
        v.tipoCombustible || '',
        ownerName,
        ownerDoc,
        ownerEmail,
        ownerPhone,
        soatStr,
        tecnoStr,
        estadoStr,
      ].join(' ').toLowerCase();

      return searchWords.every((word) => searchableText.includes(word));
    });
  }, [vehicles, search, filter]);

  const handleDeleteVehicle = async (msg) => {
    await fetchVehicles();
    setShowDeleteModal(false);
    if (msg && typeof msg === 'string') {
      setSuccess(msg);
      setTimeout(() => setSuccess(''), 4000);
    }
  };

  const handleError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  const handleStatusChanged = async (vehicleId, nuevoEstado, motivo) => {
    await VehiculoService.cambiarEstado(vehicleId, {
      estadoVehiculo: nuevoEstado,
      motivo
    });
    setSuccess(`Estado del vehículo actualizado correctamente a '${nuevoEstado}'.`);
    setTimeout(() => setSuccess(''), 4000);
    await fetchVehicles();
  };

  const handleViewDetails = (vehicle) => {
    navigate(`/vehicles/${vehicle._id}`, { state: { vehicle } });
  };

  const handleEdit = (vehicle) => {
    navigate(`/vehicles/${vehicle._id}/edit`, { state: { vehicle } });
  };

  const handleDeleteRequest = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const stats = useMemo(() => {
    const listable = vehicles.filter(v => (v.estadoVehiculo || (v.estado ? 'activo' : 'inactivo')) !== 'vendido');
    const total = listable.length;
    const active = listable.filter(v => (v.estadoVehiculo || (v.estado ? 'activo' : 'inactivo')) === 'activo').length;
    const maintenance = listable.filter(v => (v.estadoVehiculo || (v.estado ? 'activo' : 'inactivo')) === 'en_mantenimiento').length;
    return { total, active, maintenance };
  }, [vehicles]);

  return (
    <main className="p-3 sm:p-5 lg:p-6" style={{ flex: 1, minWidth: 0, boxSizing: 'border-box' }}>
      {/* MENSAJES DE ESTADO */}
      {error && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: 10,
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: 10,
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          {success}
        </div>
      )}

      <section style={{ background: colors.surface, borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <div className="p-3 sm:p-4 lg:p-[18px_24px]" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 340px', flexWrap: 'wrap' }}>
            <SearchPill
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
            />

            <div style={{ position: 'relative', minWidth: 160 }}>
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  height: 38,
                  padding: '0 32px 0 14px',
                  borderRadius: 10,
                  background: '#f0f5ff',
                  border: '1px solid rgba(27, 46, 61, 0.08)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#111111',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  fontFamily: 'inherit',
                }}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="en_mantenimiento">En Mantenimiento</option>
                <option value="inactive">Inactivos</option>
                <option value="vendido">Vendidos (Historial)</option>
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#667085',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
            <button
              onClick={() => exportVehiclesExcel(filteredVehicles)}
              disabled={filteredVehicles.length === 0}
              className="w-full sm:w-auto"
              title="Descargar listado en Excel"
              style={{
                height: 36,
                borderRadius: 10,
                border: '1px solid rgba(27, 46, 61, 0.12)',
                background: '#fff',
                color: '#166534',
                padding: '0 14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                fontSize: 13,
                fontWeight: 500,
                cursor: filteredVehicles.length === 0 ? 'not-allowed' : 'pointer',
                opacity: filteredVehicles.length === 0 ? 0.5 : 1,
              }}
            >
              <DownloadIcon />
              <span>Exportar Excel</span>
            </button>

            {hasPermission('crear.vehiculos') && (
              <button
                onClick={() => navigate('/vehicles/new')}
                className="w-full sm:w-auto"
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
            )}
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6 overflow-hidden">
          <VehicleTable
            vehicles={filteredVehicles}
            currentPage={currentPage}
            pageSize={5}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onEdit={hasPermission('editar.vehiculos') ? handleEdit : undefined}
            onDelete={hasPermission('eliminar.vehiculos') ? handleDeleteRequest : undefined}
            onChangeStatus={hasPermission('editar.vehiculos') ? ((v) => setStatusModalVehicle(v)) : undefined}
            onToggleStatus={hasPermission('editar.vehiculos') ? ((v) => setStatusModalVehicle(v)) : undefined}
            onOpenPhotos={(v) => setImagesVehicle(v)}
          />
        </div>
      </section>

      <Suspense fallback={null}>
        {imagesVehicle && (
          <VehicleImagesModal
            vehicle={imagesVehicle}
            open={Boolean(imagesVehicle)}
            onClose={() => setImagesVehicle(null)}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {showDeleteModal && (
          <DeleteVehicleModal
            vehicle={selectedVehicle}
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDeleteVehicle}
            onError={handleError}
          />
        )}
      </Suspense>
      
      <Suspense fallback={null}>
        {statusModalVehicle && (
          <ChangeVehicleStatusModal
            vehicle={statusModalVehicle}
            onClose={() => setStatusModalVehicle(null)}
            onStatusChanged={handleStatusChanged}
          />
        )}
      </Suspense>
    </main>
  );
}
// viven en listen
