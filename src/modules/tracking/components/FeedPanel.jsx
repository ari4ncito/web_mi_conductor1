import ServiceCard from "./ServiceCard";
import { services } from "../data/trackingData";

const FeedPanel = () => {
  return (
    <section className="flex-1 min-h-0 flex flex-col bg-white rounded-3xl p-[22px] overflow-hidden">

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[22px] font-bold">Actividad en Vivo</h2>
        <button className="text-[#0A7A98] bg-transparent font-semibold">Ver Todo</button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#CCD7E2] [&::-webkit-scrollbar-thumb]:rounded-full">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
          />
        ))}
      </div>

    </section>
  );
};

export default FeedPanel;
