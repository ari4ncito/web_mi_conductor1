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
const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

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

function getDayKey(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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

function getYearKey(dateInput) {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;
  return String(d.getFullYear());
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

const DASHBOARD_CACHE_KEY = 'mc_dashboard_cache_v1';

function getInitialDashboardStats() {
  try {
    const raw = localStorage.getItem(DASHBOARD_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          conductores: Array.isArray(parsed.conductores) ? parsed.conductores : [],
          solicitudes: Array.isArray(parsed.solicitudes) ? parsed.solicitudes : [],
          novedades: Array.isArray(parsed.novedades) ? parsed.novedades : [],
        };
      }
    }
  } catch (e) {}
  return {
    conductores: [],
    solicitudes: [],
    novedades: [],
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState(getInitialDashboardStats);
  const [loading, setLoading] = useState(() => stats.conductores.length === 0 && stats.solicitudes.length === 0);
  const [solicitudesChartType, setSolicitudesChartType] = useState('area');
  const [solicitudesPeriodo, setSolicitudesPeriodo] = useState('semana'); // 'dia' | 'semana' | 'mes' | 'año'

  const fetchAllModuleData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      window.dispatchEvent(new CustomEvent('dashboard:updating', { detail: { loading: true } }));
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

      const freshStats = {
        conductores: extractList(driversRes),
        solicitudes: extractList(solicitudesRes),
        novedades: extractList(novedadesRes),
      };

      setStats(freshStats);
      try {
        localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(freshStats));
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('dashboard:updating', { detail: { loading: false } }));
    }
  }, []);

  // Escuchar evento de actualización disparado desde el botón de la Topbar
  useEffect(() => {
    const handleTopbarRefresh = () => {
      fetchAllModuleData();
    };
    window.addEventListener('dashboard:refresh', handleTopbarRefresh);
    return () => window.removeEventListener('dashboard:refresh', handleTopbarRefresh);
  }, [fetchAllModuleData]);

  useEffect(() => {
    fetchAllModuleData();

    // Suscripción con reconexión automática en tiempo real
    const unsubscribe = subscribeSocketConsumer(() => {
      fetchAllModuleData({ silent: true });
    });

    const handleSolicitudEvents = () => {
      fetchAllModuleData({ silent: true });
    };

    if (socket) {
      socket.on('solicitud:creada', handleSolicitudEvents);
      socket.on('solicitud:actualizada', handleSolicitudEvents);
      socket.on('solicitud:completada', handleSolicitudEvents);
      socket.on('solicitud:cancelada', handleSolicitudEvents);
      socket.on('novedad:creada', handleSolicitudEvents);
      socket.on('novedad:actualizada', handleSolicitudEvents);
      socket.on('conductor:actualizado', handleSolicitudEvents);
    }

    return () => {
      unsubscribe();
      if (socket) {
        socket.off('solicitud:creada', handleSolicitudEvents);
        socket.off('solicitud:actualizada', handleSolicitudEvents);
        socket.off('solicitud:completada', handleSolicitudEvents);
        socket.off('solicitud:cancelada', handleSolicitudEvents);
        socket.off('novedad:creada', handleSolicitudEvents);
        socket.off('novedad:actualizada', handleSolicitudEvents);
        socket.off('conductor:actualizado', handleSolicitudEvents);
      }
    };
  }, [fetchAllModuleData]);

  // Métricas reales del módulo Solicitudes agrupadas por día, semana, mes o año
  const solicitudesWeeklyStats = useMemo(() => {
    const filteredRequests = stats.solicitudes;

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

    let chartData = [];

    // ==========================================
    // 1. MODO: DÍA (Últimos 7 días con fecha/día)
    // ==========================================
    if (solicitudesPeriodo === 'dia') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Encontrar la fecha más reciente registrada o hoy
      let anchorDate = today;
      let maxDate = null;
      filteredRequests.forEach((s) => {
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const dt = new Date(rawDate);
        if (!Number.isNaN(dt.getTime())) {
          dt.setHours(0, 0, 0, 0);
          if (!maxDate || dt.getTime() > maxDate.getTime()) {
            maxDate = dt;
          }
        }
      });

      if (maxDate && maxDate.getTime() > today.getTime()) {
        anchorDate = maxDate;
      }

      for (let i = 6; i >= 0; i -= 1) {
        const d = new Date(anchorDate);
        d.setDate(d.getDate() - i);
        const key = getDayKey(d);
        const isToday = getDayKey(today) === key;
        const diaSem = DIAS_CORTOS[d.getDay()];

        chartData.push({
          key,
          semana: isToday ? 'Hoy' : `${diaSem} ${d.getDate()}`,
          rangoCompleto: `${diaSem} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]} ${d.getFullYear()}`,
          total: 0,
          completadas: 0,
          canceladas: 0,
        });
      }

      const bucketMap = new Map(chartData.map((b) => [b.key, b]));
      filteredRequests.forEach((s) => {
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const key = getDayKey(rawDate);
        const bucket = bucketMap.get(key);
        if (!bucket) return;
        const estado = normalizarEstadoSolicitud(s.estado || s.status);
        bucket.total += 1;
        if (estado === 'Completado') bucket.completadas += 1;
        if (estado === 'Cancelado') bucket.canceladas += 1;
      });
    }

    // ==========================================
    // 2. MODO: SEMANA (Comparativa semanal de las últimas semanas)
    // ==========================================
    else if (solicitudesPeriodo === 'semana') {
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
          chartData.push({
            key,
            semana: offset === 0 && todayMonday && key === getWeekKey(todayMonday) ? 'Esta sem.' : meta.label,
            rangoCompleto: meta.rangoCompleto,
            total: 0,
            completadas: 0,
            canceladas: 0,
          });
        }

        const bucketMap = new Map(chartData.map((b) => [b.key, b]));
        parsedRequests.forEach((item) => {
          const bucket = bucketMap.get(item.mondayKey);
          if (!bucket) return;
          bucket.total += 1;
          if (item.estado === 'Completado') bucket.completadas += 1;
          if (item.estado === 'Cancelado') bucket.canceladas += 1;
        });
      }
    }

    // ==========================================
    // 3. MODO: MES (Todos los meses del año para ver el año completo)
    // ==========================================
    else if (solicitudesPeriodo === 'mes') {
      let targetYear = new Date().getFullYear();
      let maxReqYear = null;
      stats.solicitudes.forEach((s) => {
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const dt = new Date(rawDate);
        if (!Number.isNaN(dt.getTime())) {
          const yr = dt.getFullYear();
          if (!maxReqYear || yr > maxReqYear) maxReqYear = yr;
        }
      });
      if (maxReqYear && maxReqYear > targetYear) {
        targetYear = maxReqYear;
      }

      for (let m = 0; m < 12; m += 1) {
        const key = `${targetYear}-${String(m + 1).padStart(2, '0')}`;
        chartData.push({
          key,
          semana: MESES_CORTOS[m],
          rangoCompleto: `${MESES_LARGOS[m]} ${targetYear}`,
          total: 0,
          completadas: 0,
          canceladas: 0,
        });
      }

      const bucketMap = new Map(chartData.map((b) => [b.key, b]));
      stats.solicitudes.forEach((s) => {
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const key = getMonthKey(rawDate);
        const bucket = bucketMap.get(key);
        if (!bucket) return;
        const estado = normalizarEstadoSolicitud(s.estado || s.status);
        bucket.total += 1;
        if (estado === 'Completado') bucket.completadas += 1;
        if (estado === 'Cancelado') bucket.canceladas += 1;
      });
    }

    // ==========================================
    // 4. MODO: AÑO (Últimos años comparativos)
    // ==========================================
    else if (solicitudesPeriodo === 'año') {
      const currentYear = new Date().getFullYear();
      const yearsSet = new Set([currentYear - 2, currentYear - 1, currentYear]);
      stats.solicitudes.forEach((s) => {
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const dt = new Date(rawDate);
        if (!Number.isNaN(dt.getTime())) {
          yearsSet.add(dt.getFullYear());
        }
      });

      const sortedYears = Array.from(yearsSet).sort((a, b) => a - b);
      const displayYears = sortedYears.slice(-5); // últimos 5 años

      chartData = displayYears.map((yr) => ({
        key: String(yr),
        semana: String(yr),
        rangoCompleto: `Año ${yr}`,
        total: 0,
        completadas: 0,
        canceladas: 0,
      }));

      const bucketMap = new Map(chartData.map((b) => [b.key, b]));
      stats.solicitudes.forEach((s) => {
        const rawDate = s.fechaInicio || s.fechaProgramada || s.createdAt;
        const key = getYearKey(rawDate);
        const bucket = bucketMap.get(key);
        if (!bucket) return;
        const estado = normalizarEstadoSolicitud(s.estado || s.status);
        bucket.total += 1;
        if (estado === 'Completado') bucket.completadas += 1;
        if (estado === 'Cancelado') bucket.canceladas += 1;
      });
    }

    return {
      total: filteredRequests.length,
      pendientes: countsByStatus.Pendiente,
      enProceso: countsByStatus['En Proceso'],
      completadas: countsByStatus.Completado,
      canceladas: countsByStatus.Cancelado,
      weeklyData: chartData,
    };
  }, [stats.solicitudes, solicitudesPeriodo]);

  // Métricas reales del módulo Novedades
  const novedadesStats = useMemo(() => {
    const matrix = {
      Alta: { prioridad: 'Alta', porRevisar: 0, revisado: 0 },
      Media: { prioridad: 'Media', porRevisar: 0, revisado: 0 },
      Baja: { prioridad: 'Baja', porRevisar: 0, revisado: 0 },
    };

    stats.novedades.forEach((n) => {
      const prioridad = normalizarPrioridadNovedad(n);
      const estado = normalizarEstadoNovedad(n.estado || n.status);

      if (matrix[prioridad]) {
        if (estado === 'Revisado') {
          matrix[prioridad].revisado += 1;
        } else {
          matrix[prioridad].porRevisar += 1;
        }
      }
    });

    const list = [matrix.Alta, matrix.Media, matrix.Baja];
    const totalPorRevisar = list.reduce((acc, curr) => acc + curr.porRevisar, 0);
    const totalRevisadas = list.reduce((acc, curr) => acc + curr.revisado, 0);

    return {
      prioridadesData: list,
      totalNovedades: stats.novedades.length,
      totalPorRevisar,
      totalRevisadas,
    };
  }, [stats.novedades]);

  // Ranking real de los mejores conductores calculado por su calificación
  const topConductores = useMemo(() => {
    const parsed = stats.conductores.map((driver) => {
      const rating =
        parseRatingValue(driver.ratingPromedio) ??
        parseRatingValue(driver.calificacionPromedio) ??
        parseRatingValue(driver.calificacion) ??
        parseRatingValue(driver.rating) ??
        parseRatingValue(driver.puntuacion);

      const totalViajes =
        Number(driver.totalViajes) ||
        Number(driver.serviciosRealizados) ||
        Number(driver.serviciosCompletados) ||
        Number(driver.viajes) ||
        0;

      const nombre = resolveUserFullName(driver, 'Conductor');
      const driverId = extractDriverId(driver);

      return {
        id: driverId,
        nombre,
        rating,
        totalViajes,
        activo: driver.activo ?? true,
      };
    });

    parsed.sort((a, b) => {
      const rA = a.rating ?? -1;
      const rB = b.rating ?? -1;
      if (rB !== rA) return rB - rA;
      return b.totalViajes - a.totalViajes;
    });

    return parsed.slice(0, 5);
  }, [stats.conductores]);

  // Comentarios y calificaciones dejados por clientes desde la app móvil
  const comentariosClientes = useMemo(() => {
    // Filtrar solicitudes que tengan comentario o calificación del cliente
    const conFeedback = stats.solicitudes.filter((s) => {
      const tieneComentario = typeof s.comentarioCliente === 'string' && s.comentarioCliente.trim().length > 0;
      const tieneCalificacion = (s.calificacionConductor !== null && s.calificacionConductor !== undefined) ||
        (s.calificacion !== null && s.calificacion !== undefined);
      return tieneComentario || tieneCalificacion;
    });

    // Ordenar de más reciente a más antiguo
    conFeedback.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.fechaFin || a.fechaInicio || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.fechaFin || b.fechaInicio || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return conFeedback.slice(0, 5).map((s) => {
      const clienteNombre = resolveUserFullName(s.cliente, 'Cliente');
      const conductorNombre = s.conductorAsignado
        ? resolveUserFullName(s.conductorAsignado, 'Conductor')
        : s.conductor
        ? resolveUserFullName(s.conductor, 'Conductor')
        : 'Sin asignar';
      const rating = Number(s.calificacionConductor ?? s.calificacion ?? 5);
      const comentario = s.comentarioCliente && s.comentarioCliente.trim().length > 0
        ? s.comentarioCliente.trim()
        : 'Servicio finalizado con éxito sin comentarios adicionales.';
      const rawDate = s.updatedAt || s.fechaFin || s.fechaInicio || s.createdAt;
      const codigo = s.codigo || (s._id ? `#${String(s._id).slice(-5).toUpperCase()}` : '');

      return {
        id: s._id || s.id,
        codigo,
        cliente: clienteNombre,
        conductor: conductorNombre,
        rating: Math.max(1, Math.min(5, rating)),
        comentario,
        fecha: formatRelativeTime(rawDate),
      };
    });
  }, [stats.solicitudes]);

  // Tarjetas principales superiores con datos reales del negocio
  const kpiCards = useMemo(() => {
    const totalSolicitudes = stats.solicitudes.length;
    const completadas = stats.solicitudes.filter(
      (s) => normalizarEstadoSolicitud(s.estado || s.status) === 'Completado'
    ).length;
    const conductoresActivos = stats.conductores.filter((d) => d.activo !== false).length;
    const novedadesPendientes = novedadesStats.totalPorRevisar;

    return [
      {
        id: 'kpi-conductores',
        title: 'Conductores Registrados',
        value: stats.conductores.length,
        subtitle: `${conductoresActivos} activos actualmente`,
        accent: brandColors.primary,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        id: 'kpi-solicitudes',
        title: 'Solicitudes Totales',
        value: totalSolicitudes,
        subtitle: `${completadas} viajes completados`,
        accent: brandColors.accent,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        ),
      },
      {
        id: 'kpi-novedades',
        title: 'Novedades Activas',
        value: novedadesStats.totalNovedades,
        subtitle: `${novedadesPendientes} por atender`,
        accent: '#EF4444',
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        ),
      },
      {
        id: 'kpi-tasa-exito',
        title: 'Tasa de Cumplimiento',
        value: totalSolicitudes > 0 ? `${Math.round((completadas / totalSolicitudes) * 100)}%` : '100%',
        subtitle: 'Servicios finalizados con éxito',
        accent: '#10B981',
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
    ];
  }, [stats.conductores, stats.solicitudes, novedadesStats]);

  return (
    <div
      className="w-full max-w-[1400px] mx-auto px-3 sm:px-5 pb-12 flex flex-col gap-5 sm:gap-6 pt-4 sm:pt-5 overflow-x-hidden"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Tarjetas KPI Superiores ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.id}
            className="p-4 sm:p-5"
            style={{
              background: '#ffffff',
              borderRadius: 20,
              border: '1px solid rgba(1, 37, 56, 0.08)',
              boxShadow: '0 8px 22px rgba(1, 37, 56, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: brandColors.textMuted }}>
                {kpi.title}
              </p>
              <h3
                style={{
                  margin: '4px 0',
                  fontSize: 24,
                  fontWeight: 800,
                  color: brandColors.primaryDark,
                  fontFamily: 'Georgia, serif',
                }}
              >
                {kpi.value}
              </h3>
              <p style={{ margin: 0, fontSize: 11.5, fontWeight: 500, color: brandColors.textMuted }}>
                {kpi.subtitle}
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: `${kpi.accent}15`,
                color: kpi.accent,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              {kpi.icon}
            </div>
          </div>
        ))}
      </section>

      {/* ── Fila de Gráficos Principales ── */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 w-full min-w-0">
        {/* Gráfica 1: Módulo Solicitudes (Total, Completadas y Canceladas agrupadas por Día, Semana, Mes o Año) */}
        <article
          className="p-4 sm:p-6 w-full min-w-0"
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
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
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
                Solicitudes por {solicitudesPeriodo === 'dia' ? 'Día' : solicitudesPeriodo === 'semana' ? 'Semana' : solicitudesPeriodo === 'mes' ? 'Mes' : 'Año'}
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Comparativa {solicitudesPeriodo === 'dia' ? 'diaria' : solicitudesPeriodo === 'semana' ? 'semanal' : solicitudesPeriodo === 'mes' ? 'mensual' : 'anual'} de totales, completadas y canceladas
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* Selector de Período: Día | Semana | Mes | Año */}
              <div
                role="group"
                aria-label="Seleccionar período de agrupación"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#f1f5f9',
                  padding: 3,
                  borderRadius: 10,
                  border: '1px solid rgba(1, 37, 56, 0.06)',
                }}
              >
                {[
                  { id: 'dia', label: 'Día' },
                  { id: 'semana', label: 'Semana' },
                  { id: 'mes', label: 'Mes' },
                  { id: 'año', label: 'Año' },
                ].map((item) => {
                  const isActive = solicitudesPeriodo === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSolicitudesPeriodo(item.id)}
                      style={{
                        border: 'none',
                        borderRadius: 8,
                        padding: '4px 8px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: isActive ? brandColors.primaryDark : 'transparent',
                        color: isActive ? '#ffffff' : brandColors.textMuted,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
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
                    isAnimationActive={false}
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
                    isAnimationActive={false}
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
                    isAnimationActive={false}
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
                  <Bar dataKey="total" name="Total" fill={brandColors.primary} radius={[8, 8, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                  <Bar dataKey="completadas" name="Completadas" fill={brandColors.accent} radius={[8, 8, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                  <Bar dataKey="canceladas" name="Canceladas" fill={brandColors.primaryDark} radius={[8, 8, 0, 0]} maxBarSize={28} isAnimationActive={false} />
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
          className="p-4 sm:p-6 w-full min-w-0"
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
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
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
                Novedades Operacionales
              </h2>
              <p style={{ margin: '4px 0 0', color: brandColors.textMuted, fontSize: 13 }}>
                Distribución por nivel de prioridad y estado de atención
              </p>
            </div>
            <Link
              to="/incidents"
              className="self-start sm:self-auto"
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

          <div style={{ width: '100%', height: 230, minHeight: 230 }}>
            {loading && stats.novedades.length === 0 ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 13.5 }}>
                Cargando datos de novedades...
              </div>
            ) : stats.novedades.length === 0 ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: '#94a3b8', fontSize: 13.5 }}>
                No hay novedades registradas en el sistema.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={novedadesStats.prioridadesData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
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
                  <Bar dataKey="porRevisar" name="Por revisar" fill={brandColors.accent} radius={[8, 8, 0, 0]} maxBarSize={32} isAnimationActive={false} />
                  <Bar dataKey="revisado" name="Revisadas" fill={brandColors.primary} radius={[8, 8, 0, 0]} maxBarSize={32} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
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
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>Total</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{novedadesStats.totalNovedades}</span>
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
              <span style={{ fontSize: 11.5, fontWeight: 600, color: brandColors.primary }}>Revisadas</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: brandColors.primaryDark }}>{novedadesStats.totalRevisadas}</span>
            </div>
          </div>
        </article>
      </section>

      {/* ── Fila de Tablas y Rankings Inferiores ── */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 w-full min-w-0">
        {/* Tabla: Top 5 Conductores con Mejor Calificación */}
        <article
          className="p-4 sm:p-6 w-full min-w-0"
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4">
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: brandColors.primaryDark,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Conductores Mejor Valorados
              </h2>
              <p style={{ margin: '3px 0 0', color: brandColors.textMuted, fontSize: 12.5 }}>
                Top 5 según promedio de calificaciones y servicios realizados
              </p>
            </div>
            <Link
              to="/drivers"
              className="self-start sm:self-auto"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: brandColors.accent,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Ver todos →
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <table style={{ width: '100%', minWidth: 280, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '8px 6px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    #
                  </th>
                  <th style={{ padding: '8px 6px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Conductor
                  </th>
                  <th style={{ padding: '8px 6px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    Valoración
                  </th>
                  <th style={{ padding: '8px 6px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                    Viajes
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && topConductores.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      Cargando conductores...
                    </td>
                  </tr>
                ) : topConductores.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      No hay conductores disponibles actualmente.
                    </td>
                  </tr>
                ) : (
                  topConductores.map((driver, idx) => (
                    <tr
                      key={driver.id || idx}
                      style={{
                        borderBottom: idx === topConductores.length - 1 ? 'none' : '1px solid #f8fafc',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '12px 6px', fontSize: 12, fontWeight: 700, color: idx === 0 ? brandColors.accent : brandColors.primary }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '12px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: idx === 0 ? 'rgba(251, 152, 51, 0.15)' : 'rgba(27, 118, 142, 0.12)',
                              color: idx === 0 ? brandColors.accentDark : brandColors.primary,
                              display: 'grid',
                              placeItems: 'center',
                              fontWeight: 800,
                              fontSize: 12.5,
                              flexShrink: 0,
                            }}
                          >
                            {driver.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: brandColors.primaryDark }}>
                              {driver.nombre}
                            </p>
                            <p style={{ margin: 0, fontSize: 11, color: driver.activo ? '#10B981' : '#94A3B8' }}>
                              {driver.activo ? 'Disponible' : 'Inactivo'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                        <StarRating rating={driver.rating} />
                      </td>
                      <td style={{ padding: '12px 6px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: brandColors.primaryDark }}>
                        {driver.totalViajes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        {/* Card: Comentarios y Reseñas de Clientes desde la App Móvil */}
        <article
          className="p-4 sm:p-6 w-full min-w-0"
          style={{
            background: '#ffffff',
            borderRadius: 24,
            border: '1px solid rgba(1, 37, 56, 0.08)',
            boxShadow: '0 12px 28px rgba(1, 37, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-4">
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 700,
                  color: brandColors.primaryDark,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Comentarios de Clientes
              </h2>
              <p style={{ margin: '3px 0 0', color: brandColors.textMuted, fontSize: 12.5 }}>
                Calificaciones y opiniones recibidas desde la app móvil
              </p>
            </div>
            <Link
              to="/service-requests"
              className="self-start sm:self-auto"
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: brandColors.accent,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Ver servicios →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading && comentariosClientes.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                Cargando comentarios...
              </div>
            ) : comentariosClientes.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                Aún no hay comentarios ni calificaciones registradas desde la app móvil.
              </div>
            ) : (
              comentariosClientes.map((item, idx) => {
                return (
                  <div
                    key={item.id || idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: '#f8fafc',
                      border: '1px solid rgba(1, 37, 56, 0.05)',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(27, 118, 142, 0.12)',
                            color: brandColors.primary,
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: 800,
                            fontSize: 12,
                            flexShrink: 0,
                          }}
                        >
                          {item.cliente.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              fontWeight: 700,
                              color: brandColors.primaryDark,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.cliente}
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 11, color: '#64748B' }}>
                            Conductor: <strong style={{ color: brandColors.primaryDark }}>{item.conductor}</strong>
                            {item.codigo && <span style={{ marginLeft: 6, color: '#94a3b8' }}>({item.codigo})</span>}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <StarRating rating={item.rating} />
                        <p style={{ margin: '3px 0 0', fontSize: 10.5, color: '#94a3b8' }}>{item.fecha}</p>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: '#334155',
                        background: '#ffffff',
                        padding: '8px 12px',
                        borderRadius: 10,
                        border: '1px solid rgba(1, 37, 56, 0.04)',
                        fontStyle: 'italic',
                        lineHeight: 1.45,
                      }}
                    >
                      “{item.comentario}”
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
