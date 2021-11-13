import React from 'react';
import { Routes, Route } from "react-router-dom";
import CalendarPage from './components/CalendarPage/CalendarPage';
import LandingPage from './components/Home/Home';

function App() {
  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:uuid" element={<CalendarPage />} />
      </Routes>
  );
}

export default App;
