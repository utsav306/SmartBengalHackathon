

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import TextAnalysisPage from './pages/TextAnalysisPage';
import VisionImprovementsPage from './pages/VisionImprovementsPage';
import FeaturesPage from './pages/FeaturesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<HomePage />} />
        <Route path="/text-analysis" element={<TextAnalysisPage />} />
        <Route path="/vision-improvements" element={<VisionImprovementsPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
