import React from 'react';
import { Routes, Route } from "react-router-dom";
import CalendarPage from './components/CalendarPage/CalendarPage';
import StateWrapper from './components/DataProvider/DataProvider';
import LandingPage from './components/Home/Home';

function App() {
  return (
    <StateWrapper>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:uuid" element={<CalendarPage />} />
      </Routes>
    </StateWrapper>
  );
}

export default App;
