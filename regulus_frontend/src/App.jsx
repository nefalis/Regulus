import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home';
import GraphPage from './pages/graph';
import SettingsPage from './pages/settings';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Définition des différentes routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
