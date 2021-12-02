import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createAndGetUserId, getUserName, saveUserName } from "../../utils/userId";
import DaySelector from "./DaySelector";
import PresentListItem from "../PresentListItem/PresentListItem";
import { Present } from "../../types";
import { v4 as uuidV4 } from 'uuid';
import { post } from "../../utils/api";
import { DispatchContext, StateContext } from "../DataProvider/DataProvider";
import { Background, Modal } from "../Modal/Modal";
import ImageUploader from "./ImageUploader";
import { Button } from './Button';
import { getCurrentDay } from "../../utils/getCurrentDay";

const UploadModal = styled(Modal)`
  background-color: #cc954a;
  border-radius: 10px;
  box-shadow: 5px 5px 10px 0 rgba(50, 50, 50, 0.7);
`;

const UploadWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 2em;
  box-sizing: border-box;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;

  color: rgba(10 10 10 / 0.75);
`;

const Title = styled.h1`
  font-family: 'Great Vibes', cursive;
  font-size: 5em;
  color: rgba(250 250 250 / 0.9);
  text-shadow: 2px 3px 5px rgba(50 50 50 / 0.6);
  margin: 2rem 0 1rem;
  padding: 0;
  width: 100%;
  text-align: center;

  @media screen and (max-width: 440px) {
    margin: 0.5rem 0;
    font-size: 2.5em;
  }
`;

const Text = styled.p`
  color: #f7f7f7e8;
  font-size: 1.2em;
  line-height: 1.5em;
  @media screen and (max-width: 440px) {
    font-size: 1.2em;
    line-height: 1.65em;
  }

  text-align: center;
  text-shadow: 2px 2px 5px rgba(50 50 50 / 0.5);
  width: 90%;
`;

const Textarea = styled.textarea`
  width: 200px;
  height: 200px;
  font-family: inherit;
  font-size: 1.2em;
  padding: 0.5em;
  box-sizing: border-box;

  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  background-color: #e0a452;

  &::placeholder {
    color: rgba(10 10 10 / 0.75);
    text-align: center;
    padding-top: calc(50% - 10px);
  }

  &:active, &:focus {
    &::placeholder {
      color: transparent;
    }
  }
`;

const Label = styled.label`
  font-size: 1.2em;
  @media screen and (max-width: 440px) {
    font-size: 1.1em;
  }
`;

const Nameinput = styled.input`
  width: 200px;
  font-family: inherit;
  font-size: 1.2em;
  padding: 0.5em;
  box-sizing: border-box;
  margin: 0.5em 0 1em 0;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  background-color: #e0a452;
  text-align: center;

  &::placeholder {
    color: rgba(10 10 10 / 0.3);
    text-align: center;
  }

  &:active, &:focus {
    &::placeholder {
      color: transparent;
    }
  }
`;

const SubmitButton = styled(Button)`
  margin: 0.5em;
  background-color: hsl(145deg 61% 30%);
  :hover {
    background-color: hsl(145deg 61% 35%);
  }
`;

const ErrorDisplay = styled.p`
  color: red;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 1em;
  top: 1em;
  padding: 1em;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 1em 0;
  > * {
    margin: 0.5em 1em;
  }
`;

const ListHeader = styled.h3`
  margin: 1.5em 0 0.5em;
  padding: 0;
  font-size: 1.3em;
`;

const List = styled.ul`
  width: 80%;
  @media screen and (max-width: 440px) {
    width: 100%;
  }
  margin: 0 auto;
  padding-left: 0;
  list-style-type: '⭐️';
