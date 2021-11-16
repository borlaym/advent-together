import { useCallback, useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";
import { Present } from "../../types";
import getJson, { post } from "../../utils/api";
import { createAndGetUserId } from "../../utils/userId";
import CalendarDay from "../CalendarDay/CalendarDay";
import PresentListItem from "../PresentListItem/PresentListItem";
import { v4 as uuidV4 } from 'uuid';
import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin: 2rem auto;
  max-width: calc(calc(var(--size) + var(--margin)) * 6);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* gap: 1rem; */
`;

const Row = styled.section`
  width: calc(calc(var(--size) + var(--margin)) * 2);
  height: calc(calc(var(--size) + var(--margin)) * 2);
`;


export type VisiblePresents = {
  presents: Present[];
  numberOfPresents: number[]
}

export default function CalendarPage() {
  const { uuid } = useParams();
  const [presentData, setPresentData] = useState<VisiblePresents | null>(null);
  const [myPresents, setMyPresents] = useState<Present[] | null>(null);
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

  const handleSubmit = useCallback((dayNumber: number, content: string) => {
    const present: Present = {
      uuid: uuidV4(),
      day: dayNumber,
      uploader: userId || '',
      contentType: 'Text',
      content
    };
    post('/calendar/' + uuid, present);
  }, [userId, uuid]);

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

  return (
    <div>
      <h1>Calendar page</h1>
      <p>uuid: {uuid}</p>
      <Wrapper>
        {presentData?.numberOfPresents.map((presents, i) => {
          return (
            <CalendarDay
              key={i}
              dayNumber={i}
              numberOfPresents={presents}
              onSubmitPresent={handleSubmit}
            />
          )
        })}
      </Wrapper>
      {myPresents && myPresents.length > 0 && <div>
        <p>My presents</p>
        <ul>
          {myPresents.map(p => <PresentListItem key={p.uuid} present={p} onDelete={handleDelete} />)}
        </ul>
      </div>}
    </div>
  )
}