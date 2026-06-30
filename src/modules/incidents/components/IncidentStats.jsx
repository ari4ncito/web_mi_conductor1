import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiMapPin
} from "react-icons/fi";

import "./IncidentStats.css";

const stats = [

    {
        title: "Novedades Pendientes",
        value: "24",
        color: "#FFE8E6",
        icon: <FiAlertCircle />,
        badge: "+12%"
    },

    {
        title: "Resueltas Hoy",
        value: "158",
        color: "#D9F6FF",
        icon: <FiCheckCircle />
    },

    {
        title: "Tiempo Promedio",
        value: "42 min",
        color: "#DDEEFF",
        icon: <FiClock />
    },

    {
        title: "Flota Activa",
        value: "94%",
        color: "#FFF2DF",
        icon: <FiMapPin />
    }

];

const IncidentStats = () => {

    return (

        <section className="incident-stats">

            {
                stats.map((item,index)=>(

                    <article
                        className="stat-card"
                        key={index}
                    >

                        <div className="stat-top">

                            <div
                                className="icon-box"
                                style={{background:item.color}}
                            >
                                {item.icon}
                            </div>

                            {
                                item.badge &&
                                <span className="badge">
                                    {item.badge}
                                </span>
                            }

                        </div>

                        <span className="stat-title">
                            {item.title}
                        </span>

                        <h2>{item.value}</h2>

                    </article>

                ))
            }

        </section>

    );

};

export default IncidentStats;