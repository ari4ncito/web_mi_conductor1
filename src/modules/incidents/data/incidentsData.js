const incidents = [
  {
    id: "NOV-1024",
    conductor: "Carlos Ramírez",
    prioridad: "Crítica",
    estado: "Pendiente",
    fecha: "10/06/2026",
    hora: "08:45",

    tipo: "Falla Mecánica",

    descripcion:
      "El conductor reporta pérdida de potencia y un ruido constante proveniente del sistema de frenos durante el recorrido.",

    ubicacion: "Av. Principal #123, Ciudad",

    evidencias: [
      "/src/modules/incidents/assets/images/evidence1.jpg",
      "/src/modules/incidents/assets/images/evidence2.jpg",
    ],
  },

  {
    id: "NOV-1025",
    conductor: "Laura Gómez",
    prioridad: "Media",
    estado: "Pendiente",

    fecha: "10/06/2026",
    hora: "09:18",

    tipo: "Retraso",

    descripcion:
      "El conductor informa congestión vial ocasionando retraso superior a 20 minutos.",

    ubicacion: "Calle 80 #45-20, Bogotá",

    evidencias: [
      "/src/modules/incidents/assets/images/evidence1.jpg",
      "/src/modules/incidents/assets/images/evidence2.jpg",
    ],
  },
];

export default incidents;