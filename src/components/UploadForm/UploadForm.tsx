import { useCallback, useState } from "react";
import styled from "styled-components";
import DaySelector from "./DaySelector";

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
`

type Props = {
  defaultSelectedDay?: number;
  numberOfPresents: number[];
}

export default function UploadForm({
  defaultSelectedDay,
  numberOfPresents
}: Props) {

  const [selectedDay, setSelectedDay] = useState(defaultSelectedDay);
  const handleDayChange = useCallback((day: number) => setSelectedDay(day), []);

  return (
    <Background>
      <Modal>
        <h1>Upload form</h1>
        <DaySelector
          defaultSelected={defaultSelectedDay}
          numberOfPresents={numberOfPresents}
          onChange={handleDayChange}
        />
      </Modal>
    </Background>
  )
}