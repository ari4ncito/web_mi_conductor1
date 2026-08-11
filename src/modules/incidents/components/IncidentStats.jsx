import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

const stats = [
  {
    title: "Novedades Pendientes",
    value: "24",
    color: "bg-red-100",
    iconColor: "text-red-500",
    icon: <FiAlertCircle size={22} />,
    badge: "+12%",
  },
  {
    title: "Resueltas Hoy",
    value: "158",
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
    icon: <FiCheckCircle size={22} />,
  },
  {
    title: "Tiempo Promedio",
    value: "42 min",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: <FiClock size={22} />,
  },
  {
    title: "Flota Activa",
    value: "94%",
    color: "bg-orange-100",
    iconColor: "text-orange-500",
    icon: <FiMapPin size={22} />,
  },
];

const IncidentStats = () => {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
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

            {item.badge && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                {item.badge}
              </span>
            )}
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