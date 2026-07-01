import "./IncidentDetail.css";

import evidence1 from "../assets/images/evidence1.jpg";
import evidence2 from "../assets/images/evidence2.jpg";

const IncidentDetail = ({ incident }) => {

  return (

    <aside className="incident-detail">

      <div className="detail-header">

        <h2>Detalle de la Novedad</h2>

        <span className="status pending">

          {incident.estado}

        </span>

      </div>

      <div className="detail-info">

        <div>

          <label>ID Novedad</label>

          <span>{incident.id}</span>

        </div>

        <div>

          <label>Conductor</label>

          <span>{incident.conductor}</span>

        </div>

        <div>

          <label>Tipo</label>

          <span>{incident.tipo}</span>

        </div>

        <div>

          <label>Prioridad</label>

          <span>{incident.prioridad}</span>

        </div>

        <div>

          <label>Fecha</label>

          <span>

            {incident.fecha} - {incident.hora}

          </span>

        </div>

        <div>

          <label>Descripción</label>

          <p>

            {incident.descripcion}

          </p>

        </div>

      </div>

      <div className="evidence-section">

        <h3>Evidencias</h3>

        <div className="evidence-grid">

          <img
            src={evidence1}
            alt="Evidencia 1"
          />

          <img
            src={evidence2}
            alt="Evidencia 2"
          />

        </div>

      </div>

      <div className="notes-section">

        <label>

          Observaciones del Administrador

        </label>

        <textarea
          placeholder="Escriba observaciones o seguimiento..."
        />

      </div>

      <div className="detail-buttons">

        <button className="secondary-btn">

          Solicitar Actualización

        </button>

        <button className="primary-btn">

          Marcar como Resuelta

        </button>

      </div>

    </aside>

  );

};

export default IncidentDetail;