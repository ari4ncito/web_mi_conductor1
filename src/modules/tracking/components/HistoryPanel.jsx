import "./HistoryPanel.css";
import { history } from "../data/trackingData";

const HistoryPanel = () => {
  return (
    <section className="history-panel">

      <h3>HISTORIAL DE MOVIMIENTOS</h3>

      <div className="history-list">

        {history.map((item, index) => (

          <div key={index} className="history-item">

            <span className={`history-line ${item.color}`}></span>

            <div>
              <p>{item.title}</p>
              <small>{item.time}</small>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
};

export default HistoryPanel;