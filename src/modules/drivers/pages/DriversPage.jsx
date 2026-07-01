import { useState, useMemo } from 'react';
import DriverTable from '../components/DriverTable';
import EditDriverModal from '../components/modals/EditDriverModal';
import RegisterDriverModal from '../components/modals/RegisterDriverModal';
import DriverDetailsModal from '../components/modals/DriverDetailsModal';
import { getDrivers } from '../services/driverStorage';

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="6" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
}

function NotificationIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
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

  // Calculamos estadísticas
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
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                          d.license.toLowerCase().includes(search.toLowerCase());
      
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

  const handleUpdateDriver = (updatedDriver) => {
    setDrivers(getDrivers());
  };

  const handleRegisterDriver = (newDriver) => {
    setDrivers(getDrivers());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-2">
              Admin › Servicios › Gestión de Conductores
            </p>
            <h1 className="text-4xl font-bold text-slate-800">Gestión de Conductores</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition">
              & Exportar Lista
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              <PlusIcon className="w-5 h-5" />
              Registrar Conductor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Drivers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">Conductores Totales</h3>
              <span className="text-teal-500 text-xs font-semibold">+12%</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.total.toLocaleString()}</p>
          </div>

          {/* Active Now */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">Activos Ahora</h3>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-slate-800">{stats.activeNow}</p>
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          {/* Avg Rating */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">Calificación Promedio</h3>
              <span className="text-amber-500">★</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.avgRating}</p>
          </div>

          {/* Expired Licenses */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-500 uppercase">Licencias Vencidas</h3>
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xs">!</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.expiredLicenses}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, licencia o estado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Driver Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <DriverTable
            drivers={filteredDrivers}
            currentPage={currentPage}
            pageSize={10}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="font-serif font-bold text-orange-800 text-lg">Mi Conductor</span>
            <p className="text-slate-400 text-sm mt-1">© 2024 Mi Conductor. Premium Driving Solutions.</p>
          </div>
          <nav className="flex gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-orange-600 transition">Política de Privacidad</a>
            <a href="#" className="hover:text-orange-600 transition">Términos de Servicio</a>
            <a href="#" className="hover:text-orange-600 transition">Centro de Ayuda</a>
          </nav>
        </footer>
      </div>

      {/* Modales */}
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
    </div>
  );
}
