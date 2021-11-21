import React, { useCallback, useState } from 'react';
import { post } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { Calendar } from '../../types';
import styled, { createGlobalStyle } from 'styled-components';

import { HangingItem } from './HangingItem';
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
  margin-bottom: 4rem;
  text-shadow: 2px 2px 4px hsl(145deg 61% 21%);
  color: #c8cbb9;
`;

const FontIcon = styled.span`
  font-family: Christmas;
`;

const TextContainer = styled.div`
  width: 60%;
  @media screen and (max-width: 440px) {
    width: 80%;
  }
  margin: 0 auto 5em;
`;

const Text = styled.p`
  color: #c8cbb9;
  font-size: 1.5em;
  line-height: 1.65em;
`;

const Button = styled.button`
  display: block;
  margin: 2em auto;
  outline: none;
  border: none;
  border-radius: 1em;
  padding: 1rem;

  font-size: 1.5rem;
  box-shadow: 2px 2px 17px 0px #0000005c;
  background-color: rgba(100 100 100 / 0.2);
  color: #fff;

  transition: transform 100ms linear, background-color 100ms linear;

  :hover {
    background-color: rgba(0 0 0 / 0.2);
    color: #ddffde;
    transform: scale(1.05);
  }
`;

const Input = styled.input`
  outline: none;
  border-radius: 5px;
  border: none;
  padding: 0.5em;
  box-sizing: border-box;
  width: 100%;
  font-size: 3em;
  font-family: Christmas;
  background-color: #dfe2d2;
  color: hsl(145, 64%, 24%);
  margin: 0.5em 0 0.5em;
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

      <TextContainer>

        {!showTitleForm && (
          <>
            <Text>Készíts te is saját naptárat! Hívd meg a barátaid, töltsetek fel egymásnak valamiket, aztán meg is nézhetitek WOW!</Text>
            <Button onClick={enableUploadForm}>Szeretnék egy saját naptárat!</Button>
          </>
        )}
        {showTitleForm && (
          <>
            <Text>Adj meg a naptárad címét, és a gombnyomás után máris a saját naptárad oldalán leszel!<br />A naptárad publikus, de titkos URL mögött van. Ha valakivel közösen szeretnéd feltölteni, csak küld el neki a címet, és egy név megadása után máris feltöltheti az ajándékait!</Text>

            <Input type="text" value={name} placeholder="naptárad címe" onChange={handleNameChange} /><br />
            <Button onClick={createCalendar}>Mutasd a naptáram!</Button>
          </>
        )}

        {error && (
          <Error>
            {error}
          </Error>
        )}
      </TextContainer>
    </Page>
  )
}
