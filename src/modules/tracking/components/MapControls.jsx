import "./MapControls.css";

import {
  FiPlus,
  FiMinus,
  FiLayers,
} from "react-icons/fi";

const MapControls = () => {
  return (

    <div className="map-controls">

      <button>

        <FiPlus />

      </button>

      <button>

        <FiMinus />

      </button>

      <button>

        <FiLayers />

      </button>

    </div>

  );
};

export default MapControls;