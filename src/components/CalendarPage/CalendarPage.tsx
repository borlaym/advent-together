import { useCallback, useContext, useEffect, useState } from "react";
import {
  useParams
} from "react-router-dom";
import { Present } from "../../types";
import getJson from "../../utils/api";
import { createAndGetUserId } from "../../utils/userId";
import CalendarDay from "../CalendarDay/CalendarDay";
import styled from "styled-components";
import UploadForm from "../UploadForm/UploadForm";
import { DispatchContext, CalendarData, StateContext } from "../DataProvider/DataProvider";
import { getCurrentDay } from "../../utils/getCurrentDay";
import Presentation from "../Presentation/Presentation";

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

export default function CalendarPage() {
  const { uuid } = useParams();
  const { calendarData } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const userId = createAndGetUserId(uuid);

  useEffect(() => {
    if (uuid) {
      getJson<CalendarData>('/calendar/' + uuid).then((presents: CalendarData) => {
        dispatch({
          type: 'SET_PRESENTS_DATA',
          presentsData: presents
        });
      });
    }
  }, [dispatch, uuid]);

  useEffect(() => {
    if (uuid && userId) {
      getJson<Present[]>('/calendar/' + uuid + '/' + userId).then((presents: Present[]) => {
        dispatch({
          type: 'SET_MYPRESENTS',
          myPresents: presents
        })
      });
    }
  }, [dispatch, userId, uuid]);

  useEffect(function scrollDayIntoView() {
    const dayInDecember = getCurrentDay();
    if (dayInDecember > -1) {
      const currentDay = document.getElementById(`day_${dayInDecember}`);
      currentDay.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }, []);

  const closeUploadForm = useCallback(() => {
    setIsUploadFormOpen(false);
    setSelectedDay(null);
  }, []);
  const openUploadForm = useCallback(() => setIsUploadFormOpen(true), []);
  const closePresentation = useCallback(() => setIsPresentationOpen(false), []);

  const handleDayClick = useCallback((clickedDayNumber: number) => {
    setSelectedDay(clickedDayNumber);
    const dayInDecember = getCurrentDay();
    if (dayInDecember >= clickedDayNumber && dayInDecember > -1) {
      setIsPresentationOpen(true);
    } else {
      openUploadForm();
    }
  }, [openUploadForm]);

  return (
    <div>
      <h1>{calendarData?.calendarName}</h1>
      <button onClick={openUploadForm}>Upload</button>
      <Wrapper>
        <Row>
          <CalendarDay color="red" dayNumber={12} icon="R" onClick={handleDayClick} />
          <CalendarDay color="green" dayNumber={7} icon="a" onClick={handleDayClick} />
          <CalendarDay color="yellow" dayNumber={21} icon="m" onClick={handleDayClick} />
          <CalendarDay color="blue" dayNumber={18} icon="i" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay color="darkred" dayNumber={14} dimensions="tall" icon="g" onClick={handleDayClick} />
          <CalendarDay color="yellow" dayNumber={2} icon="x" onClick={handleDayClick} />
          <CalendarDay color="blue" dayNumber={9} icon="j" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay color="purple" dayNumber={1} dimensions="wide" icon="A" onClick={handleDayClick} />
          <CalendarDay color="beige" dayNumber={17} icon="l" onClick={handleDayClick} />
          <CalendarDay color="darkblue" dayNumber={6} icon="p" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay color="darkgreen" dayNumber={23} dimensions="large" icon="v" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay color="blue" dayNumber={8} icon="y" onClick={handleDayClick} />
          <CalendarDay color="darkred" dayNumber={16} icon="f" onClick={handleDayClick} />
          <CalendarDay color="green" dayNumber={20} dimensions="wide" icon="O" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay color="yellow" dayNumber={10} icon="C" onClick={handleDayClick} />
          <CalendarDay color="purple" dayNumber={4} icon="V" onClick={handleDayClick} />
          <CalendarDay color="blue" dayNumber={0} icon="b" onClick={handleDayClick} />
          <CalendarDay color="red" dayNumber={13}  icon="H" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay color="red" dayNumber={5} dimensions="tall" icon="s" onClick={handleDayClick} />
          <CalendarDay color="darkblue" dayNumber={15} icon="E" onClick={handleDayClick} />
          <CalendarDay color="yellow" dayNumber={19} icon="F" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay color="beige" dayNumber={22} dimensions="wide" icon="X" onClick={handleDayClick} />
          <CalendarDay color="darkred" dayNumber={11} icon="c" onClick={handleDayClick} />
          <CalendarDay color="green" dayNumber={3}  icon="T" onClick={handleDayClick} />
        </Row>
      </Wrapper>
      {isUploadFormOpen && (
        <UploadForm
          calendarId={uuid}
          defaultSelectedDay={selectedDay}
          onClose={closeUploadForm}
        />
      )}
      {isPresentationOpen && (
        <Presentation
          dayNumber={selectedDay}
          onClose={closePresentation}
        />
      )}
    </div>
  )
}