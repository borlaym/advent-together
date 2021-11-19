import React, { useContext } from "react"
import styled from "styled-components";
import { StateContext } from "../DataProvider/DataProvider";
import { Background, Modal } from "../Modal/Modal"

type Props = {
  dayNumber: number;
  onClose: () => void;
}

const SlideShow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  flex-grow: 1;
`

const Slide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function Presentation({
  dayNumber,
  onClose
}: Props) {
  const { presentData } = useContext(StateContext);
  const presents = presentData.presents.filter(p => p.day === dayNumber);

  return (
    <Background onClick={onClose}>
      <Modal onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <SlideShow>
          {presents.map(present => (
            <Slide key={present.uuid}>
              <div>{present.content}</div>
              <div>{present.uploaderName ? `- ${present.uploaderName}` : null}</div>
            </Slide>
          ))}
        </SlideShow>
      </Modal>
    </Background>
  )
}