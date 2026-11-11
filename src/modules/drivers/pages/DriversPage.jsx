import { useEffect, useState, useMemo, lazy, Suspense, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModulePage from '../../../components/common/ModulePage/ModulePage.jsx';
import DriverTable from '../components/DriverTable.jsx';
import PushAlertContainer from '../../../components/common/Toast/PushAlert.jsx';
import driverService from '../services/driverService.js';
import { exportDriversToExcel } from '../utils/exportDriversExcel.js';

const ViewLicensesModal = lazy(() => import('../components/modals/ViewLicensesModal.jsx'));
const ChangeDriverStatusModal = lazy(() => import('../components/modals/ChangeDriverStatusModal.jsx'));
const DeleteDriverModal = lazy(() => import('../components/modals/DeleteDriverModal.jsx'));

function SearchSVG() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ color: '#9aa5b1' }}>
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon({ width = 17, height = 17 }) {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15V3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function DriversPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Filtro 'Todos los estados'

  const [driverForLicenses, setDriverForLicenses] = useState(null);
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  const [driverToChangeStatus, setDriverToChangeStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [driverToDelete, setDriverToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Sistema de alertas Push
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setAlerts((prev) => [...prev, { id, type, title, message, duration }]);
  }, []);

  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Notificación que provenga de navegación
  useEffect(() => {
    if (location.state?.successMessage) {
      addAlert({
        type: 'success',
        title: 'Operación exitosa',
        message: location.state.successMessage,
        duration: 5000,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, addAlert]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await driverService.getAll();
      const allDrivers = Array.isArray(data) ? data : data?.data || [];

      // Filtrar los conductores ocultos localmente de la tabla (no borrados en BD)
      let hiddenIds = [];
      try {
        hiddenIds = JSON.parse(localStorage.getItem('miconductor_hidden_drivers') || '[]');
      } catch {
        hiddenIds = [];
      }

      const visible = allDrivers.filter((d) => !hiddenIds.includes(String(d._id || d.id)));
      setDrivers(visible);
    } catch (err) {
      console.error('Error al cargar conductores:', err);
      const msg = err.response?.data?.message || 'No fue posible cargar el listado de conductores.';
      setError(msg);
      addAlert({
        type: 'error',
        title: 'Error al cargar conductores',
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  // BÚSQUEDA MULTICOLUMNA Y FILTRADO POR 'TODOS LOS ESTADOS'
  const filteredDrivers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return drivers.filter((driver) => {
      const usr = driver.usuario || {};

      const tipoDoc = usr.tipoDocumento || driver.tipoDocumento || driver.documentType || '';
      const doc = usr.documento || driver.documento || driver.idNumber || '';
      const nombre = usr.nombre || driver.nombre || '';
      const apellido = usr.apellido || driver.apellido || '';
      const nombreCompleto = usr.nombreCompleto || `${nombre} ${apellido}`.trim() || driver.name || '';
      const correo = usr.correo || driver.correo || driver.email || '';
      const licencia = driver.licencia || driver.license || driver.licencias?.[0]?.numero || '';

      let cats = [];
      if (Array.isArray(driver.categoriasLicencia)) cats = driver.categoriasLicencia;
      else if (driver.categoriaLicencia) cats = [driver.categoriaLicencia];
      else if (Array.isArray(driver.licencias)) cats = driver.licencias.map((l) => l.categoria || l.categoriaLicencia).filter(Boolean);
      const categoriasStr = cats.join(' ');

      const exp = driver.experiencia !== undefined && driver.experiencia !== null ? `${driver.experiencia} años` : '';
      const estadoAdmin = (driver.estadoConductor || (driver.estado === false ? 'INACTIVO' : 'ACTIVO')).toUpperCase();
      const disponibilidad = driver.disponible ? 'disponible' : 'fuera de servicio no disponible';

      const fechaVenc = driver.fechaVencimiento
        ? new Date(driver.fechaVencimiento).toLocaleDateString('es-CO')
        : '';

      const haystack = `${tipoDoc} ${doc} ${nombre} ${apellido} ${nombreCompleto} ${correo} ${licencia} ${categoriasStr} ${exp} ${estadoAdmin} ${disponibilidad} ${fechaVenc}`.toLowerCase();

      const matchesSearch = !q || haystack.includes(q);
      if (!matchesSearch) return false;

      // Filtro por Estado (Todos los estados)
      if (statusFilter === 'active') return estadoAdmin === 'ACTIVO';
      if (statusFilter === 'inactive') return estadoAdmin === 'INACTIVO';
      if (statusFilter === 'retirado') return estadoAdmin === 'RETIRADO';
      if (statusFilter === 'fallecido') return estadoAdmin === 'FALLECIDO';
      if (statusFilter === 'disponible') return driver.disponible === true;
      if (statusFilter === 'fuera_servicio') return driver.disponible === false;

      return true;
    });
  }, [drivers, search, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Navegación en el main
  const handleViewDetails = (driver) => {
    const driverId = driver._id || driver.id;
    navigate(`/drivers/${driverId}`);
  };

  const handleEdit = (driver) => {
    const driverId = driver._id || driver.id;
    navigate(`/drivers/${driverId}/edit`);
  };

  // Ver todas las licencias del conductor
  const handleViewLicenses = (driver) => {
    setDriverForLicenses(driver);
    setShowLicensesModal(true);
  };

  const handleDeleteRequest = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const handleChangeStatusRequest = (driver) => {
    setDriverToChangeStatus(driver);
    setShowStatusModal(true);
  };

  // Cambio de disponibilidad operativa
  const handleToggleDisponibilidad = async (driver) => {
    const estadoAdmin = driver.estadoConductor || (driver.estado === false ? 'INACTIVO' : 'ACTIVO');

    if (estadoAdmin !== 'ACTIVO' && !driver.disponible) {
      addAlert({
        type: 'warning',
        title: 'Acción no permitida',
        message: `El conductor está en estado administrativo "${estadoAdmin}". Debe reactivarse administrativamente para poder estar disponible.`,
      });
      return;
    }

    if (driver.fechaVencimiento && new Date(driver.fechaVencimiento) < new Date() && !driver.disponible) {
      addAlert({
        type: 'warning',
        title: 'Licencia vencida',
        message: 'No es posible habilitar la disponibilidad operativa de un conductor con licencia de conducción vencida.',
      });
      return;
    }

    const nuevaDisponibilidad = !driver.disponible;
    const driverId = driver._id || driver.id;

    try {
      await driverService.updateDisponibilidad(driverId, nuevaDisponibilidad);
      setDrivers((prev) =>
        prev.map((d) => (d._id === driverId || d.id === driverId ? { ...d, disponible: nuevaDisponibilidad } : d))
      );

      addAlert({
        type: 'success',
        title: nuevaDisponibilidad ? 'Conductor disponible' : 'Fuera de servicio',
        message: nuevaDisponibilidad
          ? 'El conductor ahora está disponible para aceptar asignaciones de servicio.'
          : 'El conductor ha quedado fuera de servicio y no recibirá viajes.',
      });
    } catch (err) {
      console.error('Error al cambiar disponibilidad:', err);
      const msg = err.response?.data?.message || 'No fue posible cambiar la disponibilidad.';
      addAlert({
        type: 'error',
        title: 'Error de disponibilidad',
        message: msg,
      });
    }
  };

  // Confirmar cambio de estado administrativo
  const handleConfirmStatusChange = async ({ estadoConductor, motivo }) => {
    if (!driverToChangeStatus) return;
    const driverId = driverToChangeStatus._id || driverToChangeStatus.id;

    try {
      setActionLoading(true);
      const updated = await driverService.updateEstadoAdministrativo(driverId, {
        estadoConductor,
        motivo,
      });

      setDrivers((prev) =>
        prev.map((d) => (d._id === driverId || d.id === driverId ? { ...d, ...updated } : d))
      );

      setShowStatusModal(false);
      setDriverToChangeStatus(null);

      addAlert({
        type: 'success',
        title: 'Estado administrativo actualizado',
        message: `El estado del conductor ahora es "${estadoConductor}".`,
      });
    } catch (err) {
      console.error('Error al cambiar estado administrativo:', err);
      const msg = err.response?.data?.message || 'No se pudo actualizar el estado administrativo.';
      addAlert({
        type: 'error',
        title: 'Error al cambiar estado',
        message: msg,
      });
    } finally {
      setActionLoading(false);
    }
  };

  // REQUERIMIENTO: Borrar conductor SOLO en la tabla (no en la base de datos)
  const handleConfirmDelete = () => {
    if (!driverToDelete) return;
    const driverId = driverToDelete._id || driverToDelete.id;

    try {
      // 1. Guardar ID en localStorage para persistir la exclusión visual de la tabla
      let hiddenIds = [];
      try {
        hiddenIds = JSON.parse(localStorage.getItem('miconductor_hidden_drivers') || '[]');
      } catch {
        hiddenIds = [];
      }

      if (!hiddenIds.includes(String(driverId))) {
        hiddenIds.push(String(driverId));
        localStorage.setItem('miconductor_hidden_drivers', JSON.stringify(hiddenIds));
      }

      // 2. Filtrar el conductor de la tabla local inmediatamente
      setDrivers((prev) => prev.filter((d) => d._id !== driverId && d.id !== driverId));

      setShowDeleteModal(false);
      setDriverToDelete(null);

      addAlert({
        type: 'success',
        title: 'Conductor quitado de la tabla',
        message: 'El conductor fue removido de la vista de la tabla. Sus datos se conservan íntegros en la base de datos.',
      });
    } catch (err) {
      console.error('Error quitando conductor de la tabla:', err);
      addAlert({
        type: 'error',
        title: 'Error',
        message: 'No fue posible remover el conductor de la tabla.',
      });
    }
  };

  // Exportar Excel
  const handleExportExcel = () => {
    try {
      if (filteredDrivers.length === 0) {
        addAlert({
          type: 'warning',
          title: 'Sin registros',
          message: 'No hay conductores que coincidan con la búsqueda actual para exportar.',
        });
        return;
      }

      exportDriversToExcel(filteredDrivers);

      addAlert({
        type: 'success',
        title: 'Reporte generado',
        message: `Se descargó exitosamente el archivo Excel con ${filteredDrivers.length} conductor(es).`,
      });
    } catch (err) {
      addAlert({
        type: 'error',
        title: 'Error al exportar',
        message: err.message || 'No fue posible generar el reporte en Excel.',
      });
    }
  };

  return (
    <ModulePage>
      {/* Contenedor de Alertas Push */}
      <PushAlertContainer alerts={alerts} onDismiss={dismissAlert} />

      <div style={{ display: 'grid', gap: 24 }}>
        {/* MENSAJE DE ERROR SUPERIOR (si existe) */}
        {error && (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 14,
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              color: '#be123c',
              fontSize: 13.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#be123c',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL */}
        <section
          style={{
            background: '#ffffff',
            borderRadius: 28,
            border: '1px solid rgba(27, 46, 61, 0.08)',
            boxShadow: '0 10px 22px rgba(18, 39, 52, 0.05)',
            overflow: 'hidden',
          }}
        >
          {/* CABECERA: BUSCADOR + DROPDOWN 'TODOS LOS ESTADOS' + BOTONES */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 12,
              padding: '18px 24px',
              borderBottom: '1px solid rgba(27, 46, 61, 0.06)',
            }}
          >
            {/* BUSCADOR MULTICOLUMNA */}
            <div style={{ flex: '1 1 240px', minWidth: 0 }}>
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
                  <SearchSVG />
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por documento, nombre, licencia, categoría o estado..."
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: 13,
                    color: '#111111',
                  }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 'bold',
                      padding: '0 4px',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* REQUERIMIENTO 1: DROPDOWN SELECT 'TODOS LOS ESTADOS' (Idéntico a imagen 1) */}
            <div style={{ position: 'relative', minWidth: 175, flexShrink: 0 }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: 38,
                  borderRadius: 12,
                  background: '#f8fafc',
                  padding: '0 32px 0 14px',
                  border: '1px solid rgba(27, 46, 61, 0.1)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#111111',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  fontFamily: 'inherit',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="retirado">Retirados</option>
                <option value="fallecido">Fallecidos</option>
                <option value="disponible">Disponibles</option>
                <option value="fuera_servicio">Fuera de servicio</option>
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

            {/* BOTONES ACCIÓN: EXPORTAR + REGISTRAR */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flexShrink: 0, marginLeft: 'auto' }}>
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={filteredDrivers.length === 0}
                title="Descargar reporte completo en formato Excel"
                style={{
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid rgba(27, 46, 61, 0.12)',
                  background: '#ffffff',
                  color: '#166534',
                  padding: '0 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: filteredDrivers.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: filteredDrivers.length === 0 ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <DownloadIcon />
                <span>Exportar Excel</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/drivers/new')}
                style={{
                  height: 36,
                  borderRadius: 10,
                  background: '#ff9a2f',
                  color: '#111111',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(255, 154, 47, 0.25)',
                  transition: 'opacity 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.92')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <PlusIcon />
                <span>Nuevo conductor</span>
              </button>
            </div>
          </div>

          {/* CUERPO: TABLA DE CONDUCTORES */}
          <div style={{ padding: '20px 24px' }}>
            {loading ? (
              <div
                style={{
                  minHeight: 320,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: 14,
                }}
              >
                Cargando conductores...
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div
                style={{
                  minHeight: 260,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  gap: 8,
                  padding: 40,
                }}
              >
                <span style={{ fontSize: 32 }}>🔍</span>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>
                  No se encontraron conductores
                </p>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>
                  {search || statusFilter !== 'all'
                    ? 'No hay resultados para los filtros seleccionados. Intenta con otro término o limpia la búsqueda.'
                    : 'Aún no hay conductores registrados en la plataforma.'}
                </p>
              </div>
            ) : (
              <DriverTable
                drivers={filteredDrivers}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDeleteRequest={handleDeleteRequest}
                onToggleDisponibilidad={handleToggleDisponibilidad}
                onChangeStatusRequest={handleChangeStatusRequest}
                onViewLicenses={handleViewLicenses}
              />
            )}
          </div>
        </section>
      </div>

      {/* MODALES EN SUSPENSE */}
      <Suspense fallback={null}>
        {/* MODAL VER TODAS LAS LICENCIAS */}
        {showLicensesModal && driverForLicenses && (
          <ViewLicensesModal
            driver={driverForLicenses}
            open={showLicensesModal}
            onClose={() => {
              setShowLicensesModal(false);
              setDriverForLicenses(null);
            }}
          />
        )}

        {/* MODAL CAMBIO DE ESTADO ADMINISTRATIVO */}
        {showStatusModal && driverToChangeStatus && (
          <ChangeDriverStatusModal
            driver={driverToChangeStatus}
            open={showStatusModal}
            loading={actionLoading}
            onClose={() => {
              setShowStatusModal(false);
              setDriverToChangeStatus(null);
            }}
            onConfirm={handleConfirmStatusChange}
          />
        )}

        {/* MODAL CONFIRMACIÓN DE ELIMINACIÓN DE LA TABLA */}
        {showDeleteModal && driverToDelete && (
          <DeleteDriverModal
            driver={driverToDelete}
            open={showDeleteModal}
            loading={actionLoading}
            onClose={() => {
              setShowDeleteModal(false);
              setDriverToDelete(null);
            }}
            onConfirm={handleConfirmDelete}
          />
        )}
      </Suspense>
    </ModulePage>
  );
}
