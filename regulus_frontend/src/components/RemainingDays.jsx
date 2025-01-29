import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function RemainingDays({ lastPeriodDate, cycleLength }) {
    const [daysRemaining, setDaysRemaining] = useState(null);
    const [localCycleLength, setCycleLength] = useState(28);
    const [inputDate, setInputDate] = useState(lastPeriodDate || '');

    // Effect hook pour appeler l'API Django au chargement du composant
    useEffect(() => {
        const url = inputDate 
            ? `http://localhost:8000/api/get_remaining_days/?start_date=${inputDate}`
            : 'http://localhost:8000/api/get_remaining_days/';

            console.log("Requête envoyée à l'URL :", url); 
            axios.get(url)
            .then(response => {
                setDaysRemaining(response.data.days_remaining);
                setCycleLength(response.data.average_cycle_length);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données :", error);
            });
    }, [inputDate, lastPeriodDate]);

    return (
        <div className="remaining-days">
            <p className="font-bold">Jours restants avant les prochaines règles :</p>
            {daysRemaining !== null ? (
                <p className="text-gray-700">{daysRemaining} jours</p>
            ) : (
                <p className="text-gray-700">Chargement...</p>
            )}
            <p className="text-sm text-gray-500">Cycle moyen : {localCycleLength} jours</p>
        </div>
    );
}

export default RemainingDays;
