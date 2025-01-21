import React from 'react';
import { Link } from 'react-router-dom';


function SettingsPage() {
    return (
        <div>
            <h1>Page des paramètres</h1>
            <nav>
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/graph">Graphiques</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default SettingsPage;
