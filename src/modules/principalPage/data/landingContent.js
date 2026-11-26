// Fotografías reales de Unsplash (licencia libre). Solo se guarda el id de cada foto.
export const IMG = {
  hero: "1449965408869-eaa3f722e40d",
  city: "1493238792000-8113da705763",
  party: "1541532713592-79a0317b6b77",
  whiskey: "1470337458703-46ad1756a187",
  parking: "1573348722427-f1d6819fdf98",
  road: "1568605117036-5fe5e7bab0b7",
  suit: "1507679799987-c73779587ccf",
  driving: "1503376780353-7e6692767b70",
  phone: "1512941937669-90a1b58e7e9c",
  driverAvatar: "1500648767791-00dcc994a43e",
};

export const unsplash = (id, width) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;

export const NAV_LINKS = [
  { id: "sobre-mi-conductor", label: "¿Qué es?" },
  { id: "servicios", label: "Servicios" },
  { id: "como-funciona", label: "Cómo funciona" },
  { id: "usuarios", label: "Usuarios" },
  { id: "funciones", label: "Funciones" },
  { id: "faq", label: "FAQ" },
];

export const MARQUEE_ITEMS = [
  "Si tomas, no manejes",
  "Conductores verificados",
  "Tu carro llega contigo",
  "Ruta visible en todo momento",
  "Inspección fotográfica del vehículo",
  "Cartagena de Indias",
];

export const WHEN_TO_USE = [
  "Consumiste alcohol y necesitas llevar tu automóvil seguro a casa.",
  "Cansancio físico, estrés o indisposición para manejar.",
  "Dejaste tu carro en otro lugar y necesitas que alguien lo traslade.",
  "Traslado de tu vehículo a un taller o a una ubicación específica.",
  "Quieres que un conductor calificado y confiable maneje por ti.",
];

export const STATS = [
  { value: 4, suffix: "", label: "pasos de la solicitud a la entrega" },
  { value: 100, suffix: "%", label: "de los vehículos con inspección fotográfica" },
  { value: 3, suffix: "", label: "roles conectados en una sola plataforma" },
];

export const SCENARIOS = [
  {
    img: IMG.party,
    alt: "Amigos brindando en una celebración nocturna",
    title: "Saliste a celebrar",
    text: "Brindaste con amigos y tu carro también tiene que volver. Un conductor te lleva a ti y a tu vehículo a casa.",
  },
  {
    img: IMG.parking,
    alt: "Parqueadero subterráneo con vehículos estacionados",
    title: "Tu carro quedó lejos",
    text: "Lo dejaste en un parqueadero, en la oficina o en casa de alguien. Lo trasladamos hasta donde lo necesites.",
  },
  {
    img: IMG.road,
    alt: "Vehículo recorriendo una carretera al atardecer",
    title: "Cansancio o indisposición",
    text: "Después de un día largo o si no te sientes bien para manejar, deja que un profesional tome el volante.",
  },
  {
    img: IMG.suit,
    alt: "Persona con traje formal abotonando su saco",
    title: "Eventos y negocios",
    text: "Cenas de trabajo, bodas o eventos: llega y regresa sin preocuparte por quién maneja.",
  },
];

export const SERVICE_INCLUDES = [
  "Asignación de conductor",
  "Visualización de la ruta",
  "Registro del servicio",
  "Confirmación de llegada",
  "Reporte de novedades",
  "Control administrativo",
];

export const STEPS = [
  { title: "Solicita el servicio", text: "Registra origen, destino y los datos de tu vehículo desde la aplicación móvil." },
  { title: "Asignación ágil", text: "El administrador asigna de inmediato un conductor calificado y disponible." },
  { title: "Recepción e inspección", text: "El conductor recibe el automóvil y toma el registro fotográfico de verificación." },
  { title: "Ruta y entrega", text: "Visualiza la ruta hasta el destino y confirma la entrega segura de tu vehículo." },
];

export const ROLES = [
  {
    key: "cliente",
    tag: "App móvil",
    title: "Para el cliente",
    description:
      "Solicita el traslado seguro de tu automóvil, registra tus vehículos con SOAT y tecnomecánica y visualiza la ruta de tu viaje.",
    items: [
      "Solicitud rápida del servicio",
      "Visualización de la ruta",
      "Información organizada de vehículos",
      "Confirmación de entrega en destino",
      "Calificación del servicio recibido",
    ],
    cta: "Ver funciones",
  },
  {
    key: "conductor",
    tag: "App móvil",
    title: "Para el conductor",
    description:
      "Acepta servicios asignados, realiza el registro fotográfico del vehículo y reporta novedades con evidencia durante el trayecto.",
    items: [
      "Recepción de servicios asignados",
      "Ruta hacia el destino",
      "Registro fotográfico del vehículo",
      "Reporte de novedades con evidencia",
      "Gestión desde la aplicación",
    ],
    cta: "Ver funciones",
  },
  {
    key: "admin",
    tag: "Plataforma web",
    title: "Para el administrador",
    description:
      "Gestión integral de usuarios, asignación ágil de conductores, control de vigencias y métricas operativas centralizadas.",
    items: [
      "Gestión de cuentas y usuarios",
      "Conductores y vehículos",
      "Control de SOAT y tecnomecánica",
      "Asignación de solicitudes",
      "Métricas y estadísticas",
    ],
    cta: "Panel administrativo",
  },
];

export const WHY_US = [
  { icon: "car", title: "Conductores profesionales", text: "Personal capacitado para brindar un servicio seguro y confiable." },
  { icon: "route", title: "Visualización de ruta", text: "Sigue el trazado del trayecto desde el origen hasta el destino." },
  { icon: "security", title: "Seguridad y control", text: "Inspección fotográfica previa y gestión de novedades en el camino." },
  { icon: "settings", title: "Plataforma inteligente", text: "Gestión eficiente de clientes, conductores y asignaciones." },
  { icon: "bolt", title: "Atención rápida", text: "Asignación ágil para reducir los tiempos de espera." },
  { icon: "verified", title: "Documentación al día", text: "Control de vigencia de SOAT, tecnomecánica y licencias." },
];

export const CHARACTERISTICS = [
  "Plataforma web administrativa",
  "App móvil para clientes y conductores",
  "Visualización de ruta de servicios",
  "Control de SOAT y tecnomecánica",
  "Registro fotográfico del vehículo",
  "Novedades con evidencias en ruta",
  "Roles y permisos",
  "Calificación y comentarios",
  "Métricas y dashboard",
  "Control de licencias de conducción",
];

export const FAQS = [
  { q: "¿Qué es la plataforma Mi Conductor de GoDriver?", a: "Es una solución web y móvil creada para gestionar y prestar servicios de conductor capacitado que traslada tu automóvil de forma segura." },
  { q: "¿Cómo puedo ver el recorrido del servicio?", a: "El sistema permite visualizar la ruta completa del servicio, desde el punto de origen hasta el destino, para clientes, conductores y administradores." },
  { q: "¿Cómo se asegura el estado de mi vehículo al recibirlo?", a: "El conductor asignado realiza una inspección física y un registro fotográfico de verificación antes de iniciar el trayecto." },
  { q: "¿Se puede reportar alguna novedad o incidente en el camino?", a: "Sí. El conductor puede reportar novedades (tráfico, dificultades con el vehículo) adjuntando fotos para que el administrador gestione una solución oportuna." },
  { q: "¿Puedo calificar al conductor al finalizar?", a: "Sí. Los clientes pueden valorar la experiencia de 1 a 5 estrellas y agregar comentarios desde la aplicación móvil." },
];
