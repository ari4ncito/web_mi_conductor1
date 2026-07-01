import "./FeedPanel.css";
import ServiceCard from "./ServiceCard";
import { services } from "../data/trackingData";

const FeedPanel = () => {
  return (
    <section className="feed-panel">

      <div className="feed-header">
        <h2>Actividad en Vivo</h2>
        <button>Ver Todo</button>
      </div>

      <div className="feed-list">
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