import "./IncidentChart.css";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

const data = [
    {
        semana: "Sem 1",
        reportadas: 28,
        resueltas: 22,
    },
    {
        semana: "Sem 2",
        reportadas: 34,
        resueltas: 30,
    },
    {
        semana: "Sem 3",
        reportadas: 30,
        resueltas: 27,
    },
    {
        semana: "Sem 4",
        reportadas: 38,
        resueltas: 35,
    },
];

const IncidentChart = () => {

    return (

        <section className="incident-chart">

            <div className="chart-header">

                <div>

                    <h2>Tendencia de Novedades</h2>

                    <p>
                        Comparación entre novedades reportadas y resueltas durante el último mes.
                    </p>

                </div>

            </div>

            <div className="chart-container">

                <ResponsiveContainer width="100%" height={320}>

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="semana" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="reportadas"
                            fill="#D07A14"
                            radius={[8, 8, 0, 0]}
                        />

                        <Bar
                            dataKey="resueltas"
                            fill="#17324D"
                            radius={[8, 8, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </section>

    );

};

export default IncidentChart;