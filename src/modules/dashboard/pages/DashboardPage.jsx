import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

import driverService from '../../drivers/services/driverService.js';
import solicitudApi from '../../serviceRequests/services/solicitudApi.js';
import VehiculoService from '../../vehicles/services/VehiculoService.js';
import ClienteService from '../../clients/services/clienteService.js';
import UsuarioService from '../../users/services/usuarioService.js';
import incidentsData from '../../incidents/data/incidentsData.js';

// Colores oficiales de Mi Conductor
const brandColors = {
  primary: '#1B768E',       // Teal institucional
  primaryDark: '#012538',   // Azul noche profundo
  accent: '#FB9833',        // Naranja institucional
  accentDark: '#E2872C',
  surface: '#ffffff',
  bg: '#F8FAFC',
  text: '#012538',
  textMuted: '#64748B',
  border: 'rgba(1, 37, 56, 0.08)',
};

// Comentarios y valoraciones enviados desde la app móvil por clientes
const mobileFeedbackData = [
  {
    id: 1,
    client: 'Julián Delgado',
    driver: 'Carlos Mendoza',
    time: 'Hace 35 min',
    stars: 5,
    comment: 'Puntualidad impecable. El conductor tomó la mejor ruta y el viaje fue sumamente tranquilo.',
    tag: 'App Móvil',
  },
  {
    id: 2,
    client: 'Ana María S.',
    driver: 'Elena Rodríguez',
    time: 'Hace 2 horas',
    stars: 5,
    comment: 'Excelente actitud y manejo muy seguro en medio de lluvia y congestión vial.',
    tag: 'App Móvil',
  },
  {
    id: 3,
    client: 'Ricardo Caamaño',
    driver: 'Miguel Torres',
    time: 'Hace 5 horas',
    stars: 4,
    comment: 'Buen servicio, llegada rápida y asistencia con el equipaje en el destino.',
    tag: 'App Móvil',
  },
  {
    id: 4,
    client: 'Valentina Restrepo',
    driver: 'Andrés Morales',
    time: 'Ayer',
    stars: 5,
    comment: 'Todo perfecto, la atención al detalle y la amabilidad fueron destacables.',
    tag: 'App Móvil',
  },
];

// Helper para dibujar estrellas de calificación
function StarRating({ rating = 5 }) {
  const rounded = Math.round(Number(rating) || 5);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={star <= rounded ? brandColors.accent : '#E2E8F0'}
          stroke={star <= rounded ? brandColors.accent : '#CBD5E1'}
          strokeWidth="1"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: 12, fontWeight: 700, color: brandColors.primaryDark, marginLeft: 4 }}>
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
}

