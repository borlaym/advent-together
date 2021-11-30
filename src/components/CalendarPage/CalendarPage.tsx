import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams
} from "react-router-dom";
import { Present } from "../../types";
import getJson from "../../utils/api";
import { createAndGetUserId } from "../../utils/userId";
import CalendarDay, { DOOR_ANIMATION_LENGTH } from "../CalendarDay/CalendarDay";
import styled, { css } from "styled-components";
import UploadForm from "../UploadForm/UploadForm";
import { DispatchContext, CalendarData, StateContext } from "../DataProvider/DataProvider";
import { getCurrentDay } from "../../utils/getCurrentDay";
import Presentation from "../Presentation/Presentation";
import { InlineButton } from "../PresentListItem/PresentListItem";

const Wrapper = styled.div<{ enlarge?: boolean }>`
  margin: 2rem auto;
  max-width: calc(calc(var(--size) + var(--margin)) * 4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  transition: transform ${DOOR_ANIMATION_LENGTH}ms;
  position: relative;
  z-index: 1;

  :after {
    content: '';
    display: block;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: all ${DOOR_ANIMATION_LENGTH-400}ms;
    transition-delay: 400ms;
    background-color: rgba(255,255,255,0);
    z-index: 2;
    pointer-events: none;
  }
  ${props => props.enlarge && css`
    transform: scale(2);
    :after {
      display: block;
      background-color: rgba(255,255,255,1);
    }
  `}
`;

const Title = styled.h1`
  font-family: 'Great Vibes', cursive;
  font-weight: normal;
  font-size: 5em;
  color: white; // hsl(145, 64%, 24%);
  text-shadow: 2px 3px 5px rgba(50 50 50 / 0.6);
  margin: 3rem 0 0;
  padding: 0;
  width: 100%;
  text-align: center;
`;

const Description = styled.div`
  color: white; // hsl(145, 64%, 24%);
  margin: 0 auto;
  padding: 1em;
  max-width: 700px;
  text-align: center;

  ${InlineButton} {
    margin-left: 0;
  }

  a {
    color: rgb(248, 178, 41);
  }
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
      if (currentDay) {
        currentDay.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    }
  }, []);

  const closeUploadForm = useCallback(() => {
    setIsUploadFormOpen(false);
    setSelectedDay(null);
  }, []);
  const openUploadForm = useCallback(() => setIsUploadFormOpen(true), []);
  const closePresentation = useCallback(() => {
    setSelectedDay(null);
    setIsPresentationOpen(false);
  }, []);

  const handleDayClick = useCallback((clickedDayNumber: number) => {
    setSelectedDay(clickedDayNumber);
    const dayInDecember = getCurrentDay();
    if (dayInDecember >= clickedDayNumber && dayInDecember > -1) {
      window.setTimeout(() => {
        setIsPresentationOpen(true);
      }, DOOR_ANIMATION_LENGTH);
    } else {
      window.setTimeout(() => {
        openUploadForm();
      }, DOOR_ANIMATION_LENGTH);
    }

  }, [openUploadForm]);


  const zoomTarget = useMemo(() => {
    const selectedDayWindow = document.getElementById(`day_${selectedDay}`);
    const calendar = document.getElementById('calendar');
    if (selectedDayWindow && calendar) {
      const zoomTarget = ['', ''];
      const selectedDayWindowCoords = selectedDayWindow.getBoundingClientRect();
      const calendarCoords = calendar.getBoundingClientRect();
      zoomTarget[0] = (selectedDayWindowCoords.x - calendarCoords.x + 100) + 'px';
      zoomTarget[1] = (selectedDayWindowCoords.y - calendarCoords.y + 100) + 'px';
      return zoomTarget;
    } else {
      return ['50%', '50%'];
    }
  }, [selectedDay]);

  console.log(zoomTarget)

  return (
    <div>
      {calendarData?.calendarName && <Title>{calendarData?.calendarName}</Title>}
      <Description>
        <p>Itt a közös online adventi naptáratok! Küldd tovább az oldal urljét azoknak, akikkel együtt szeretnéd várni a karácsonyt, majd <InlineButton onClick={openUploadForm}>tölts föl</InlineButton> meglepetéseket!</p>
        <p>December minden napján látni fogjátok, ki mit töltött föl aznapra! Úgyhogy hajrá, tölts föl sok ajándékot, és ha szeretnél egy másik társasággal külön naptárat, <Link to="/">kattints ide</Link>!</p>
      </Description>
      <Wrapper enlarge={selectedDay !== null} id="calendar" style={{
        transformOrigin: zoomTarget.join(' ')
      }}>
        <Row>
          <CalendarDay isSelected={selectedDay === 12} color="red" dayNumber={12} icon="R" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 7} color="green" dayNumber={7} icon="a" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 21} color="yellow" dayNumber={21} icon="m" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 18} color="blue" dayNumber={18} icon="i" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay isSelected={selectedDay === 14} color="darkred" dayNumber={14} dimensions="tall" icon="g" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 2} color="yellow" dayNumber={2} icon="x" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 9} color="blue" dayNumber={9} icon="j" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay isSelected={selectedDay === 1} color="purple" dayNumber={1} dimensions="wide" icon="A" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 17} color="beige" dayNumber={17} icon="l" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 6} color="darkblue" dayNumber={6} icon="p" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay isSelected={selectedDay === 23} color="darkgreen" dayNumber={23} dimensions="large" icon="v" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay isSelected={selectedDay === 8} color="blue" dayNumber={8} icon="y" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 16} color="darkred" dayNumber={16} icon="f" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 20} color="green" dayNumber={20} dimensions="wide" icon="O" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay isSelected={selectedDay === 10} color="yellow" dayNumber={10} icon="C" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 4} color="purple" dayNumber={4} icon="V" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 0} color="blue" dayNumber={0} icon="b" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 13} color="red" dayNumber={13}  icon="H" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay isSelected={selectedDay === 5} color="red" dayNumber={5} dimensions="tall" icon="s" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 15} color="darkblue" dayNumber={15} icon="E" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 19} color="yellow" dayNumber={19} icon="F" onClick={handleDayClick} />
        </Row>
        <Row>
          <CalendarDay isSelected={selectedDay === 22} color="beige" dayNumber={22} dimensions="wide" icon="X" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 11} color="darkred" dayNumber={11} icon="c" onClick={handleDayClick} />
          <CalendarDay isSelected={selectedDay === 3} color="green" dayNumber={3}  icon="T" onClick={handleDayClick} />
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
