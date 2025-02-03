import React, { useState, useEffect } from "react";
import axios from "axios";


function DeleteCycles() {
    const [cycles, setCycles] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Récupérer les cycles depuis l'API
    useEffect(() => {
        axios.get("http://localhost:8000/api/cycles/")
            .then(response => {
                const sortedCycles = response.data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
                setCycles(sortedCycles);

                //  Extraire les années uniques pour le filtre
                const uniqueYears = [...new Set(sortedCycles.map(cycle => new Date(cycle.start_date).getFullYear()))];
                setYears(uniqueYears);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des cycles :", error);
            });
    }, []);

    //  Filtrer les cycles selon l'année sélectionnée
    const filteredCycles = cycles.filter(cycle => new Date(cycle.start_date).getFullYear() === selectedYear);

    // Supprimer un cycle
    const handleDeleteCycle = (cycleId) => {
        axios.delete(`http://localhost:8000/api/cycles/${cycleId}/`)
            .then(() => {
                // Mettre à jour la liste des cycles
                setCycles(cycles.filter(cycle => cycle.id !== cycleId)); 
                setSuccessMessage('Cycle supprimé avec succès.');
                setErrorMessage('');
            })
            .catch(() => {
                setErrorMessage("Une erreur est survenue lors de la suppression.");
                setSuccessMessage('');
            });
    };

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div>
            <h2 className="text-xl font-bold mb-3">Mes Cycles Enregistrés</h2>

            <div className="mb-4">
                <label className="mr-3 font-bold">Filtrer par année :</label>
                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="p-2 border rounded-md"
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Liste des cycles filtrés */}
            {filteredCycles.length === 0 ? (
                <p>Aucun cycle enregistré pour cette année.</p>
            ) : (
                <ul>
                    {filteredCycles.map((cycle) => (
                        <li key={cycle.id} className="p-2 flex items-center border-b">
                            <span>Cycle du {cycle.start_date} au {cycle.end_date}</span>
                            <button 
                                onClick={() => handleDeleteCycle(cycle.id)} 
                                className="rounded-lg p-1 mx-2 bg-pink-1  shadow-pink-2 shadow-md">
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Messages d'alerte */}
            {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
        </div>
    );
}

export default DeleteCycles;
