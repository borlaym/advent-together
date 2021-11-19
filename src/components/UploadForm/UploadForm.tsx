import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { createAndGetUserId, getUserName } from "../../utils/userId";
import DaySelector from "./DaySelector";
import PresentListItem from "../PresentListItem/PresentListItem";
import { Present } from "../../types";
import { v4 as uuidV4 } from 'uuid';
import { post } from "../../utils/api";

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  width: 90%;
  max-width: 700px;
  min-height: 300px;
  background: white;
  border: 2px solid gray;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 2em;
`;

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
`;

type Props = {
  calendarId: string;
  defaultSelectedDay?: number;
  numberOfPresents: number[];
}

export default function UploadForm({
  calendarId,
  defaultSelectedDay,
  numberOfPresents
}: Props) {

  const [selectedDay, setSelectedDay] = useState(defaultSelectedDay);
  const handleDayChange = useCallback((day: number) => setSelectedDay(day), []);
  const [username, setUsername] = useState(getUserName(calendarId) || '');
  const userId = createAndGetUserId(calendarId);
  const contentRef = useRef(null);

  const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value), []);

  const handleSubmit = useCallback(() => {
    const present: Present = {
      uuid: uuidV4(),
      day: selectedDay,
      uploader: userId || '',
      contentType: 'Text',
      content: contentRef.current?.value
    };
    post('/calendar/' + calendarId, present);
  }, [calendarId, selectedDay, userId]);

  return (
    <Background>
      <Modal>
        <h1>Upload form</h1>
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
      </Modal>
    </Background>
  )
}