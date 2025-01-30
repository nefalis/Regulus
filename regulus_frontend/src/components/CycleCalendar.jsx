import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CycleCalendar({ cycles }) {
    // Fonction pour vérifier si une date est une date de règles
    const isCycleDay = (date) => {
        if (!Array.isArray(cycles) || cycles.length === 0) return false;
    
        const dateString = date.toISOString().split("T")[0];
    
        const found = cycles.some(cycle => {
            const start = new Date(cycle.start_date).toISOString().split("T")[0];
            const end = cycle.end_date ? new Date(cycle.end_date).toISOString().split("T")[0] : start;
    
            return dateString >= start && dateString <= end;
        });
        return found;
    };
    // Fonction pour formater les dates que l'on surligne
    const tileClassName = ({ date }) => {
        return isCycleDay(date) ? "highlighted" : "";
    };

    return (
        <div className="cycle-calendar">
            <h2 className="font-semibold text-lg">Calendrier des cycles</h2>
            <Calendar
                tileClassName={tileClassName}
                tileContent={({ date, view }) =>
                    view === "month" && isCycleDay(date) ? (
                        <div className="circle-highlight"></div>
                    ) : null
                }
            />
        </div>
    );
}

export default CycleCalendar;