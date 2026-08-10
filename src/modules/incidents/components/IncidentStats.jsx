import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiTrendingUp,
} from "react-icons/fi";

const stats = [
  {
    title: "Novedades Pendientes",
    value: 24,
    change: "+12%",
    icon: FiAlertCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    changeColor: "text-red-600",
  },
  {
    title: "Resueltas Hoy",
    value: 158,
    change: "+8%",
    icon: FiCheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    changeColor: "text-green-600",
  },
  {
    title: "Tiempo Promedio",
    value: "42 min",
    change: "-5%",
    icon: FiClock,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    changeColor: "text-green-600",
  },
];

const IncidentStats = () => {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.title}
            className="group rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Encabezado */}
            <div className="mb-5 flex items-start justify-between">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}
              >
                <Icon
                  className={`text-2xl ${item.iconColor}`}
                />
              </div>

              <div
                className={`flex items-center gap-1 text-sm font-semibold ${item.changeColor}`}
              >
                <FiTrendingUp className="text-sm" />
                {item.change}
              </div>
            </div>

            {/* Título */}
            <p className="text-sm font-medium text-slate-500">
              {item.title}
            </p>

            {/* Valor */}
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {item.value}
            </h2>

            {/* Barra decorativa */}
            <div className="mt-5 h-1 w-0 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-full" />
          </article>
        );
      })}
    </section>
  );
};

export default IncidentStats;