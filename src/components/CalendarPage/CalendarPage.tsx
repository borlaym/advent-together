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
import styled from "@emotion/styled/macro";

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
      <Wrapper>
        <Row>
          <CalendarDay color="red" dayNumber={12} numberOfPresents={presentData?.numberOfPresents[12]} icon="r" onSubmitPresent={handleSubmit} />
          <CalendarDay color="green" dayNumber={7} numberOfPresents={presentData?.numberOfPresents[7]} icon="a" onSubmitPresent={handleSubmit} />
          <CalendarDay color="blue" dayNumber={21} numberOfPresents={presentData?.numberOfPresents[21]} icon="m" onSubmitPresent={handleSubmit} />
          <CalendarDay color="yellow" dayNumber={18} numberOfPresents={presentData?.numberOfPresents[18]} icon="i" onSubmitPresent={handleSubmit} />
        </Row>
        <Row>
          <CalendarDay color="red" dayNumber={14} numberOfPresents={presentData?.numberOfPresents[14]} dimensions="tall" icon="g" onSubmitPresent={handleSubmit} />
          <CalendarDay color="yellow" dayNumber={2} numberOfPresents={presentData?.numberOfPresents[2]} icon="x" onSubmitPresent={handleSubmit} />
          <CalendarDay color="blue" dayNumber={9} numberOfPresents={presentData?.numberOfPresents[9]} icon="j" onSubmitPresent={handleSubmit} />
        </Row>
        <Row>
          <CalendarDay color="purple" dayNumber={14} numberOfPresents={presentData?.numberOfPresents[14]} dimensions="wide" icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={17} numberOfPresents={presentData?.numberOfPresents[17]} icon="p" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={22} numberOfPresents={presentData?.numberOfPresents[22]} icon="l" onSubmitPresent={handleSubmit} />
        </Row>
        <Row>
          <CalendarDay color="darkgreen" dayNumber={24} numberOfPresents={presentData?.numberOfPresents[24]} dimensions="large" icon="h" onSubmitPresent={handleSubmit} />
        </Row>
        <Row>
          <CalendarDay color="beige" dayNumber={15} numberOfPresents={presentData?.numberOfPresents[15]} icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={16} numberOfPresents={presentData?.numberOfPresents[16]} icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={17} numberOfPresents={presentData?.numberOfPresents[17]} dimensions="wide" icon="k" onSubmitPresent={handleSubmit} />
        </Row>
        <Row>
          <CalendarDay color="beige" dayNumber={18} numberOfPresents={presentData?.numberOfPresents[18]} dimensions="tall" icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={19} numberOfPresents={presentData?.numberOfPresents[19]} icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={20} numberOfPresents={presentData?.numberOfPresents[20]} icon="k" onSubmitPresent={handleSubmit} />
        </Row>
        <Row>
          <CalendarDay color="beige" dayNumber={21} numberOfPresents={presentData?.numberOfPresents[21]} icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={22} numberOfPresents={presentData?.numberOfPresents[22]} icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={23} numberOfPresents={presentData?.numberOfPresents[23]} icon="k" onSubmitPresent={handleSubmit} />
          <CalendarDay color="beige" dayNumber={24} numberOfPresents={presentData?.numberOfPresents[24]} icon="k" onSubmitPresent={handleSubmit} />
        </Row>
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