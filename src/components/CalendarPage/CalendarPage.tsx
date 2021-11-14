import { useCallback, useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";
import { Present } from "src/types";
import getJson, { post } from "src/utils/api";
import { createAndGetUserId } from "src/utils/userId";
import CalendarDay from "../CalendarDay/CalendarDay";
import PresentListItem from "../PresentListItem/PresentListItem";
import { v4 as uuidV4 } from 'uuid';

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

  return (
    <div>
      <h1>Calendar page</h1>
      <p>uuid: {uuid}</p>
      <div>
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
      </div>
      {myPresents && myPresents.length > 0 && <div>
        <p>My presents</p>
        <ul>
          {myPresents.map(p => <PresentListItem key={p.uuid} present={p} />)}
        </ul>
      </div>}
    </div>
  )
}