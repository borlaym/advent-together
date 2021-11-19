import { useCallback, useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";
import { Present } from "../../types";
import getJson, { post } from "../../utils/api";
import { createAndGetUserId } from "../../utils/userId";
import CalendarDay from "../CalendarDay/CalendarDay";
import styled from "styled-components";
import UploadForm from "../UploadForm/UploadForm";

const Wrapper = styled.div`
  margin: 2rem auto;
  max-width: calc(calc(var(--size) + var(--margin)) * 4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* gap: 1rem; */
`;

const Row = styled.section`
  width: calc(calc(var(--size) + var(--margin)) * 2);
  height: calc(calc(var(--size) + var(--margin)) * 2);
  @media screen and (max-width: 440px) {
    margin-left: var(--margin);
  }
`;


export type VisiblePresents = {
  presents: Present[];
  numberOfPresents: number[]
}

export default function CalendarPage() {
  const { uuid } = useParams();
  const [presentData, setPresentData] = useState<VisiblePresents | null>(null);
  const [myPresents, setMyPresents] = useState<Present[] | null>(null);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const userId = createAndGetUserId(uuid);

  useEffect(() => {
    if (uuid) {
      getJson<VisiblePresents>('/calendar/' + uuid).then((presents: VisiblePresents) => setPresentData(presents));
    }
  }, [uuid]);

  useEffect(() => {
    if (uuid && userId) {
      getJson<Present[]>('/calendar/' + uuid + '/' + userId).then((presents: Present[]) => setMyPresents(presents));
    }
  }, [userId, uuid]);

  useEffect(function scrollDayIntoView() {
    const d = new Date();
    if (d.getMonth() === 11 && (d.getDate() < 25)) {
      const currentDay = document.getElementById(`day_${d.getDate() - 1}`);
      currentDay.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  });


  const handleDelete = useCallback((present: Present) => {
    post('/calendar/' + uuid + '/remove', {
      presentId: present.uuid,
      userId
    }).then(response => {
      if (response === true) {
        setMyPresents(myPresents => myPresents.filter(p => p.uuid !== present.uuid));
      }
    });
  }, [userId, uuid]);

  const openUploadForm = useCallback(() => setIsUploadFormOpen(true), []);

  return (
    <div>
      <button onClick={openUploadForm}>Upload</button>
      <Wrapper>
        <Row>
          <CalendarDay color="red" dayNumber={12} icon="R" />
          <CalendarDay color="green" dayNumber={7} icon="a" />
          <CalendarDay color="yellow" dayNumber={21} icon="m" />
          <CalendarDay color="blue" dayNumber={18} icon="i" />
        </Row>
        <Row>
          <CalendarDay color="darkred" dayNumber={14} dimensions="tall" icon="g" />
          <CalendarDay color="yellow" dayNumber={2} icon="x" />
          <CalendarDay color="blue" dayNumber={9} icon="j" />
        </Row>
        <Row>
          <CalendarDay color="purple" dayNumber={1} dimensions="wide" icon="A" />
          <CalendarDay color="beige" dayNumber={17} icon="l" />
          <CalendarDay color="darkblue" dayNumber={6} icon="p" />
        </Row>
        <Row>
          <CalendarDay color="darkgreen" dayNumber={23} dimensions="large" icon="v" />
        </Row>
        <Row>
          <CalendarDay color="blue" dayNumber={8} icon="y" />
          <CalendarDay color="darkred" dayNumber={16} icon="f" />
          <CalendarDay color="green" dayNumber={20} dimensions="wide" icon="O" />
        </Row>
        <Row>
          <CalendarDay color="yellow" dayNumber={10} icon="C" />
          <CalendarDay color="purple" dayNumber={4} icon="V" />
          <CalendarDay color="blue" dayNumber={0} icon="b" />
          <CalendarDay color="red" dayNumber={13}  icon="H" />
        </Row>
        <Row>
          <CalendarDay color="red" dayNumber={5} dimensions="tall" icon="s" />
          <CalendarDay color="darkblue" dayNumber={15} icon="E" />
          <CalendarDay color="yellow" dayNumber={19} icon="F" />
        </Row>
        <Row>
          <CalendarDay color="beige" dayNumber={22} dimensions="wide" icon="X" />
          <CalendarDay color="darkred" dayNumber={11} icon="c" />
          <CalendarDay color="green" dayNumber={3}  icon="T" />
        </Row>
      </Wrapper>
      {isUploadFormOpen && (
        <UploadForm
          numberOfPresents={presentData.numberOfPresents}
          calendarId={uuid}
          defaultSelectedDay={null}
        />
      )}
    </div>
  )
}