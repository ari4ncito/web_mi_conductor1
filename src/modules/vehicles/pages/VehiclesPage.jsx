import { useState, useMemo } from 'react';
import VehicleTable from '../components/VehicleTable';
import RegisterVehicleModal from '../components/modals/RegisterVehicleModal';
import VehicleDetailsModal from '../components/modals/VehicleDetailsModal';
import { getVehicles } from '../services/vehicleStorage';

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

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(getVehicles());
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
                          v.owner.toLowerCase().includes(search.toLowerCase());
      
      if (filter === 'all') return matchesSearch;
      return matchesSearch && v.status === filter;
    });
  }, [vehicles, search, filter]);

  const handleRegisterVehicle = (newVehicle) => {
    setVehicles(getVehicles());
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles(getVehicles());
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-2">
              Admin › Servicios › Gestión de Vehículos
            </p>
            <h1 className="text-4xl font-bold text-slate-800">Gestión de Vehículos</h1>
            <p className="text-slate-500 mt-3 max-w-lg">
              Organiza y monitorea tu flota premium y las asignaciones de conductores.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition">
              <NotificationIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              <PlusIcon className="w-5 h-5" />
              Registrar Vehículo
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por placa, modelo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 outline-none transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  filter === 'all'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todos los vehículos ({vehicles.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  filter === 'active'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => setFilter('maintenance')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  filter === 'maintenance'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mantenimiento
              </button>
              <button
                onClick={() => setFilter('off-duty')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  filter === 'off-duty'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Fuera de servicio
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
          <VehicleTable
            vehicles={filteredVehicles}
            currentPage={currentPage}
            pageSize={10}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
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

      {/* Modals */}
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
    </div>
  );
}
