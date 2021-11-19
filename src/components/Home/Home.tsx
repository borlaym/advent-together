import React, { useCallback, useState } from 'react';
import { post } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { Calendar } from '../../types';
import styled from 'styled-components';

const Error = styled.p`
  color: red;
`

export default function LandingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const createCalendar = useCallback(() => {
    if (name.length < 3 || name.length > 100) {
      return setError('Please specify egy normalis hosszusagu nevet');
    }
    post<Calendar>('/create', { name }).then((calendar: Calendar) => {
     navigate(`/${calendar.uuid}`);
    })
  }, [name, navigate]);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setName(event.target.value)
  }, []);

  return (
    <div>
      <h1>Landing page</h1>
      <input type="text" value={name} onChange={handleNameChange} /><button onClick={createCalendar}>Give me a new calendar</button>
      {error && (
        <Error>
          {error}
        </Error>
      )}
    </div>
  )
}

