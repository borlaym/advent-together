import React, { useCallback } from 'react';
import getJson from 'src/utils/api';
import { useNavigate } from "react-router-dom";
import { Calendar } from 'src/types';

export default function LandingPage() {
  const navigate = useNavigate();

  const createCalendar = useCallback(() => {
    getJson<Calendar>('/create').then((calendar: Calendar) => {
     navigate(`/${calendar.uuid}`);
    })
  }, [navigate]);

  return (
    <div>
      <h1>Landing page</h1>
      <button onClick={createCalendar}>Give me a new calendar</button>
    </div>
  )
}

