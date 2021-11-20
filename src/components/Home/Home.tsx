import React, { useCallback, useState } from 'react';
import { post } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { Calendar } from '../../types';
import styled, { createGlobalStyle } from 'styled-components';

import { ReactComponent as ChristmasTree } from './hanging-christmas-tree-clipart.svg';
import { ReactComponent as ChristmasOrnament } from './simple-christmas-bulb-clipart.svg';

const BodyBackgroundOverride = createGlobalStyle`
  body {
    background-color: hsl(145deg 61% 29%);
  }
`;

const Page = styled.div`
  margin: 0 auto;
  width: 80%;
`;

const Error = styled.p`
  color: red;
`;

const Title = styled.h1`
  font-family: Christmas;
  font-size: 20vw;
  font-weight: 200;
  width: 100%;
  text-align: center;
  margin-top: 20vh;
  text-shadow: 2px 2px 4px hsl(145deg 61% 21%);
  color: #c8cbb9;
`;

const HangingItem = styled.div<{ inForeground?: boolean; }>`
  // start hanging items a bit above the viewport
  position: absolute;
  top: -50px;
  left: 0;

  z-index: ${props => props.inForeground ? 1 : -1};

  // hanging animation
  @keyframes hanging {
    0%   { transform: rotate(5deg) translateZ(0px); }
    100% { transform: rotate(-5deg) translateZ(0px); }
  }
  animation: ${props => props.inForeground ? '2s' : '1.5s'} ease-in-out infinite alternate hanging;

  // this makes it "hang" from center - top (rotation center is at x: 50%, y: -100%)
  transform-origin: 50% -100%;

  // image within the hanging container
  & svg {
    height: 100%;
    width: 15vw;
    @media screen and (max-width: 440px) {
      width: 20vw;
    }
    filter: ${props => props.inForeground ? 'drop-shadow(15px 10px 13px hsl(145deg 61% 16%))' : 'drop-shadow(5px 4px 4px hsl(145deg 61% 21%))'};
  }

  // this svg does not have a rope, so one is added via :after
  &.withRope {
    svg {
      margin-top: 190px;
    }
    :after {
      position: absolute;
      left: 50%; // align center
      top: 0; // start at top of svg
      display: block;
      content: '';
      width: 2px;
      height: 190px; // same as margin above svg
      background-color: #9b9b9b;
    }

    @media screen and (max-width: 440px) {
      svg {
        margin-top: 100px;
      }
      :after {
        height: 100px;
      }
    }
  }
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showTitleForm, setShowTitleForm] = useState(false);

  const createCalendar = useCallback(() => {
    if (name.length < 3 || name.length > 100) {
      return setError('Please specify egy normalis hosszusagu nevet');
    }
    post<Calendar>('/create', { name }).then((calendar: Calendar) => {
     navigate(`/${calendar.uuid}`);
    })
  }, [name, navigate]);

  const enableUploadForm = useCallback(() => {
    setShowTitleForm(showTitleForm => !showTitleForm);
  }, []);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setName(event.target.value)
  }, []);

  return (
    <Page>
      <BodyBackgroundOverride />

      <Title>( Boldog )<br />( Karácsonyt! )</Title>

      <HangingItem style={{ left: '70%', animationDelay: '0.3s' }} className="withRope">
        <ChristmasOrnament />
      </HangingItem>

      <HangingItem inForeground={true} style={{ left: '10%' }}>
        <ChristmasTree />
      </HangingItem>

      <p>Készíts te is saját naptárat! Hívd meg a barátaid, töltsetek fel egymásnak valamiket, aztán meg is nézhetitek WOW!</p>

      {!showTitleForm && <button onClick={enableUploadForm}>Szeretnék egy saját naptárat!</button>}
      {showTitleForm && (
        <>
          <input type="text" value={name} onChange={handleNameChange} /><br />
          <button onClick={createCalendar}>Mutasd a naptáram!</button>
        </>
      )}

      {error && (
        <Error>
          {error}
        </Error>
      )}
    </Page>
  )
}
