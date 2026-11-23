
import { useMemo } from "react";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiMapPin,
} from "react-icons/fi";

function obtenerFecha(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);

    return Number.isNaN(date.getTime()) ? null : date;
}

const IncidentStats = ({ incidents = [] }) => {
    const stats = useMemo(() => {
        const pendientes = incidents.filter(
            incident =>
                incident.estadoOriginal === "PENDIENTE" ||
                incident.estadoOriginal === "EN_ATENCION"
        ).length;

        const hoy = new Date();

        const resueltasHoy = incidents.filter(incident => {
            if (
                incident.estadoOriginal !== "RESUELTA" &&
                incident.estadoOriginal !== "CERRADA"
            ) {
                return false;
            }

            const fechaCierre = obtenerFecha(incident.fechaCierre);

            return (
                fechaCierre &&
                fechaCierre.getFullYear() === hoy.getFullYear() &&
                fechaCierre.getMonth() === hoy.getMonth() &&
                fechaCierre.getDate() === hoy.getDate()
            );
        }).length;

        const tiemposResolucion = incidents
            .filter(incident =>
                incident.estadoOriginal === "RESUELTA" ||
                incident.estadoOriginal === "CERRADA"
            )
            .map(incident => {
                const creada = obtenerFecha(
                    incident.createdAt || incident.fechaCreacion
                );

                const cierre = obtenerFecha(incident.fechaCierre);

                if (!creada || !cierre || cierre < creada) {
                    return null;
                }

                return (cierre.getTime() - creada.getTime()) / 60000;
            })
            .filter(tiempo => tiempo !== null);

        const promedio = tiemposResolucion.length
            ? Math.round(
                tiemposResolucion.reduce(
                    (total, tiempo) => total + tiempo,
                    0
                ) / tiemposResolucion.length
            )
            : null;

        const criticas = incidents.filter(
            incident => incident.severidad === "CRITICA"
        ).length;

        const formatearTiempo = minutos => {
            if (minutos === null) return "—";

            if (minutos < 60) {
                return `${minutos} min`;
            }

            const horas = Math.floor(minutos / 60);
            const minutosRestantes = minutos % 60;

            return minutosRestantes
                ? `${horas} h ${minutosRestantes} min`
                : `${horas} h`;
        };

        return [
            {
                title: "Novedades Pendientes",
                value: pendientes.toLocaleString("es-CO"),
                color: "bg-red-100",
                iconColor: "text-red-500",
                icon: <FiAlertCircle size={22} />,
            },
            {
                title: "Resueltas Hoy",
                value: resueltasHoy.toLocaleString("es-CO"),
                color: "bg-cyan-100",
                iconColor: "text-cyan-600",
                icon: <FiCheckCircle size={22} />,
            },
            {
                title: "Tiempo Promedio",
                value: formatearTiempo(promedio),
                color: "bg-blue-100",
                iconColor: "text-blue-600",
                icon: <FiClock size={22} />,
            },
            {
                title: "Novedades Críticas",
                value: criticas.toLocaleString("es-CO"),
                color: "bg-orange-100",
                iconColor: "text-orange-500",
                icon: <FiMapPin size={22} />,
            },
        ];
    }, [incidents]);

    return (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(item => (
                <article
                    key={item.title}
                    className="rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                    <div className="flex items-start justify-between">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color} ${item.iconColor}`}
                        >
                            {item.icon}
                        </div>
                    </div>

                    <div className="mt-5">
                        <p className="text-sm font-medium text-slate-500">
                            {item.title}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-800">
                            {item.value}
                        </h2>
                    </div>
                </article>
            ))}
        </section>
    );
};

export default IncidentStats;
