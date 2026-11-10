import { useCallback, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

import driverService from '../../drivers/services/driverService.js';
import solicitudApi from '../../serviceRequests/services/solicitudApi.js';
import incidentsData from '../../incidents/data/incidentsData.js';
import { formatRelativeTime } from '../../../utils/formatDate.js';
import { socket, subscribeSocketConsumer } from '../../../services/websocket/socketClient.js';

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

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_LARGOS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function normalizarEstadoSolicitud(rawEstado) {
  const upper = String(rawEstado || '').trim().toUpperCase();
  if (upper === 'COMPLETADO' || upper === 'COMPLETADA' || upper === 'FINALIZADO' || upper === 'FINALIZADA') {
    return 'Completado';
  }
  if (upper === 'EN_PROCESO' || upper.includes('PROCESO') || upper.includes('CURSO') || upper.includes('ASIGNAD')) {
    return 'En Proceso';
  }
  if (upper === 'CANCELADO' || upper === 'CANCELADA') {
    return 'Cancelado';
  }
  return 'Pendiente';
}

function normalizarEstadoNovedad(rawEstado) {
  const norm = String(rawEstado || '').trim().toUpperCase();
  if (
    norm === 'REVISADO' ||
    norm === 'RESUELTO' ||
    norm === 'RESUELTA' ||
    norm === 'CERRADO' ||
    norm === 'CERRADA' ||
    norm === 'EN_ATENCION'
  ) {
    return 'Revisado';
  }
  return 'Por revisar';
}

function normalizarPrioridadNovedad(novedad) {
  const severidad = novedad?.prioridad || novedad?.severidad || novedad?.nivelUrgencia || '';
  const norm = String(severidad).trim().toUpperCase();
  if (norm === 'ALTA' || norm === 'CRITICA' || norm === 'CRÍTICA') return 'Alta';
  if (norm === 'BAJA') return 'Baja';
  if (norm === 'MEDIA') return 'Media';

  const tipoUpper = String(novedad?.tipoNovedad || novedad?.tipo || '').trim().toUpperCase();
  if (tipoUpper.includes('ACCIDENTE') || tipoUpper.includes('FALLA_MECANICA_GRAVE')) return 'Alta';
  if (tipoUpper.includes('TRAFICO_LEVE') || tipoUpper.includes('CLIMA') || tipoUpper.includes('FALLA_MECANICA_LEVE')) return 'Baja';
  return 'Media';
}

function getMondayOfWeek(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function getWeekKey(mondayDate) {
  const y = mondayDate.getFullYear();
  const m = String(mondayDate.getMonth() + 1).padStart(2, '0');
  const d = String(mondayDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatWeekMeta(mondayDate) {
  const start = new Date(mondayDate);
  const end = new Date(mondayDate);
  end.setDate(end.getDate() + 6);

  const startStr = `${String(start.getDate()).padStart(2, '0')} ${MESES_CORTOS[start.getMonth()]}`;
  const endStr = `${String(end.getDate()).padStart(2, '0')} ${MESES_CORTOS[end.getMonth()]}`;

  return {
    label: startStr,
    rangoCompleto: `Semana: ${startStr} – ${endStr}`,
  };
}

function getMonthKey(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;
  return `${MESES_LARGOS[month - 1]} ${year}`;
}

function parseRatingValue(val) {
  if (val === null || val === undefined || val === '') return null;
  const num = Number(val);
  if (Number.isNaN(num) || num <= 0 || num > 5) return null;
  return num;
}

function resolveUserFullName(entity, fallback = '') {
  if (!entity || typeof entity === 'string') return fallback;
  const userObj = entity.usuario || entity;
  const full = [userObj.nombre, userObj.apellido].filter(Boolean).join(' ').trim();
  return full || entity.nombreCompleto || fallback;
}

function extractDriverId(entity) {
  if (!entity) return '';
  if (typeof entity === 'string') return entity;
  return String(entity._id || entity.id || '');
}

function extractList(res) {
  if (res.status !== 'fulfilled' || !res.value) return [];
  const val = res.value;
  if (Array.isArray(val)) return val;
  if (Array.isArray(val.data)) return val.data;
  if (Array.isArray(val.data?.rows)) return val.data.rows;
  if (Array.isArray(val.rows)) return val.rows;
  if (Array.isArray(val.solicitudes)) return val.solicitudes;
  if (Array.isArray(val.novedades)) return val.novedades;
  return [];
}

function StarRating({ rating }) {
  if (rating === null || rating === undefined) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: '#94a3b8' }}>
          Sin calificaciones
        </span>
      </div>
    );
  }

  const rounded = Math.round(Number(rating) || 0);
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

function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const headerLabel = payload[0]?.payload?.rangoCompleto || label;

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
      {headerLabel && (
        <div style={{ fontWeight: 700, color: brandColors.primaryDark, marginBottom: 4, fontFamily: 'Georgia, serif' }}>
          {headerLabel}
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
  const [solicitudesChartType, setSolicitudesChartType] = useState('area');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const [stats, setStats] = useState({
    conductores: [],
    solicitudes: [],
    novedades: [],
  });

  const fetchAllModuleData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const [
        driversRes,
        solicitudesRes,
        novedadesRes,
      ] = await Promise.allSettled([
        driverService.getAll(),
        solicitudApi.getAll(),
        incidentsData.getAll(),
      ]);

      setStats({
        conductores: extractList(driversRes),
        solicitudes: extractList(solicitudesRes),
        novedades: extractList(novedadesRes),
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;

    const init = async () => {
      if (cancelado) return;
      await fetchAllModuleData({ silent: true });
    };

    const task = Promise.resolve().then(init);
    const unsubscribeConsumer = subscribeSocketConsumer();

    const handleLiveUpdate = () => {
      if (!cancelado) {
        void fetchAllModuleData({ silent: true });
      }
    };

    socket.on('notificacion:nueva', handleLiveUpdate);

    return () => {
      cancelado = true;
      void task;
      socket.off('notificacion:nueva', handleLiveUpdate);
      unsubscribeConsumer();
    };
  }, [fetchAllModuleData]);

  // Meses disponibles derivados dinámicamente de las solicitudes reales
  const availableMonths = useMemo(() => {
    const keys = new Set();
    const currentKey = getMonthKey(new Date());
    if (currentKey) keys.add(currentKey);

    stats.solicitudes.forEach((s) => {
      const key = getMonthKey(s.fechaInicio || s.fechaProgramada || s.createdAt);
      if (key) keys.add(key);
    });

    return Array.from(keys)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => ({ value: key, label: formatMonthLabel(key) }));
  }, [stats.solicitudes]);

  // Métricas semanales reales del módulo Solicitudes con filtro por meses y comparación de Total, Completadas y Canceladas
  const solicitudesWeeklyStats = useMemo(() => {
    const filteredRequests = selectedMonth === 'all'
      ? stats.solicitudes
      : stats.solicitudes.filter((s) => {
          const key = getMonthKey(s.fechaInicio || s.fechaProgramada || s.createdAt);
          return key === selectedMonth;
        });

    const countsByStatus = {
      Pendiente: 0,
      'En Proceso': 0,
      Completado: 0,
      Cancelado: 0,
    };

    filteredRequests.forEach((s) => {
      const estado = normalizarEstadoSolicitud(s.estado || s.status);
      countsByStatus[estado] = (countsByStatus[estado] || 0) + 1;
    });

    let weeklyData = [];

    if (selectedMonth !== 'all') {
      const [year, month] = selectedMonth.split('-').map(Number);
      const daysInMonth = new Date(year, month, 0).getDate();
      const shortMonth = MESES_CORTOS[month - 1] || '';

      const ranges = [
        { label: 'Sem. 1', start: 1, end: 7 },
        { label: 'Sem. 2', start: 8, end: 14 },
        { label: 'Sem. 3', start: 15, end: 21 },
        { label: 'Sem. 4', start: 22, end: 28 },
      ];
      if (daysInMonth > 28) {
        ranges.push({ label: 'Sem. 5', start: 29, end: daysInMonth });
      }

      weeklyData = ranges.map((r, idx) => ({
        weekKey: `${selectedMonth}-w${idx + 1}`,
        semana: r.label,
        rangoCompleto: `Semana ${idx + 1} (${String(r.start).padStart(2, '0')}–${String(r.end).padStart(2, '0')} ${shortMonth} ${year})`,
        total: 0,
        completadas: 0,
        canceladas: 0,
      }));

      filteredRequests.forEach((s) => {
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const dt = new Date(rawDate);
        if (Number.isNaN(dt.getTime())) return;

        const weekIdx = Math.min(Math.floor((dt.getDate() - 1) / 7), weeklyData.length - 1);
        const bucket = weeklyData[weekIdx];
        if (!bucket) return;

        const estado = normalizarEstadoSolicitud(s.estado || s.status);
        bucket.total += 1;
        if (estado === 'Completado') bucket.completadas += 1;
        if (estado === 'Cancelado') bucket.canceladas += 1;
      });
    } else {
      const parsedRequests = [];
      let maxMonday = null;

      filteredRequests.forEach((s) => {
        const estado = normalizarEstadoSolicitud(s.estado || s.status);
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const monday = getMondayOfWeek(rawDate);
        if (monday) {
          parsedRequests.push({ estado, mondayKey: getWeekKey(monday), monday });
          if (!maxMonday || monday.getTime() > maxMonday.getTime()) {
            maxMonday = monday;
          }
        }
      });

      const todayMonday = getMondayOfWeek(new Date());
      let anchor = todayMonday;
      if (todayMonday && maxMonday) {
        const fiveWeeksAgo = new Date(todayMonday);
        fiveWeeksAgo.setDate(fiveWeeksAgo.getDate() - 4 * 7);
        const hasRecent = parsedRequests.some((r) => r.monday.getTime() >= fiveWeeksAgo.getTime());
        if (!hasRecent || maxMonday.getTime() > todayMonday.getTime()) {
          anchor = maxMonday;
        }
      } else if (maxMonday) {
        anchor = maxMonday;
      }

      if (anchor) {
        for (let offset = 4; offset >= 0; offset -= 1) {
          const d = new Date(anchor);
          d.setDate(d.getDate() - offset * 7);
          const key = getWeekKey(d);
          const meta = formatWeekMeta(d);
          weeklyData.push({
            weekKey: key,
            semana: offset === 0 && todayMonday && key === getWeekKey(todayMonday) ? 'Esta sem.' : meta.label,
            rangoCompleto: meta.rangoCompleto,
            total: 0,
            completadas: 0,
            canceladas: 0,
          });
        }

        const bucketMap = new Map(weeklyData.map((b) => [b.weekKey, b]));
        parsedRequests.forEach((item) => {
          const bucket = bucketMap.get(item.mondayKey);
          if (!bucket) return;
          bucket.total += 1;
          if (item.estado === 'Completado') bucket.completadas += 1;
          if (item.estado === 'Cancelado') bucket.canceladas += 1;
        });
      }
    }

    return {
      total: filteredRequests.length,
      pendientes: countsByStatus.Pendiente,
      enProceso: countsByStatus['En Proceso'],
      completadas: countsByStatus.Completado,
      canceladas: countsByStatus.Cancelado,
      weeklyData,
    };
  }, [stats.solicitudes, selectedMonth]);

  // Métricas reales del módulo Novedades
  const novedadesStats = useMemo(() => {
    const matrix = {
      Alta: { prioridad: 'Alta', porRevisar: 0, revisado: 0 },
      Media: { prioridad: 'Media', porRevisar: 0, revisado: 0 },
      Baja: { prioridad: 'Baja', porRevisar: 0, revisado: 0 },
    };

    let totalPorRevisar = 0;
    let totalRevisado = 0;

    stats.novedades.forEach((nov) => {
      const estado = normalizarEstadoNovedad(nov.estadoNovedad || nov.estado);
      const prioridad = normalizarPrioridadNovedad(nov);

      if (estado === 'Revisado') {
        matrix[prioridad].revisado += 1;
        totalRevisado += 1;
      } else {
        matrix[prioridad].porRevisar += 1;
        totalPorRevisar += 1;
      }
    });

    return {
      total: stats.novedades.length,
      totalPorRevisar,
      totalRevisado,
      chartData: [matrix.Alta, matrix.Media, matrix.Baja],
    };
  }, [stats.novedades]);

  // Datos reales de conductores (viajes completados reales, calificación real y disponibilidad en vivo)
  // y comentarios reales recibidos desde la app móvil (sin ningún dato quemado)
  const { topDrivers, mobileFeedback } = useMemo(() => {
    const driverNameById = new Map();
    const driverIdByUserId = new Map();

    stats.conductores.forEach((d) => {
      const dId = extractDriverId(d);
      const uId = extractDriverId(d.usuario);
      const name = resolveUserFullName(d, 'Conductor');
      if (dId) driverNameById.set(dId, name);
      if (uId && dId) {
        driverIdByUserId.set(uId, dId);
        driverNameById.set(uId, name);
      }
    });

    const completedTripsByDriver = new Map();
    const activeDrivers = new Set();
    const ratingsByDriver = new Map();
    const feedbackMap = new Map();

    const addRating = (dId, val) => {
      if (!dId || val === null) return;
      if (!ratingsByDriver.has(dId)) ratingsByDriver.set(dId, []);
      ratingsByDriver.get(dId).push(val);
    };

    stats.solicitudes.forEach((s, index) => {
      const rawDriverId = extractDriverId(s.conductorAsignado || s.conductor);
      const resolvedDriverId = driverIdByUserId.get(rawDriverId) || rawDriverId;
      const estado = normalizarEstadoSolicitud(s.estado || s.status);

      if (resolvedDriverId) {
        if (estado === 'Completado') {
          completedTripsByDriver.set(
            resolvedDriverId,
            (completedTripsByDriver.get(resolvedDriverId) || 0) + 1
          );
        }
        if (estado === 'En Proceso') {
          activeDrivers.add(resolvedDriverId);
        }
      }

      const rawRating =
        s.calificacion ??
        s.puntuacion ??
        s.estrellas ??
        s.rating ??
        s.calificacionConductor ??
        s.valoracion?.estrellas ??
        s.valoracion?.calificacion ??
        s.valoracion?.puntuacion ??
        s.calificacionServicio?.estrellas ??
        s.calificacionServicio?.calificacion;

      const parsedRating = parseRatingValue(rawRating);

      const rawComment =
        s.comentario ??
        s.comentarioCliente ??
        s.resena ??
        s.opinion ??
        s.feedback ??
        s.observacionCliente ??
        s.comentarioServicio ??
        s.valoracion?.comentario ??
        s.valoracion?.mensaje ??
        s.calificacionServicio?.comentario ??
        s.calificacionServicio?.mensaje;

      const cleanComment = typeof rawComment === 'string' ? rawComment.trim() : '';

      if (resolvedDriverId && parsedRating !== null) {
        addRating(resolvedDriverId, parsedRating);
      }

      if (cleanComment || parsedRating !== null) {
        const solId = String(s._id || s.id || `sol-${index}`);
        const fechaRef = s.fechaCalificacion || s.fechaFin || s.updatedAt || s.createdAt;
        const clientName =
          s.nombreCliente ||
          resolveUserFullName(s.cliente, '') ||
          'Cliente';
        const driverName =
          resolveUserFullName(s.conductorAsignado || s.conductor, '') ||
          driverNameById.get(resolvedDriverId) ||
          'Conductor asignado';

        feedbackMap.set(solId, {
          id: solId,
          client: clientName,
          driver: driverName,
          time: formatRelativeTime(fechaRef),
          timestamp: fechaRef ? new Date(fechaRef).getTime() : 0,
          stars: parsedRating,
          comment: cleanComment,
          tag: s.codigo ? `${s.codigo} • App Móvil` : 'App Móvil',
        });
      }
    });

    // Incorporar también calificaciones o reseñas si vienen directamente en cada conductor
    const computedDrivers = stats.conductores.map((d) => {
      const dId = extractDriverId(d);
      const name = resolveUserFullName(d, 'Conductor');

      const directRatings = [
        d.calificacion,
        d.calificacionPromedio,
        d.rating,
        d.puntuacion,
      ]
        .map(parseRatingValue)
        .filter((r) => r !== null);

      const embeddedReviews = [
        ...(Array.isArray(d.calificaciones) ? d.calificaciones : []),
        ...(Array.isArray(d.resenas) ? d.resenas : []),
        ...(Array.isArray(d.comentarios) ? d.comentarios : []),
        ...(Array.isArray(d.valoraciones) ? d.valoraciones : []),
      ];

      embeddedReviews.forEach((rev, rIdx) => {
        if (!rev || typeof rev !== 'object') return;
        const rStars = parseRatingValue(rev.calificacion ?? rev.estrellas ?? rev.puntuacion ?? rev.rating);
        const rComment = typeof (rev.comentario ?? rev.mensaje ?? rev.resena ?? rev.opinion) === 'string'
          ? (rev.comentario ?? rev.mensaje ?? rev.resena ?? rev.opinion).trim()
          : '';
        if (rStars !== null) addRating(dId, rStars);

        const revKey = String(rev.solicitud?._id || rev.solicitud || rev._id || rev.id || `${dId}-rev-${rIdx}`);
        if ((rComment || rStars !== null) && !feedbackMap.has(revKey)) {
          const fechaRef = rev.fecha || rev.createdAt || rev.updatedAt;
          feedbackMap.set(revKey, {
            id: revKey,
            client: rev.nombreCliente || resolveUserFullName(rev.cliente, 'Cliente'),
            driver: name,
            time: formatRelativeTime(fechaRef),
            timestamp: fechaRef ? new Date(fechaRef).getTime() : 0,
            stars: rStars,
            comment: rComment,
            tag: 'App Móvil',
          });
        }
      });

      const allDriverRatings = [...(ratingsByDriver.get(dId) || []), ...directRatings];
      const avgRating = allDriverRatings.length > 0
        ? allDriverRatings.reduce((acc, v) => acc + v, 0) / allDriverRatings.length
        : null;

      const explicitBackendTrips = [d.viajesRealizados, d.numeroServicios, d.totalViajes]
        .map((v) => Number(v))
        .find((v) => !Number.isNaN(v) && v >= 0);

      const countedTrips = completedTripsByDriver.get(dId) || 0;
      const trips = explicitBackendTrips !== undefined
        ? Math.max(explicitBackendTrips, countedTrips)
        : countedTrips;

      const isAvailable =
        d.disponible !== false &&
        d.estado !== false &&
        d.estado !== 'INACTIVO' &&
        !activeDrivers.has(dId);

      return {
        id: dId || name,
        name,
        trips,
        rating: avgRating,
        status: isAvailable ? 'Disponible' : 'Ocupado',
        phone: d.usuario?.telefono || d.telefono || '—',
      };
    });

    computedDrivers.sort((a, b) => {
      if ((b.rating ?? -1) !== (a.rating ?? -1)) return (b.rating ?? -1) - (a.rating ?? -1);
      if (b.trips !== a.trips) return b.trips - a.trips;
      if (a.status !== b.status) return a.status === 'Disponible' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    const sortedFeedback = Array.from(feedbackMap.values())
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 4);

    return {
      topDrivers: computedDrivers.slice(0, 4),
      mobileFeedback: sortedFeedback,
    };
  }, [stats.conductores, stats.solicitudes]);

  return (
    <div
      className="p-3 sm:p-5 lg:p-[24px_28px_36px]"
      style={{
        background: brandColors.bg,
        minHeight: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* SECCIÓN DE GRÁFICAS INDIVIDUALES: Solicitudes y Novedades conectados a datos reales */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Gráfica 1: Módulo Solicitudes (Líneas con área sombreada / Barras por semana y filtro por meses) */}
        <article
          className="p-4 sm:p-6"
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
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
                Solicitudes por Semana
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Comparativa semanal de totales, completadas y canceladas
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* Filtro por meses */}
              <div style={{ position: 'relative' }}>
                <select
                  aria-label="Filtrar solicitudes por mes"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    height: 32,
                    padding: '0 26px 0 10px',
                    borderRadius: 10,
                    background: '#f0f5ff',
                    border: '1px solid rgba(1, 37, 56, 0.08)',
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: brandColors.primaryDark,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="all">Todos los meses</option>
                  {availableMonths.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>

              {/* Selector de tipo de gráfico: Líneas / Barras */}
              <div
                role="group"
                aria-label="Cambiar tipo de gráfico de solicitudes"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#f1f5f9',
                  padding: 3,
                  borderRadius: 10,
                  border: '1px solid rgba(1, 37, 56, 0.06)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSolicitudesChartType('area')}
                  style={{
                    border: 'none',
                    borderRadius: 8,
                    padding: '4px 9px',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: solicitudesChartType === 'area' ? brandColors.primary : 'transparent',
                    color: solicitudesChartType === 'area' ? '#ffffff' : brandColors.textMuted,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 17l6-6 4 4 8-8" />
                    <path d="M3 21h18" />
                  </svg>
                  <span>Líneas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSolicitudesChartType('bar')}
                  style={{
                    border: 'none',
                    borderRadius: 8,
                    padding: '4px 9px',
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: solicitudesChartType === 'bar' ? brandColors.primary : 'transparent',
                    color: solicitudesChartType === 'bar' ? '#ffffff' : brandColors.textMuted,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  <span>Barras</span>
                </button>
              </div>

              <Link
                to="/service-requests"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: brandColors.accent,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Ver →
              </Link>
            </div>
          </div>

          <div style={{ width: '100%', height: 230, minHeight: 230 }}>
            {loading && stats.solicitudes.length === 0 ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 13.5 }}>
                Cargando datos de solicitudes...
              </div>
            ) : stats.solicitudes.length === 0 ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 13.5 }}>
                No hay solicitudes registradas actualmente.
              </div>
            ) : solicitudesChartType === 'area' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={solicitudesWeeklyStats.weeklyData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="solicitudesTotalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={brandColors.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={brandColors.primary} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="solicitudesCompGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={brandColors.accent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={brandColors.accent} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="solicitudesCancGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={brandColors.primaryDark} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={brandColors.primaryDark} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(1, 37, 56, 0.06)" />
                  <XAxis
                    dataKey="semana"
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
                    wrapperStyle={{ paddingBottom: 8, fontSize: 12, fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total"
                    stroke={brandColors.primary}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#solicitudesTotalGrad)"
                    dot={{ r: 4, fill: '#ffffff', stroke: brandColors.primary, strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: brandColors.primary }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completadas"
                    name="Completadas"
                    stroke={brandColors.accent}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#solicitudesCompGrad)"
                    dot={{ r: 4, fill: '#ffffff', stroke: brandColors.accent, strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: brandColors.accent }}
                  />
                  <Area
                    type="monotone"
                    dataKey="canceladas"
                    name="Canceladas"
                    stroke={brandColors.primaryDark}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#solicitudesCancGrad)"
                    dot={{ r: 4, fill: '#ffffff', stroke: brandColors.primaryDark, strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: brandColors.primaryDark }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={solicitudesWeeklyStats.weeklyData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(1, 37, 56, 0.06)" />
                  <XAxis
                    dataKey="semana"
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
                    wrapperStyle={{ paddingBottom: 8, fontSize: 12, fontWeight: 600 }}
                  />
                  <Bar dataKey="total" name="Total" fill={brandColors.primary} radius={[8, 8, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="completadas" name="Completadas" fill={brandColors.accent} radius={[8, 8, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="canceladas" name="Canceladas" fill={brandColors.primaryDark} radius={[8, 8, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
            <div
              style={{
                background: 'rgba(27, 118, 142, 0.1)',
                border: '1px solid rgba(27, 118, 142, 0.25)',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: brandColors.primary }}>Total</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{solicitudesWeeklyStats.total}</span>
            </div>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid rgba(1, 37, 56, 0.08)',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>Pend. / Proc.</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>
                {solicitudesWeeklyStats.pendientes + solicitudesWeeklyStats.enProceso}
              </span>
            </div>
            <div
              style={{
                background: 'rgba(251, 152, 51, 0.12)',
                border: '1px solid rgba(251, 152, 51, 0.35)',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#C2610C' }}>Completadas</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{solicitudesWeeklyStats.completadas}</span>
            </div>
            <div
              style={{
                background: 'rgba(1, 37, 56, 0.06)',
                border: '1px solid rgba(1, 37, 56, 0.16)',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: brandColors.primaryDark }}>Canceladas</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{solicitudesWeeklyStats.canceladas}</span>
            </div>
          </div>
        </article>

        {/* Gráfica 2: Módulo Novedades (Barras por Prioridad y Estado con colores oficiales del proyecto) */}
        <article
          className="p-4 sm:p-6"
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
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
                Novedades por Prioridad y Estado
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Comparativa de novedades pendientes por revisar vs revisadas
              </p>
            </div>
            <Link
              to="/incidents"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: brandColors.accent,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Ver novedades →
            </Link>
          </div>

          <div style={{ width: '100%', height: 230, minHeight: 230 }}>
            {loading && novedadesStats.total === 0 ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 13.5 }}>
                Cargando datos de novedades...
              </div>
            ) : novedadesStats.total === 0 ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 13.5 }}>
                No hay novedades registradas actualmente.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={novedadesStats.chartData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(1, 37, 56, 0.06)" />
                  <XAxis
                    dataKey="prioridad"
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
                    wrapperStyle={{ paddingBottom: 8, fontSize: 12, fontWeight: 600 }}
                  />
                  <Bar dataKey="porRevisar" name="Por revisar" fill={brandColors.accent} radius={[8, 8, 0, 0]} maxBarSize={42} />
                  <Bar dataKey="revisado" name="Revisado" fill={brandColors.primary} radius={[8, 8, 0, 0]} maxBarSize={42} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid rgba(1, 37, 56, 0.05)',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>Total</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{novedadesStats.total}</span>
            </div>
            <div
              style={{
                background: 'rgba(251, 152, 51, 0.12)',
                border: '1px solid rgba(251, 152, 51, 0.35)',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#C2610C' }}>Por revisar</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{novedadesStats.totalPorRevisar}</span>
            </div>
            <div
              style={{
                background: 'rgba(27, 118, 142, 0.1)',
                border: '1px solid rgba(27, 118, 142, 0.25)',
                borderRadius: 12,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 600, color: brandColors.primary }}>Revisado</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{novedadesStats.totalRevisado}</span>
            </div>
          </div>
        </article>
      </section>

      {/* SECCIÓN PRINCIPAL: Conductores y Comentarios reales desde la App Móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Columna Izquierda: Conductores Destacados con datos reales de viajes y calificaciones */}
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
                          {driver.trips} {driver.trips === 1 ? 'viaje' : 'viajes'}
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

        {/* Columna Derecha: Comentarios reales recibidos desde la App Móvil */}
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

          {mobileFeedback.length === 0 ? (
            <div
              style={{
                flex: 1,
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '28px 18px',
                borderRadius: 16,
                background: '#f8fafc',
                border: '1px dashed rgba(1, 37, 56, 0.12)',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'rgba(27, 118, 142, 0.1)',
                  color: brandColors.primary,
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: 10,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: brandColors.primaryDark }}>
                {loading ? 'Cargando comentarios...' : 'Aún no hay comentarios desde la App Móvil'}
              </div>
              <p style={{ margin: '6px 0 0', maxWidth: 340, fontSize: 12, color: brandColors.textMuted, lineHeight: 1.5 }}>
                Cuando los usuarios califiquen o dejen una opinión al finalizar su viaje, aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mobileFeedback.map((item) => (
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
                    {item.stars !== null && <StarRating rating={item.stars} />}
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

                  {item.comment && (
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
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