`;

type Props = {
  calendarId: string;
  defaultSelectedDay: number | null;
  onClose: () => void;
}

export default function UploadForm({
  calendarId,
  defaultSelectedDay,
  onClose
}: Props) {
  const { calendarData, myPresents } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const numberOfPresents = calendarData.numberOfPresents;
  const [selectedDay, setSelectedDay] = useState(defaultSelectedDay);
  const [username, setUsername] = useState(getUserName(calendarId) || '');
  const [image, setImage] = useState<string | null>(null);
  const userId = createAndGetUserId(calendarId);
  const contentRef = useRef(null);
  const [error, setError] = useState('');
  const isUnka = calendarId === 'a3f731b4-7047-42ef-a1ff-a57192ff186a';

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value), []);
  const handleDayChange = useCallback((day: number) => {
    setSelectedDay(day);
    const $uploaderArea = document.getElementById('uploaderArea');
    if ($uploaderArea) {
      $uploaderArea.scrollIntoView({ behavior: 'smooth' });
    }
    setError('');
  }, []);

  const handleSubmit = useCallback(() => {
    const content = contentRef.current?.value;
    if (!content && !image) {
      return setError(isUnka ? 'Add an image or some text!' : 'Adj meg vagy egy képet vagy egy üzenetet!');
    }
    if (content.length > 2000) {
      return setError(isUnka ? 'Maximum size of message is 2000 characters!' : 'Az üzenet maximális hossza 2000 karakter!');
    }
    if (username?.length > 100) {
      return setError(isUnka ? 'Name can\'t be longer than 100 characters' : 'A felhasználónév nem lehet hosszabb, mint 100 karakter!');
    }
    if (selectedDay === null) {
      return setError(isUnka ? 'Choose a day!' : 'Válassz ki egy napot!');
    }
    if (selectedDay <= getCurrentDay()) {
      return setError(isUnka ? 'You can only upload to later days' : 'Csak december későbbi napjaira tudsz feltölteni!');
    }
    const present: Present = {
      uuid: uuidV4(),
      day: selectedDay,
      uploader: userId || '',
      uploaderName: username,
      content,
      image
    };
    post('/calendar/' + calendarId, present);
    saveUserName(calendarId, username);
    contentRef.current.value = '';
    setImage(null);
    dispatch({
      type: 'ADD_PRESENT',
      present
    });
  }, [calendarId, dispatch, image, selectedDay, userId, username]);

  const handleDelete = useCallback((present: Present) => {
    if (!window.confirm('Are you sure you want to delete this present?')) {
      return;
    }
    post('/calendar/' + calendarId + '/remove', {
      presentId: present.uuid,
      userId
    });
    dispatch({
      type: 'DELETE_PRESENT',
      uuid: present.uuid
    });
  }, [calendarId, dispatch, userId]);

  const handleImageAdded = useCallback((image: string) => setImage(image), []);
  const handleImageRemoved = useCallback(() => setImage(null), []);

  const resetError = useCallback(() => setError(''), []);

  useEffect(function resetError() {
    setError('');
  }, [username, selectedDay, image]);

  return (
    <Background onClick={onClose}>
      <UploadModal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <UploadWrapper>
          <CloseButton onClick={onClose}>x</CloseButton>
          <Title>{isUnka ? 'Sharing is caring!' : 'Ajándékozni jó!'}</Title>
          {isUnka ? (
            <Text>
              Upload an image, a short text, or even a YouTube url for the selected day! <br />
              On that day everyone who knows the calendar's URL will see your present.
            </Text>
          ) : (
            <Text>
              Tölts fel egy képet, rövid szöveget, vagy akár egy Youtube linket a kiválasztott napra!<br />
              Azon a napon mindenki, aki rendelkezik a naptár URL-jével, látni fogja a feltöltésed.
            </Text>
          )}

          <DaySelector
            selectedDay={selectedDay}
            numberOfPresents={numberOfPresents}
            onChange={handleDayChange}
          />

          <Row id="uploaderArea">
            <ImageUploader
              onImageAdded={handleImageAdded}
              onImageRemoved={handleImageRemoved}
              image={image}
              isUnka={isUnka}
            />
            <div>
              <Textarea rows={5} ref={contentRef} onInput={resetError} placeholder={isUnka ? 'Or write a message!' : "Vagy írj üzenetet!"}></Textarea>
            </div>
          </Row>

          <Label htmlFor="usernameField">{isUnka ? 'You can optionally enter your name' : 'És ha szeretnéd a neved is megadhatod'}</Label>
          <Nameinput id="usernameField" type="text" value={username} placeholder={isUnka ? 'anonymous' : "névtelen ajándékozó"} onChange={handleNameChange} />

          <SubmitButton onClick={handleSubmit}>{isUnka ? 'Send' : 'Mehet'}</SubmitButton>
          {error && (
            <ErrorDisplay>
              {error}
            </ErrorDisplay>
          )}
          {myPresents.length > 0 && (
            <>
              <ListHeader>{isUnka ? 'Your previous uploads from this device:' : 'Erről az eszközről korábban feltöltött ajándékaid:'}</ListHeader>
              <List>
                {myPresents.sort((a, b) => a.day - b.day).map(present => (
                  <PresentListItem key={present.uuid} present={present} onDelete={() => handleDelete(present)} />
                ))}
              </List>
            </>
          )}
        </UploadWrapper>
      </UploadModal>
    </Background>
  )
}
