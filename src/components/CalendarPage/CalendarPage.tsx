import { useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";
import { Present } from "src/types";
import getJson from "src/utils/api";

export type VisiblePresents = {
  presents: Present[];
  numberOfPresents: number[]
}

export default function CalendarPage() {
  const { uuid } = useParams();
  const [presentData, setPresentData] = useState<VisiblePresents | null>(null);

  useEffect(() => {
    getJson<VisiblePresents>('/calendar/' + uuid).then((presents: VisiblePresents) => setPresentData(presents));
  }, [uuid]);


  return (
    <div>
      <h1>Calendar page</h1>
      <p>uuid: {uuid}</p>
      <div>
        {presentData?.numberOfPresents.map((presents, i) => {
          return (
            <div key={i}>
              <div>Dec {i + 1}</div>
              {presents} presents
            </div>
          )
        })}
      </div>
    </div>
  )
}