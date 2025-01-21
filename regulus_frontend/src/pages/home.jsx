import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';


function HomePage() {
    return (
    <div>

        <div class="flex justify-center bg-pink-2 border rounded-lg m-6">
            <div class="flex flex-col items-center w-1/4">
                <img src={logo} alt="image logo" className="size-20"/>
                <span className=" text-red-950 font-bold">
                    Regulus
                </span>
            </div>    
        </div>

        <div class="flex flex-row m-4 justify-center">
            <nav>
                <ul class="flex space-x-4">
                    <li><Link to="/graph" class="bg-pink-2 border rounded-lg p-2">Graphiques</Link></li>
                    <li><Link to="/settings" class="bg-pink-2 border rounded-lg p-2">Paramètres</Link></li>
                </ul>
            </nav>
        </div>

    </div>    
    );
}

export default HomePage;
