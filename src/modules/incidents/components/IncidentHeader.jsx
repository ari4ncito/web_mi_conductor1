import { FiBell, FiSearch } from "react-icons/fi";
import "./IncidentHeader.css";

const IncidentHeader = () => {
    return (
        <header className="incident-header">

            <div className="incident-header-left">

                <span className="breadcrumb">
                    Administración &gt; Servicios &gt; <strong>Gestión de Novedades</strong>
                </span>

                <h1>Gestión de Novedades</h1>

                <p>
                    Supervise en tiempo real las novedades operativas reportadas
                    por los conductores y la flota.
                </p>

            </div>

            <div className="incident-header-right">

                <div className="search-box">

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Buscar servicios o conductores..."
                    />

                </div>

                <button className="notification-btn">

                    <FiBell />

                    <span></span>

                </button>

            </div>

        </header>
    );
};

export default IncidentHeader;