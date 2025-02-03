import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import RemainingDays from '../components/RemainingDays';
import AddCycle from '../components/AddCycle';


function HomePage() {
    return (
    <div>

        <div className="flex justify-center bg-pink-1 rounded-lg m-6 shadow-pink-800 shadow-md">
            <div className="flex flex-col items-center w-2/4">
                <img src={logo} alt="image logo" className="size-20"/>
                <span className=" text-red-950 font-bold text-xl p-2">
                    Regulus
                </span>
            </div>    
        </div>

        <div className="flex flex-row m-4 justify-center">
            <nav>
                <ul className="flex space-x-4 font-medium">
                    <li><Link to="/graph" className=" rounded-lg p-2 bg-pink-1 shadow-pink-2 shadow-md">Graphiques</Link></li>
                    <li><Link to="/settings" className=" rounded-lg p-2 bg-pink-1 shadow-pink-2 shadow-md">Paramètres</Link></li>
                </ul>
            </nav>
        </div>

        <div className="m-6 rounded-lg p-2 bg-pink-1 shadow-pink-2 shadow-md">
            <RemainingDays />
        </div>

        <div className="m-6 rounded-lg p-2 bg-pink-1 shadow-pink-2 shadow-md">
            <AddCycle/>
        </div>   

    </div>
    );
}

export default HomePage;
