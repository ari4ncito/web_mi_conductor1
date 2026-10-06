import { useMap } from "react-leaflet";

import {
  FiPlus,
  FiMinus,
  FiCrosshair,
} from "react-icons/fi";

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
    <div className="absolute top-[100px] right-5 z-[1000] flex flex-col gap-2">

      <button
        type="button"
        onClick={acercar}
        title="Acercar"
        className="w-[42px] h-[42px] border-none rounded-[10px] bg-white/95 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.18)] text-[#263238] transition-all duration-150 hover:scale-105 hover:bg-white [&_svg]:w-[18px] [&_svg]:h-[18px]"
      >
        <FiPlus />
      </button>

      <button
        type="button"
        onClick={alejar}
        title="Alejar"
        className="w-[42px] h-[42px] border-none rounded-[10px] bg-white/95 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.18)] text-[#263238] transition-all duration-150 hover:scale-105 hover:bg-white [&_svg]:w-[18px] [&_svg]:h-[18px]"
      >
        <FiMinus />
      </button>

      <button
        type="button"
        onClick={centrar}
        title="Centrar mapa"
        className="w-[42px] h-[42px] border-none rounded-[10px] bg-white/95 flex items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.18)] text-[#263238] transition-all duration-150 hover:scale-105 hover:bg-white [&_svg]:w-[18px] [&_svg]:h-[18px]"
      >
        <FiCrosshair />
      </button>

    </div>
  );
};

export default MapControls;
