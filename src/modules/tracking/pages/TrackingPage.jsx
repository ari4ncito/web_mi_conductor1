import ModulePage from "../../../components/common/ModulePage/ModulePage";

import FeedPanel from "../components/FeedPanel";
import HistoryPanel from "../components/HistoryPanel";
import LiveExecution from "../components/LiveExecutionCard";
import MapView from "../components/MapView";

import "./TrackingPage.css";

const TrackingPage = () => {
  return (
    <ModulePage
      label="Trazabilidad y Control"
      title="Trazabilidad y Control"
      description="Monitoree en tiempo real la ejecución de los servicios, la ubicación de los conductores y el estado operativo de la flota."
    >
      <section className="tracking">

        {/* Mapa de fondo — ocupa todo el contenedor */}
        <div className="tracking-map">
          <MapView />
        </div>

        {/* Paneles flotantes superpuestos al mapa */}
        <aside className="tracking-panels">
          <LiveExecution />
          <FeedPanel />
          <HistoryPanel />
        </aside>

      </section>
    </ModulePage>
  );
};

export default TrackingPage;