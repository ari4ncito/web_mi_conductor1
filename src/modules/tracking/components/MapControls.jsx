import { useMap } from "react-leaflet";

import {
  FiPlus,
  FiMinus,
  FiCrosshair,
} from "react-icons/fi";

import "./MapControls.css";

const MapControls = () => {
  const map = useMap();

  const acercar = () => {
    map.zoomIn();
  };

  const alejar = () => {
    map.zoomOut();
  };

  const centrar = () => {
    map.setView(
      [6.2442, -75.5812],
      13
    );
  };

  return (
    <div className="map-controls">

      <button
        type="button"
        onClick={acercar}
        title="Acercar"
      >
        <FiPlus />
      </button>

      <button
        type="button"
        onClick={alejar}
        title="Alejar"
      >
        <FiMinus />
      </button>

      <button
        type="button"
        onClick={centrar}
        title="Centrar mapa"
      >
        <FiCrosshair />
      </button>

    </div>
  );
};

export default MapControls;
