import React, { useCallback, useState } from 'react';
import { post } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import { Calendar } from '../../types';
import styled, { createGlobalStyle } from 'styled-components';

import { HangingItem } from './HangingItem';
import { ReactComponent as ChristmasTree } from './hanging-christmas-tree-clipart.svg';
import { ReactComponent as ChristmasOrnament } from './simple-christmas-bulb-clipart.svg';
import { Button } from '../UploadForm/Button';

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
  color: rgb(248, 178, 41);
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

const Input = styled.input`
  outline: none;
  border-radius: 5px;
  border: none;
  padding: 0.5em;
  box-sizing: border-box;
  width: 100%;
  font-size: 3em;
  font-family: 'Acme', cursive;
  text-shadow: 1px 1px 2px rgba(50 50 50 / 0.5);
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
      return setError('Kérlek 3 és 100 karakter közötti nevet adj meg!');
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
            <Text>Készíts te is saját naptárat! Hívd meg a barátaid, töltsetek fel egymásnak meglepetéseket, és várjátok együtt a karácsonyt!</Text>
            <Button onClick={enableUploadForm}>Szeretnék egy saját naptárat!</Button>
          </>
        )}
        {showTitleForm && (
          <>
            <Text>Add meg a naptárad címét, és a gombnyomás után máris kezdheted a feltöltést!<br />A naptárad publikus, de titkos URL mögött van. Ha valakivel közösen szeretnétek meglepni egymást, csak küldd el neki az URL-t, és ő is része lesz az ajándékozásnak!</Text>

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
