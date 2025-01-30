import React, { useState, useEffect } from "react";
import axios from "axios";

function DeleteCycles() {
    const [cycles, setCycles] = useState([]);

    // Fonction pour récupérer les cycles depuis l'API
    useEffect(() => {
        axios.get("http://localhost:8000/api/cycles/")
            .then(response => {
                setCycles(response.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des cycles :", error);
            });
    }, []);

    // Fonction pour supprimer un cycle    
    const handleDeleteCycle = (cycleId) => {
        axios.delete(`http://localhost:8000/api/cycles/${cycleId}/`)
            .then(response => {
                // Si la suppression est réussie, mets à jour l'état sans popup d'erreur
                setCycles(cycles.filter(cycle => cycle.id !== cycleId));
    
                // Optionnellement, tu peux afficher un message de succès sous forme de texte ou autre
                setSuccessMessage('Cycle supprimé avec succès.');
                setErrorMessage('');
            })
            .catch(error => {
                // Affiche une erreur dans l'interface sans popup
                setErrorMessage("Une erreur est survenue lors de la suppression.");
                setSuccessMessage('');
            });
    };

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div>
            <h2 className="text-xl font-bold">Mes Cycles Enregistrés</h2>
            {cycles.length === 0 ? (
                <p>Aucun cycle enregistré.</p>
            ) : (
                <ul>
                    {cycles.map((cycle) => (
                        <li key={cycle.id} className="p-2">
                            <span>Cycle du {cycle.start_date} au {cycle.end_date}</span>
                            <button 
                                onClick={() => handleDeleteCycle(cycle.id)} 
                                className="mx-2 rounded-lg p-1 bg-white shadow-pink-2 shadow-md">
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {/* Affichage des messages sans popup */}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
    );
}

export default DeleteCycles;
