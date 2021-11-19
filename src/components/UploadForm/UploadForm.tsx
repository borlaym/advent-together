import React, { useCallback, useContext, useRef, useState } from "react";
import styled from "styled-components";
import { createAndGetUserId, getUserName, saveUserName } from "../../utils/userId";
import DaySelector from "./DaySelector";
import PresentListItem from "../PresentListItem/PresentListItem";
import { Present } from "../../types";
import { v4 as uuidV4 } from 'uuid';
import { post } from "../../utils/api";
import { DispatchContext, StateContext } from "../DataProvider/DataProvider";
import { Background, Modal } from "../Modal/Modal";

const Textarea = styled.textarea`
  width: 100%;
  font-family: "Comic Sans", "Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", sans-serif;
  font-size: 20px;
  padding: 0.5em;
  box-sizing: border-box;
`;

const Nameinput = styled.input`
  width: 50%;
  font-family: "Comic Sans", "Comic Sans MS", "Chalkboard", "ChalkboardSE-Regular", sans-serif;
  font-size: 20px;
  padding: 0.5em;
  box-sizing: border-box;
  margin-bottom: 1em;
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
  const { presentData, myPresents } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const numberOfPresents = presentData.numberOfPresents;
  const [selectedDay, setSelectedDay] = useState(defaultSelectedDay);
  const [username, setUsername] = useState(getUserName(calendarId) || '');
  const userId = createAndGetUserId(calendarId);
  const contentRef = useRef(null);
  const [error, setError] = useState('');

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value), []);
  const handleDayChange = useCallback((day: number) => {
    setSelectedDay(day);
    setError('');
  }, []);

  const handleSubmit = useCallback(() => {
    const content = contentRef.current?.value;
    if (!content) {
      return setError('Please specify a content');
    }
    if (!selectedDay) {
      return setError('Please select a day');
    }
    const present: Present = {
      uuid: uuidV4(),
      day: selectedDay,
      uploader: userId || '',
      uploaderName: username,
      contentType: 'Text',
      content
    };
    post('/calendar/' + calendarId, present);
    saveUserName(calendarId, username);
    contentRef.current.value = '';
    dispatch({
      type: 'ADD_PRESENT',
      present
    });
  }, [calendarId, dispatch, selectedDay, userId, username]);

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

  return (
    <Background onClick={onClose}>
      <Modal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <h1>Upload form</h1>
        <CloseButton onClick={onClose}>x</CloseButton>
        <DaySelector
          selectedDay={selectedDay}
          numberOfPresents={numberOfPresents}
          onChange={handleDayChange}
        />
        <p>Add content</p>
        <Textarea rows={4} ref={contentRef}></Textarea>
        <p>Let people know who sent this present</p>
        <Nameinput type="text" value={username} placeholder="Set your name" onChange={handleNameChange} />
        <button onClick={handleSubmit}>Send</button>
        {error && (
          <ErrorDisplay>
            {error}
          </ErrorDisplay>
        )}
        {myPresents.length > 0 && (
          <>
            <p>Your previously upoloaded presents:</p>
            <ul>
              {myPresents.map(present => (
                <PresentListItem key={present.uuid} present={present} onDelete={() => handleDelete(present)} />
              ))}
            </ul>
          </>
        )}
      </Modal>
    </Background>
  )
}