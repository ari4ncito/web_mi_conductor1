import { useState } from "react";

import ModulePage from "../../../components/common/ModulePage/ModulePage";

import IncidentStats from "../components/IncidentStats";
import ReportsTable from "../components/ReportsTable";
import IncidentDetail from "../components/IncidentDetail";
import IncidentChart from "../components/IncidentChart";
import IncidentViewModal from "../components/IncidentViewModal";

import incidents from "../data/incidentsData";

import "./IncidentManagementPage.css";

const IncidentManagementPage = () => {

    const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
    const [viewingIncident, setViewingIncident] = useState(null);

    return (

        <ModulePage
            label="Gestión de Novedades"
            title="Gestión de Novedades"
            description="Supervise, gestione y dé seguimiento a las novedades reportadas por los conductores en tiempo real."
        >

            <IncidentStats />

            <div className="incident-content">

                <ReportsTable
                    incidents={incidents}
                    selectedIncident={selectedIncident}
                    onSelectIncident={setSelectedIncident}
                    onViewDetail={setViewingIncident}
                />

                <IncidentDetail
                    incident={selectedIncident}
                />

            </div>

            <IncidentChart />

            {viewingIncident && (
                <IncidentViewModal
                    incident={viewingIncident}
                    onClose={() => setViewingIncident(null)}
                />
            )}

        </ModulePage>

    );

};

export default IncidentManagementPage;