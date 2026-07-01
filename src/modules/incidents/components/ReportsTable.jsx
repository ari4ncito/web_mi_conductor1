import "./ReportsTable.css";
import { FiEye } from "react-icons/fi";

const ReportsTable = ({
  incidents,
  selectedIncident,
  onSelectIncident,
}) => {

  const badgeClass = (prioridad) => {
    switch (prioridad) {
      case "Crítica":
        return "badge critical";
      case "Media":
        return "badge medium";
      default:
        return "badge low";
    }
  };

  return (
    <section className="reports-table">

      <div className="table-header">

        <div>

          <h2>Novedades Recientes</h2>

          <p>
            Últimos reportes enviados por los conductores.
          </p>

        </div>

      </div>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Conductor</th>

            <th>Prioridad</th>

            <th>Fecha</th>

            <th>Hora</th>

            <th>Acción</th>

          </tr>

        </thead>

        <tbody>

          {incidents.map((item) => (

            <tr
              key={item.id}
              onClick={() => onSelectIncident(item)}
              className={
                selectedIncident.id === item.id
                  ? "selected-row"
                  : ""
              }
            >

              <td>{item.id}</td>

              <td>{item.conductor}</td>

              <td>

                <span className={badgeClass(item.prioridad)}>
                  {item.prioridad}
                </span>

              </td>

              <td>{item.fecha}</td>

              <td>{item.hora}</td>

              <td>

                <button className="view-btn">

                  <FiEye />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </section>
  );

};

export default ReportsTable;