import React, { useState, useEffect } from "react";
import axios from "axios";
import CycleCalendar from "./CycleCalendar";


function AddCycle() {
    const [inputDate, setInputDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [cycles, setCycles] = useState([]);

    // Fonction pour récupérer les cycles depuis l'API
    const fetchCycleData = () => {
        axios.get("http://localhost:8000/api/cycles/")
            .then(response => {
                setCycles(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des cycles :", error);
            });
    };

    // Charger les cycles au démarrage
    useEffect(() => {
        fetchCycleData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Extraire la date au format YYYY-MM-DD directement depuis l'input
        const formattedStartDate = inputDate;
        const cycleData = { start_date: formattedStartDate };

        if (endDate) {
            const formattedEndDate = endDate;
            cycleData.end_date = formattedEndDate;
        }

        axios
            .post("http://localhost:8000/api/add_cycle/", cycleData)
            .then((response) => {
                setSuccessMessage("Cycle ajouté avec succès !");
                setErrorMessage("");
                setInputDate("");
                setEndDate("");
                fetchCycleData();
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout du cycle :", error);
                setErrorMessage("Impossible d'ajouter le cycle. Veuillez réessayer.");
            });
    };

    return (
        <div className="add-cycle">
            <h1 className="text-xl font-bold">Suivi du cycle menstruel</h1>

            <h2 className="font-semibold text-lg">Début du cycle</h2>
            {successMessage && <p className="text-pink-2">{successMessage}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="startDate">Date du début des règles :</label>
                <input
                    type="date"
                    id="startDate"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="border rounded p-1 m-2 shadow-pink-2 shadow-md"
                    required
                />
                <label htmlFor="endDate">Date de fin des règles (facultatif) :</label>
                <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded p-1 m-2 shadow-pink-2 shadow-md"
                />
                <button type="submit" className="rounded-lg p-2 bg-pink-1 shadow-pink-2 shadow-md px-3 py-1 mt-2 mx-2">
                    Ajouter
                </button>
            </form>

            <CycleCalendar cycles={cycles} />
        </div>
    );
}

export default AddCycle;
