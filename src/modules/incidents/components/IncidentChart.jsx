
import { useMemo } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

function obtenerFecha(fecha) {
    if (!fecha) return null;

    const date = new Date(fecha);

    return Number.isNaN(date.getTime()) ? null : date;
}

function inicioDelDia(fecha) {
    const date = new Date(fecha);
    date.setHours(0, 0, 0, 0);
    return date;
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
            <p className="mb-2 text-sm font-semibold text-slate-700">
                {label}
            </p>

            {payload.map(item => (
                <p
                    key={item.dataKey}
                    className="text-sm"
                    style={{ color: item.color }}
                >
                    {item.name}: {item.value}
                </p>
            ))}
        </div>
    );
}

const IncidentChart = ({ incidents = [] }) => {
    const chartData = useMemo(() => {
        const hoy = inicioDelDia(new Date());

        return Array.from({ length: 4 }, (_, index) => {
            const semanasAtras = 3 - index;

            const inicio = new Date(hoy);
            inicio.setDate(inicio.getDate() - semanasAtras * 7);

            const fin = new Date(inicio);
            fin.setDate(fin.getDate() + 7);

            const reportadas = incidents.filter(incident => {
                const fecha = obtenerFecha(
                    incident.createdAt || incident.fechaCreacion
                );

                return fecha && fecha >= inicio && fecha < fin;
            }).length;

            const resueltas = incidents.filter(incident => {
                const fecha = obtenerFecha(incident.fechaCierre);

                return (
                    fecha &&
                    fecha >= inicio &&
                    fecha < fin &&
                    (
                        incident.estadoOriginal === "RESUELTA" ||
                        incident.estadoOriginal === "CERRADA"
                    )
                );
            }).length;

            return {
                semana: `Sem ${index + 1}`,
                reportadas,
                resueltas,
            };
        });
    }, [incidents]);

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        Tendencia de Novedades
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Comparación de novedades reportadas y resueltas.
                    </p>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Últimas 4 semanas
                </span>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -15,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                        />

                        <XAxis
                            dataKey="semana"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                        />

                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Legend />

                        <Bar
                            dataKey="reportadas"
                            name="Reportadas"
                            fill="#f59e0b"
                            radius={[5, 5, 0, 0]}
                        />

                        <Bar
                            dataKey="resueltas"
                            name="Resueltas"
                            fill="#1e293b"
                            radius={[5, 5, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default IncidentChart;
