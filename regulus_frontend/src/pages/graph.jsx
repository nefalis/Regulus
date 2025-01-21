import React from 'react';
import { Link } from 'react-router-dom';


function GraphPage() {
    return (
        <div>
            <h1>Page des graphiques</h1>
            <nav>
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/settings">Paramètres</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default GraphPage;