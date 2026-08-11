import { useState } from "react";

import ModulePage from "../../../components/common/ModulePage/ModulePage";

import IncidentStats from "../components/IncidentStats";
import ReportsTable from "../components/ReportsTable";
import IncidentChart from "../components/IncidentChart";
import IncidentDetailModal from "../components/IncidentDetailModal";

import incidents from "../data/incidentsData";

const IncidentManagementPage = () => {
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
    <ModulePage
      label="Gestión de Novedades"
      title="Gestión de Novedades"
      description="Supervise, gestione y dé seguimiento a las novedades reportadas por los conductores en tiempo real."
    >
      <div className="space-y-6">
        <IncidentStats />

        <ReportsTable
          incidents={incidents}
          selectedIncident={selectedIncident}
          onSelectIncident={handleOpenModal}
        />

        <IncidentChart />
      </div>

      <IncidentDetailModal
        open={isModalOpen}
        incident={selectedIncident}
        onClose={handleCloseModal}
      />
    </ModulePage>
  );
};

export default IncidentManagementPage;