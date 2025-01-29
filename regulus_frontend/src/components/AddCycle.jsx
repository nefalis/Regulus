import React, { useState, useEffect } from "react";
import axios from "axios";

function AddCycle() {
    const [inputDate, setInputDate] = useState("");
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

        axios
            .post("http://localhost:8000/api/add_cycle/", { start_date: inputDate })
            .then((response) => {
                setSuccessMessage("Cycle ajouté avec succès !");
                setErrorMessage("");
                setInputDate("");
                
                console.log("Cycle ajouté :", response.data);
                
                // Mettre à jour la liste des cycles
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
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            
            <form onSubmit={handleSubmit}>
                <label htmlFor="startDate">Date du début des règles :</label>
                <input
                    type="date"
                    id="startDate"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    className="border rounded p-1 mt-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white rounded px-3 py-1 mt-2">
                    Ajouter
                </button>
            </form>

            {/* Liste des cycles */}
            <h2 className="font-semibold text-lg mt-4">Historique des cycles</h2>
            <ul>
                {cycles.length > 0 ? (
                    cycles.map((cycle, index) => (
                        <li key={index}>
                            Cycle commencé le {cycle.start_date}
                        </li>
                    ))
                ) : (
                    <p>Aucun cycle enregistré.</p>
                )}
            </ul>
        </div>
    );
}

export default AddCycle;