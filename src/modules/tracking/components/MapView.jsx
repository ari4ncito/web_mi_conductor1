import "./MapView.css";
import MapControls from "./MapControls";

import mapBackground from "../assets/images/fondo_mapa.jpeg";

const MapView = () => {
  return (
    <section className="map-view">

      <img
        src={mapBackground}
        className="map-image"
        alt="Mapa"
      />

      {/* Marcadores */}

      <div className="driver-marker marker-1">

        <div className="marker-dot"></div>

        <div className="marker-label">

          ID-2849 • En Ruta

        </div>

      </div>

      <div className="driver-marker marker-2">

        <div className="marker-dot available"></div>

        <div className="marker-label">

          Disponible

        </div>

      </div>

      <MapControls />

    </section>
  );
};

export default MapView;