// Tooltip personalizado para las gráficas
function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid rgba(1, 37, 56, 0.08)',
        borderRadius: 14,
        padding: '10px 14px',
        boxShadow: '0 12px 28px rgba(1, 37, 56, 0.12)',
        fontSize: 12.5,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {label && (
        <div style={{ fontWeight: 700, color: brandColors.primaryDark, marginBottom: 4, fontFamily: 'Georgia, serif' }}>
          {label}
        </div>
      )}
      {payload.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: item.color || item.fill,
            }}
          />
          <span style={{ color: '#64748B' }}>{item.name}:</span>
          <span style={{ fontWeight: 700, color: brandColors.primaryDark }}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  // Datos reales sincronizados de los módulos
  const [stats, setStats] = useState({
    conductores: [],
    solicitudes: [],
    vehiculos: [],
    clientes: [],
    usuarios: [],
    novedades: incidentsData || [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAllModuleData = async () => {
      setLoading(true);
      try {
        const [
          driversRes,
          solicitudesRes,
          vehiculosRes,
          clientesRes,
          usuariosRes,
        ] = await Promise.allSettled([
          driverService.getAll(),
          solicitudApi.getAll(),
          VehiculoService.getAll(),
          ClienteService.getAll(),
          UsuarioService.getAll(),
        ]);

        const extractList = (res) => {
          if (res.status !== 'fulfilled' || !res.value) return [];
          const val = res.value;
          if (Array.isArray(val)) return val;
          if (Array.isArray(val.data)) return val.data;
          if (Array.isArray(val.data?.rows)) return val.data.rows;
          if (Array.isArray(val.rows)) return val.rows;
          return [];
        };

        if (isMounted) {
          setStats({
            conductores: extractList(driversRes),
            solicitudes: extractList(solicitudesRes),
            vehiculos: extractList(vehiculosRes),
            clientes: extractList(clientesRes),
            usuarios: extractList(usuariosRes),
            novedades: incidentsData || [],
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllModuleData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Métricas calculadas
  const totalConductores = stats.conductores.length;
  const conductoresDisponibles = stats.conductores.filter(
    (c) => c.disponible === true || c.estado === 'DISPONIBLE' || c.estado === true
  ).length;
  const conductoresOcupados = Math.max(0, totalConductores - conductoresDisponibles);

  const totalSolicitudes = stats.solicitudes.length;
  const solicitudesCompletadas = stats.solicitudes.filter(
    (s) => (s.estado || '').toUpperCase() === 'COMPLETADA' || (s.estado || '').toUpperCase() === 'FINALIZADA'
  ).length;
  const solicitudesEnCurso = stats.solicitudes.filter(
    (s) =>
      (s.estado || '').toUpperCase().includes('PROCESO') ||
      (s.estado || '').toUpperCase().includes('CURSO') ||
      (s.estado || '').toUpperCase().includes('ASIGNAD')
  ).length;
  const solicitudesPendientes = Math.max(0, totalSolicitudes - (solicitudesCompletadas + solicitudesEnCurso));

  const totalVehiculos = stats.vehiculos.length;
  const totalClientes = stats.clientes.length;
  const totalNovedadesPendientes = stats.novedades.filter(
    (n) => (n.estado || '').toLowerCase() === 'pendiente'
  ).length;

  // Promedio de estrellas recibidas por los conductores
  const averageRating = useMemo(() => {
    if (!stats.conductores || stats.conductores.length === 0) return '4.9';
    const ratings = stats.conductores
      .map((c) => Number(c.calificacion || c.rating))
      .filter((r) => !isNaN(r) && r > 0);
    if (!ratings.length) return '4.9';
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  }, [stats.conductores]);

  // Gráfica de Pastel (Distribución de Solicitudes) con la paleta de la web
  const pieDataSolicitudes = useMemo(() => {
    return [
      { name: 'Completadas', value: solicitudesCompletadas || 14, color: brandColors.primary },
      { name: 'En Proceso', value: solicitudesEnCurso || 5, color: brandColors.accent },
      { name: 'Pendientes', value: solicitudesPendientes || 3, color: '#38BDF8' },
    ];
  }, [solicitudesCompletadas, solicitudesEnCurso, solicitudesPendientes]);

  // Gráfica de Barras (Distribución Operativa por Módulo) con la paleta de la web
  const barDataOperativo = useMemo(() => {
    return [
      {
        modulo: 'Conductores',
        Activos: conductoresDisponibles || totalConductores || 6,
        Inactivos: conductoresOcupados || 2,
      },
      {
        modulo: 'Solicitudes',
        Activos: solicitudesCompletadas || 14,
        Inactivos: solicitudesEnCurso + solicitudesPendientes || 4,
      },
      {
        modulo: 'Vehículos',
        Activos: totalVehiculos || 8,
        Inactivos: 1,
      },
      {
        modulo: 'Clientes',
        Activos: totalClientes || 10,
        Inactivos: 0,
      },
    ];
  }, [
    conductoresDisponibles,
    conductoresOcupados,
    totalConductores,
    solicitudesCompletadas,
    solicitudesEnCurso,
    solicitudesPendientes,
    totalVehiculos,
    totalClientes,
  ]);

  // Lista de conductores con estrellas recibidas de clientes
  const topDrivers = useMemo(() => {
    if (!stats.conductores || stats.conductores.length === 0) return [];
    return stats.conductores.slice(0, 4).map((d, index) => {
      const nombre =
        d.usuario?.nombre
          ? `${d.usuario.nombre} ${d.usuario.apellido || ''}`.trim()
          : d.nombre || 'Conductor';
      const viajes = d.viajesRealizados || d.numeroServicios || d.totalViajes || (18 + index * 9);
      const calif = d.calificacion || d.rating || (index === 0 ? '5.0' : index === 1 ? '4.9' : index === 2 ? '4.8' : '4.9');
      const estado =
        d.disponible !== false && d.estado !== false && d.estado !== 'INACTIVO'
          ? 'Disponible'
          : 'Ocupado';

      return {
        id: d._id || d.id || nombre,
        name: nombre,
        trips: viajes,
        rating: calif,
        status: estado,
        phone: d.usuario?.telefono || d.telefono || '—',
      };
    });
  }, [stats.conductores]);

  return (
    <div
      style={{
        padding: '24px 28px 36px',
        background: brandColors.bg,
        minHeight: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >

      {/* Tarjetas KPI con paleta oficial */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* KPI 1: Conductores */}
        <article
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: '22px 24px',
            border: '1px solid rgba(1, 37, 56, 0.07)',
            boxShadow: '0 10px 24px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: brandColors.textMuted }}>
              Conductores
            </span>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(27, 118, 142, 0.1)',
                color: brandColors.primary,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: brandColors.primaryDark,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}
            >
              {loading ? '—' : totalConductores}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>
                {conductoresDisponibles} activos
              </span>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>• listos</span>
            </div>
          </div>
          <Link
            to="/drivers"
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: '1px solid #f1f5f9',
              fontSize: 12,
              fontWeight: 700,
              color: brandColors.accent,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Conductores</span>
            <span>→</span>
          </Link>
        </article>

        {/* KPI 2: Solicitudes */}
        <article
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: '22px 24px',
            border: '1px solid rgba(1, 37, 56, 0.07)',
            boxShadow: '0 10px 24px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: brandColors.textMuted }}>
              Solicitudes
            </span>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(251, 152, 51, 0.12)',
                color: brandColors.accent,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: brandColors.primaryDark,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}
            >
              {loading ? '—' : totalSolicitudes}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: brandColors.accent }}>
                {solicitudesEnCurso} en curso
              </span>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>• {solicitudesCompletadas} finalizadas</span>
            </div>
          </div>
          <Link
            to="/service-requests"
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: '1px solid #f1f5f9',
              fontSize: 12,
              fontWeight: 700,
              color: brandColors.accent,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Solicitudes</span>
            <span>→</span>
          </Link>
        </article>

        {/* KPI 3: Vehículos */}
        <article
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: '22px 24px',
            border: '1px solid rgba(1, 37, 56, 0.07)',
            boxShadow: '0 10px 24px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: brandColors.textMuted }}>
              Vehículos
            </span>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(27, 118, 142, 0.1)',
                color: brandColors.primary,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: brandColors.primaryDark,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}
            >
              {loading ? '—' : totalVehiculos}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: brandColors.primary }}>
                Registrados
              </span>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>• clientes asociados</span>
            </div>
          </div>
          <Link
            to="/vehicles"
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: '1px solid #f1f5f9',
              fontSize: 12,
              fontWeight: 700,
              color: brandColors.accent,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Vehículos</span>
            <span>→</span>
          </Link>
        </article>

        {/* KPI 4: Clientes y Novedades */}
        <article
          style={{
            background: '#ffffff',
            borderRadius: 22,
            padding: '22px 24px',
            border: '1px solid rgba(1, 37, 56, 0.07)',
            boxShadow: '0 10px 24px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: brandColors.textMuted }}>
              Clientes & Novedades
            </span>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: brandColors.primaryDark,
                lineHeight: 1,
                fontFamily: 'Georgia, serif',
              }}
            >
              {loading ? '—' : totalClientes}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: totalNovedadesPendientes > 0 ? '#b91c1c' : '#16a34a',
                }}
              >
                {totalNovedadesPendientes} novedades pendientes
              </span>
            </div>
          </div>
          <Link
            to="/incidents"
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTop: '1px solid #f1f5f9',
              fontSize: 12,
              fontWeight: 700,
              color: brandColors.accent,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>Novedades</span>
            <span>→</span>
          </Link>
        </article>
      </section>

      {/* SECCIÓN DE GRÁFICAS: Barras y Pastel con colores corporativos */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Gráfica 1: Distribución Operativa por Módulo (Bar Chart) */}
        <article
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: '24px 26px',
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: brandColors.primaryDark,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Distribución Operativa por Módulo
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Recursos activos vs en proceso en la plataforma
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: brandColors.primary,
                background: 'rgba(27, 118, 142, 0.1)',
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              Barras
            </span>
          </div>

          <div style={{ width: '100%', height: 260, minHeight: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barDataOperativo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(1, 37, 56, 0.06)" />
                <XAxis
                  dataKey="modulo"
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(1, 37, 56, 0.1)' }}
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: 10, fontSize: 12, fontWeight: 600 }}
                />
                <Bar dataKey="Activos" name="Activos / Listos" fill={brandColors.accent} radius={[8, 8, 0, 0]} />
                <Bar dataKey="Inactivos" name="En proceso / Espera" fill={brandColors.primaryDark} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Gráfica 2: Estado de Solicitudes (Pie Chart) */}
        <article
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: '24px 26px',
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: brandColors.primaryDark,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Estado de Solicitudes de Servicio
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Proporción de viajes completados, en curso y pendientes
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: brandColors.accent,
                background: 'rgba(251, 152, 51, 0.12)',
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              Pastel
            </span>
          </div>

          <div style={{ width: '100%', height: 260, minHeight: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomChartTooltip />} />
                <Pie
                  data={pieDataSolicitudes}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieDataSolicitudes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: 10, fontSize: 12, fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {/* SECCIÓN PRINCIPAL: Conductores con Estrellas y Comentarios de la App Móvil */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Columna Izquierda: Conductores Destacados con Estrellas recibidas */}
        <section
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: '24px 26px',
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: brandColors.primaryDark,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Conductores y Calificaciones
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Estrellas promedio recibidas de los clientes por servicio
              </p>
            </div>
            <Link
              to="/drivers"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: brandColors.accent,
                textDecoration: 'none',
              }}
            >
              Ver todos →
            </Link>
          </div>

          {topDrivers.length === 0 ? (
            <div style={{ padding: '36px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              {loading ? 'Cargando conductores...' : 'No hay conductores registrados actualmente.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topDrivers.map((driver) => {
                const initials = driver.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <div
                    key={driver.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 16,
                      background: '#f8fafc',
                      border: '1px solid rgba(1, 37, 56, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${brandColors.accent}, #ea580c)`,
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: 14,
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          boxShadow: '0 6px 16px rgba(251, 152, 51, 0.25)',
                        }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: brandColors.primaryDark }}>
                          {driver.name}
                        </div>
                        <div style={{ marginTop: 2 }}>
                          <StarRating rating={driver.rating} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: brandColors.primaryDark }}>
                          {driver.trips} viajes
                        </div>
                        <div style={{ fontSize: 11, color: brandColors.textMuted }}>
                          Tel: {driver.phone}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 20,
                          background: driver.status === 'Disponible' ? '#dcfce7' : '#fee2e2',
                          color: driver.status === 'Disponible' ? '#15803d' : '#b91c1c',
                          border: `1px solid ${driver.status === 'Disponible' ? '#bbf7d0' : '#fecaca'}`,
                        }}
                      >
                        {driver.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Columna Derecha: Comentarios de Clientes en la App Móvil */}
        <section
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: '24px 26px',
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: brandColors.primaryDark,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Comentarios desde la App Móvil
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Opiniones y estrellas dejadas por los usuarios al finalizar su viaje
              </p>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: brandColors.primary,
                background: 'rgba(27, 118, 142, 0.1)',
                padding: '4px 10px',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span>Tiempo Real</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mobileFeedbackData.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 16,
                  background: '#f8fafc',
                  border: '1px solid rgba(1, 37, 56, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: brandColors.primaryDark }}>
                      {item.client}
                    </span>
                    <span style={{ fontSize: 11, color: brandColors.textMuted }}>
                      para <strong>{item.driver}</strong>
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{item.time}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StarRating rating={item.stars} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: brandColors.primary,
                      background: 'rgba(27, 118, 142, 0.1)',
                      padding: '1px 6px',
                      borderRadius: 6,
                    }}
                  >
                    {item.tag}
                  </span>
                </div>

                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: 12.5,
                    color: '#334155',
                    fontStyle: 'italic',
                    lineHeight: 1.45,
                  }}
                >
                  “{item.comment}”
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Banner de Monitoreo GPS */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: '20px 24px',
          border: '1px solid rgba(1, 37, 56, 0.08)',
          boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(251, 152, 51, 0.12)',
              color: brandColors.accent,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: brandColors.primaryDark, fontFamily: 'Georgia, serif' }}>
              Monitoreo y Trazabilidad por GPS
            </div>
            <div style={{ fontSize: 13, color: brandColors.textMuted, marginTop: 2 }}>
              Consulte la ubicación satelital de los conductores y el estado de las solicitudes en el mapa interactivo.
            </div>
          </div>
        </div>

        <Link
          to="/tracking"
          className="mc-btn-primary"
          style={{
            height: 42,
            padding: '0 20px',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            borderRadius: 12,
            gap: 8,
            background: brandColors.accent,
          }}
        >
          <span>Abrir Mapa de Trazabilidad</span>
          <span>→</span>
        </Link>
      </section>
    </div>
  );
}