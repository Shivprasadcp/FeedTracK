import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateFeedback from './pages/CreateFeedback';

const App = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 animated-bg"></div>

      {/* Main Content */}
      <div className="text-blue text-center relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feedback/create" element={<CreateFeedback />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
