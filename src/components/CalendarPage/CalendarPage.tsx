import {
  useParams
} from "react-router-dom";

export default function CalendarPage() {
  const { uuid } = useParams();
  return (
    <div>
      <h1>Calendar page</h1>
      <p>uuid: {uuid}</p>
    </div>
  )
}