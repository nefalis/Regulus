import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CycleChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Durée du cycle menstruel (en jours)",
                data: [],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.2, // Lissage des courbes
            },
        ],
    });

    useEffect(() => {
        axios.get("http://localhost:8000/api/get_cycles_data/")
            .then(response => {
                const cycles = response.data.cycles;
                setChartData({
                    labels: cycles.map(cycle => cycle.start_date),
                    datasets: [
                        {
                            label: "Durée du cycle menstruel (en jours)",
                            data: cycles.map(cycle => cycle.days_between),
                            borderColor: "#ff99cc",
                            backgroundColor: "#ff99cc",
                            tension: 0.2,
                        },
                    ],
                });
            })
            .catch(error => {
                console.error("Erreur lors du chargement des données :", error);
            });
    }, []);

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg w-1/2">
            <h2 className="text-lg font-bold mb-3">Évolution de la durée des cycles menstruels</h2>
            <Line data={chartData} />
        </div>
    );
}

export default CycleChart;