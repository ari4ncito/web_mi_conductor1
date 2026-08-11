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

const chartData = [
  {
    semana: "Sem 1",
    reportadas: 28,
    resueltas: 22,
  },
  {
    semana: "Sem 2",
    reportadas: 34,
    resueltas: 30,
  },
  {
    semana: "Sem 3",
    reportadas: 30,
    resueltas: 27,
  },
  {
    semana: "Sem 4",
    reportadas: 38,
    resueltas: 35,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <p className="mb-3 font-semibold text-slate-800">{label}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-6">
          <span className="text-sm text-slate-500">
            Reportadas
          </span>

          <span className="font-semibold text-amber-600">
            {payload[0].value}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <span className="text-sm text-slate-500">
            Resueltas
          </span>

          <span className="font-semibold text-slate-800">
            {payload[1].value}
          </span>
        </div>
      </div>
    </div>
  );
};

const IncidentChart = () => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Tendencia de Novedades
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Comparación entre novedades reportadas y resueltas
            durante el último mes.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          Últimas 4 semanas
        </span>
      </div>

      {/* Gráfico */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={8}
            barCategoryGap="25%"
          >
            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="semana"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 13,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748B",
                fontSize: 13,
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "#F8FAFC",
              }}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                paddingBottom: 20,
              }}
            />

            <Bar
              name="Reportadas"
              dataKey="reportadas"
              fill="#F59E0B"
              radius={[8, 8, 0, 0]}
              maxBarSize={38}
            />

            <Bar
              name="Resueltas"
              dataKey="resueltas"
              fill="#1E3A5F"
              radius={[8, 8, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default IncidentChart;