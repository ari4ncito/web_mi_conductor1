import { useEffect, useState, useMemo } from 'react';
import DriverTable from '../components/DriverTable';
import EditDriverModal from '../components/modals/EditDriverModal';
import RegisterDriverModal from '../components/modals/RegisterDriverModal';
import DriverDetailsModal from '../components/modals/DriverDetailsModal';
import driverService from '../services/driverService';

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
    <svg
      viewBox="0 0 8 12"
      width="8"
      height="12"
      aria-hidden="true"
    >
      <path
        d="M2 1.5 5.5 6 2 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      style={{ color: '#2b2b2b' }}
    >
      <path
        d="M12 4a4.5 4.5 0 0 0-4.5 4.5V11c0 .8-.3 1.6-.8 2.1L5.5 15h13l-1.2-1.9c-.5-.5-.8-1.3-.8-2.1V8.5A4.5 4.5 0 0 0 12 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      <path
        d="M10 18.5a2 2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  detail,
  accent = false
}) {
  return (
    <article
      style={{
        minHeight: 96,
        borderRadius: 20,
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 8px 18px rgba(21, 42, 53, 0.06)',
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div
          style={{
            color: '#252525',
            fontSize: 14,
            letterSpacing: '0.1em',
            fontWeight: 400,
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: 6,
            color: colors.text,
            fontSize: 17,
            fontWeight: 400,
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          color: accent ? '#b96a00' : colors.text,
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {accent ? (
          <span style={{ color: '#c97300' }}>↗</span>
        ) : null}

        <span style={{ fontSize: 14 }}>
          {detail}
        </span>
      </div>
    </article>
  );
}

function HeaderAction({
  children,
  width = 40,
  height = 40,
  background = colors.surface
}) {
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
  );
}

function SearchIcon({
  size = 18,
  color = '#b3b7bf'
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ color }}
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 16l4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
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
      <span
        style={{
          width: 16,
          display: 'inline-flex',
          flexShrink: 0,
        }}
      >
        <SearchIcon
          size={16}
          color="#9aa5b1"
        />
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
  );
}

export default function DriversPage() {

  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [search, setSearch] = useState('');

  const [currentPage, setCurrentPage] = useState(1);

  const [filter, setFilter] = useState('all');

  const [selectedDriver, setSelectedDriver] =
    useState(null);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showRegisterModal, setShowRegisterModal] =
    useState(false);

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);


  const cargarConductores = async () => {

    try {

      setLoading(true);
      setError('');

      const data =
        await driverService.getAll();

      console.log(
        'Conductores obtenidos del backend:',
        data
      );

      let arr = [];
      if (Array.isArray(data)) arr = data;
      else if (data && Array.isArray(data.data)) arr = data.data;
      else if (data && data.data && Array.isArray(data.data.rows)) arr = data.data.rows;
      else if (data && Array.isArray(data.rows)) arr = data.rows;
      else if (data && Array.isArray(data.conductores)) arr = data.conductores;
      setDrivers(arr);

    } catch (error) {

      console.error(
        'Error obteniendo conductores:',
        error
      );

      console.log(
        'Respuesta:',
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
        'No se pudieron cargar los conductores.'
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    cargarConductores();

  }, []);

  const stats = useMemo(() => {

    const total =
      drivers.length;

    const activeNow =
      drivers.filter(
        (driver) =>
          driver.disponible === true
      ).length;

    const expiredLicenses =
      drivers.filter((driver) => {

        if (!driver.fechaVencimiento) {
          return false;
        }

        return (
          new Date(driver.fechaVencimiento) <
          new Date()
        );

      }).length;

    return {
      total,
      activeNow,
      expiredLicenses
    };

  }, [drivers]);


  const filteredDrivers =
    useMemo(() => {

      const q =
        search
          .toLowerCase()
          .trim();

      return drivers.filter((driver) => {

        const nombre =
          `${driver.usuario?.nombre || ''} ${
            driver.usuario?.apellido || ''
          }`.trim();

        const licencia =
          driver.licencia || '';

        const documento =
          driver.usuario?.documento || '';

        const nombreTexto =
          nombre.toLowerCase();

        const licenciaTexto =
          licencia.toLowerCase();

        const documentoTexto =
          documento.toLowerCase();

        const matchesSearch =
          nombreTexto.includes(q) ||
          licenciaTexto.includes(q) ||
          documentoTexto.includes(q);

        if (filter === 'all') {
          return matchesSearch;
        }

        if (filter === 'available') {

          return (
            matchesSearch &&
            driver.disponible === true
          );

        }

        if (filter === 'off-duty') {

          return (
            matchesSearch &&
            driver.disponible === false
          );

        }

        return matchesSearch;

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

  const handleUpdateDriver = async () => {

    await cargarConductores();

  };


  const handleRegisterDriver = async () => {

    await cargarConductores();

  };

    return (
    <main
      style={{
        flex: 1,
        minWidth: 0,
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      {/* TABLA */}

      <section
        style={{
          background: colors.surface,
          borderRadius: 24,
          border:
            `1px solid ${colors.border}`,
          boxShadow:
            '0 10px 22px rgba(18, 39, 52, 0.05)',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        {/* CABECERA: BUSCADOR + FILTROS + BOTÓN */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            padding: '18px 24px',
          }}
        >

          {/* BUSCADOR */}

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
                border: `1px solid ${colors.border}`,
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
                <SearchIcon size={16} color="#9aa5b1" />
              </span>

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar conductor..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 13,
                  color: '#1f2937',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* FILTROS */}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            {[
              'available',
              'off-duty'
            ].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter((prev) => prev === f ? 'all' : f);
                  setCurrentPage(1);
                }}
                style={{
                  height: 36,
                  borderRadius: 10,
                  border: 0,
                  background:
                    filter === f
                      ? colors.accent
                      : '#dceafb',
                  color:
                    filter === f
                      ? '#111111'
                      : '#1f2937',
                  padding: '0 14px',
                  fontSize: 13,
                  fontWeight:
                    filter === f ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {f === 'available'
                  ? 'Disponibles'
                  : 'Fuera Servicio'}
              </button>
            ))}
          </div>

          {/* BOTÓN REGISTRAR */}

          <button
            onClick={() =>
              setShowRegisterModal(true)
            }
            style={{
              height: 36,
              borderRadius: 10,
              background: colors.accent,
              color: '#111111',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '0 16px',
              fontSize: 13,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow:
                '0 4px 10px rgba(255, 154, 47, 0.25)',
              flexShrink: 0,
            }}
          >
            <PlusIcon />
            Registrar Conductor
          </button>

        </div>


        {/* ERROR */}

        {error && (

          <div
            style={{
              margin: '0 20px 12px',
              padding: '24px',
              borderRadius: 10,
              background: '#fff1f2',
              color: '#be123c',
              fontSize: 14,
            }}
          >
            {error}
          </div>

        )}


        {/* LOADING */}

        {loading ? (

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textMuted,
            }}
          >
            Cargando conductores...
          </div>

        ) : (

          <div style={{ padding: '24px' }}>

            <DriverTable
              drivers={filteredDrivers}
              currentPage={currentPage}
              pageSize={5}
              onPageChange={setCurrentPage}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />

          </div>

        )}

      </section>


      {/* ESTADÍSTICAS */}

      <section
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, minmax(0, 1fr))',
          gap: 16,
          marginTop: 18,
          flexShrink: 0,
        }}
      >

        <MetricCard
          label="Conductores totales"
          value={stats.total.toLocaleString()}
          detail="Registrados"
          accent
        />

        <MetricCard
          label="Disponibles ahora"
          value={stats.activeNow.toLocaleString()}
          detail="Disponibles"
        />

        <MetricCard
          label="Calificación promedio"
          value="N/A"
          detail="Sin datos"
        />

        <MetricCard
          label="Licencias vencidas"
          value={stats.expiredLicenses.toLocaleString()}
          detail="Requieren atención"
        />

      </section>


      {/* DETALLES */}

      <DriverDetailsModal
        driver={selectedDriver}
        open={showDetailsModal}
        onClose={() =>
          setShowDetailsModal(false)
        }
        onUpdate={handleUpdateDriver}
      />


      {/* EDITAR */}

      <EditDriverModal
        driver={selectedDriver}
        open={showEditModal}
        onClose={() =>
          setShowEditModal(false)
        }
        onUpdate={handleUpdateDriver}
      />


      {/* REGISTRAR */}

      <RegisterDriverModal
        open={showRegisterModal}
        onClose={() =>
          setShowRegisterModal(false)
        }
        onRegister={handleRegisterDriver}
      />

    </main>
  );
}
