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

        <div className="tracking-left">
          <LiveExecution />
          <FeedPanel />
          <HistoryPanel />
        </div>

        <div className="tracking-right">
          <MapView />
        </div>

      </section>
    </ModulePage>
  );
};

export default TrackingPage;