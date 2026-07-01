import "./ServiceCard.css";
import {
  FiArrowUpRight,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

const ServiceCard = ({
  id,
  status,
  statusColor,
  origin,
  destination,
  driver,
}) => {
  return (
    <div className="service-card">

      <div className="service-header">

        <span className="service-id">
          {id}
        </span>

        <span
          className={`status ${statusColor}`}
        >
          {status}
        </span>

      </div>

      <div className="route">

        <div className="line">

          <span className="circle start"></span>

          <span className="vertical-line"></span>

          <span className="circle end"></span>

        </div>

        <div className="places">

          <div>

            <small>Origen</small>

            <p>{origin}</p>

          </div>

          <div>

            <small>Destino</small>

            <p>{destination}</p>

          </div>

        </div>

      </div>

      <div className="service-footer">

        <div className="driver">

          <FiUser />

          {driver}

        </div>

        <button>

          <FiArrowUpRight />

        </button>

      </div>

    </div>
  );
};

export default ServiceCard;