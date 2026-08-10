import { useState } from "react";

import IncidentHeader from "./components/IncidentHeader";
import IncidentStats from "./components/IncidentStats";
import IncidentChart from "./components/IncidentChart";
import ReportsTable from "./components/ReportsTable";
import IncidentDetailModal from "./components/IncidentDetailModal";

const incidents = [
  {
    id: "NOV-001",
    conductor: "Juan Pérez",
    tipo: "Accidente",
    prioridad: "Crítica",
    estado: "Pendiente",
    fecha: "05/08/2026",
    hora: "08:45",
    descripcion:
      "El conductor reportó un choque menor contra un separador. No se presentaron lesionados.",
  },
  {
    id: "NOV-002",
    conductor: "Carlos Gómez",
    tipo: "Avería Mecánica",
    prioridad: "Media",
    estado: "En proceso",
    fecha: "05/08/2026",
    hora: "10:15",
    descripcion:
      "Falla en el sistema de frenos durante el recorrido. Se envió asistencia técnica.",
  },
  {
    id: "NOV-003",
    conductor: "María Torres",
    tipo: "Retraso",
    prioridad: "Baja",
    estado: "Resuelta",
    fecha: "04/08/2026",
    hora: "16:20",
    descripcion:
      "Retraso ocasionado por congestión vehicular en la ruta asignada.",
  },
];

const IncidentPage = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedIncident(null);
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <IncidentHeader />

        {/* Cards */}
        <IncidentStats />

        {/* Gráfico */}
        <IncidentChart />

        {/* Tabla */}
        <ReportsTable
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelectIncident={handleOpenModal}
        />

        {/* Modal */}
        <IncidentDetailModal
          open={isModalOpen}
          incident={selectedIncident}
          onClose={handleCloseModal}
        />
      </div>
    </main>
  );
};

export default IncidentPage;