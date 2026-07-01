 import React from "react";
 import "./LiveExecutionCard.css";
 
const LiveExecution = () => {
  return (
    <section className="live-execution">

      <div className="live-header">

        <div>

          <h2>Ejecución en Vivo</h2>

          <p>12 Servicios Activos • 4 Alertas</p>

        </div>

        <div className="live-badge">

          <span className="live-dot"></span>

          EN VIVO

        </div>

      </div>

      <div className="live-status">

        <div className="status success">

          <span className="status-circle"></span>

          8 Operativos

        </div>

        <div className="status danger">

          <span className="status-circle"></span>

          2 Demorados

        </div>

      </div>

    </section>
  );
};

export default LiveExecution;