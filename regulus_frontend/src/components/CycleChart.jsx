import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CycleChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        axios.get("http://localhost:8000/api/get_cycles_data/")
            .then(response => {
                const cycles = response.data.cycles;
                
                // Extraire les dates et durées des cycles
                const labels = cycles.map(cycle => cycle.start_date);
                const cycleDurations = cycles.map(cycle => cycle.days_between);
                
                // Calculer la moyenne des cycles
                const averageCycle = cycleDurations.length > 0 
                    ? cycleDurations.reduce((sum, val) => sum + val, 0) / cycleDurations.length 
                    : 28; // Valeur par défaut si aucune donnée
                
                // Créer un tableau de la moyenne (même valeur pour chaque point)
                const averageLine = Array(labels.length).fill(averageCycle);
                
                // Ligne fixe à 28 jours
                const fixed28DaysLine = Array(labels.length).fill(28);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Durée du cycle menstruel (en jours)",
                            data: cycleDurations,
                            borderColor: "#ff99cc",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                            tension: 0.2,
                        },
                        {
                            label: `Moyenne des cycles (${averageCycle.toFixed(1)} jours)`,
                            data: averageLine,
                            borderColor: "#d367d3",
                            borderDash: [10, 5], // Ligne en pointillé
                            tension: 0.2,
                        },
                        {
                            label: "Cycle standard de 28 jours",
                            data: fixed28DaysLine,
                            borderColor: "#6e67d3",
                            borderDash: [5, 5], // Ligne en pointillé
                            tension: 0.2,
                        },
                    ],
                });
            })
            .catch(error => {
                console.error("Erreur lors du chargement des données :", error);
            });
    }, []);

    
    // Options pour personnaliser les axes
    const options = {
        responsive: true,
        scales: {

            y: {
                suggestedMin: 20,
                suggestedMax: 30,
                title: {
                    display: true,
                    text: "Nombre de jours entre les règles",
                },
            },
        },
    };

    return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-3/5 mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-4">Évolution de la durée des cycles menstruels</h2>
        <div className="w-full flex justify-center">
            <Line data={chartData} options={options} />
        </div>
    </div>
    );
}

export default CycleChart;
