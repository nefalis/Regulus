import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


function CycleCalendar({ cycles }) {
    // Fonction pour vérifier si une date est une date de règles
    const isCycleDay = (date) => {
        if (!Array.isArray(cycles) || cycles.length === 0) return false;

        // Convertir la date du calendrier en format YYYY-MM-DD
        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const found = cycles.some(cycle => {
            const start = cycle.start_date;
            const end = cycle.end_date || start;

            return dateString >= start && dateString <= end;
        });
        return found;
    };

    // Fonction pour formater les dates que l'on surligne
    const tileClassName = ({ date }) => {
        return isCycleDay(date) ? "highlighted" : "";
    };

    return (
        <div className="cycle-calendar flex flex-col items-center w-full">
            <h2 className="font-semibold text-lg text-center mb-4">Calendrier des cycles</h2>
            <div className="w-full flex justify-center">
                <Calendar
                    tileClassName={tileClassName}
                    tileContent={({ date, view }) =>
                        view === "month" && isCycleDay(date) ? (
                            <div className="circle-highlight"></div>
                        ) : null
                    }
                />
            </div>
        </div>
    );
}

export default CycleCalendar;
