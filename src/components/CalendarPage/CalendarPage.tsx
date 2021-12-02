import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Link,
  useParams
} from "react-router-dom";
import { Present } from "../../types";
import getJson from "../../utils/api";
import { createAndGetUserId } from "../../utils/userId";
import CalendarDay, { DOOR_ANIMATION_LENGTH } from "../CalendarDay/CalendarDay";
import styled from "styled-components";
import UploadForm from "../UploadForm/UploadForm";
import { DispatchContext, CalendarData, StateContext } from "../DataProvider/DataProvider";
import { getCurrentDay } from "../../utils/getCurrentDay";
import Presentation from "../Presentation/Presentation";
import { InlineButton } from "../PresentListItem/PresentListItem";

const Grid = styled.div`
  margin: 2rem auto;
  padding: 0 var(--margin);
  max-width: calc(calc(var(--size) + var(--margin)) * 4);

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: var(--margin);
  grid-auto-flow: row;
  grid-template-areas:
    "d13 d8 d15 d3"
    "d22 d19 d15 d10"
    "d2 d2 d24 d24"
    "d18 d7 d24 d24"
    "d9 d17 d11 d5"
    "d21 d21 d1 d14"
    "d6 d16 d23 d23"
    "d6 d20 d12 d4";

  @media screen and (max-width: 440px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas:
      "d13 d8"
      "d22 d19"
      "d15 d3"
      "d15 d10"
      "d2 d2"
      "d18 d7"
      "d24 d24"
      "d24 d24"
      "d9 d17"
      "d21 d21"
      "d11 d5"
      "d1 d14"
      "d6 d16"
      "d6 d20"
      "d23 d23"
      "d12 d4";
  }

.d13 { grid-area: d13; }

.d8 { grid-area: d8; }

.d22 { grid-area: d22; }

.d19 { grid-area: d19; }

.d15 { grid-area: d15; }

.d3 { grid-area: d3; }

.d10 { grid-area: d10; }

.d24 { grid-area: d24; }

.d2 { grid-area: d2; }

.d18 { grid-area: d18; }

.d7 { grid-area: d7; }

.d9 { grid-area: d9; }

.d17 { grid-area: d17; }

.d11 { grid-area: d11; }

.d5 { grid-area: d5; }

.d21 { grid-area: d21; }

.d1 { grid-area: d1; }

.d14 { grid-area: d14; }

.d6 { grid-area: d6; }

.d16 { grid-area: d16; }

.d23 { grid-area: d23; }

.d20 { grid-area: d20; }

.d12 { grid-area: d12; }

.d4 { grid-area: d4; }

`;

const Title = styled.h1`
  font-family: 'Great Vibes', cursive;
  font-weight: normal;
  font-size: 5em;
  @media screen and (max-width: 440px) {
    font-size: 4em;
  }
  color: white; // hsl(145, 64%, 24%);
  text-shadow: 2px 3px 5px rgba(50 50 50 / 0.6);
  margin: 3rem 0 0;
  padding: 0 0.5em;
  width: 100%;
  box-sizing: border-box;
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

  useEffect(() => {
    if (selectedDay !== null) {
      document.body.classList.add('noscroll');
    }
    return () => {
      document.body.classList.remove('noscroll');
    }
  }, [selectedDay])

  if (!calendarData) {
    return <></>;
  }

  const isUnka = uuid === 'a3f731b4-7047-42ef-a1ff-a57192ff186a';

  return (
    <div>
      {calendarData?.calendarName && <Title>{calendarData?.calendarName}</Title>}
      <Description>
        {calendarData?.description &&
          <>
            <p>{calendarData.description}</p>
            <br />
          </>
        }

        {isUnka ?
          <>
          <p>Welcome to our shared online Advent calendar! <InlineButton onClick={openUploadForm}>Upload</InlineButton> a surprise or two to share, and check back every day for a new surprise!</p>
          <p>If you want to create another calendar for another group, <Link to="/">click here</Link>! (🇭🇺 only)<br /> Upload a picture, short text, or a Youtube link for the chosen day! On that day everyone who checks this calendar will see your upload.</p>
          </>
        :
          <>
            <p>Itt a közös online adventi naptáratok! Küldd tovább az oldal urljét azoknak, akikkel együtt szeretnéd várni a karácsonyt, majd <InlineButton onClick={openUploadForm}>tölts föl</InlineButton> meglepetéseket!</p>
            <p>December minden napján látni fogjátok, ki mit töltött föl aznapra! Úgyhogy hajrá, tölts föl sok ajándékot, és ha szeretnél egy másik társasággal külön naptárat, <Link to="/">kattints ide</Link>!</p>
          </>
        }

      </Description>
      <Grid>
        <CalendarDay isSelected={selectedDay === 12} color="red" dayNumber={12} icon="R" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 7} color="green" dayNumber={7} icon="a" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 21} color="yellow" dayNumber={21} icon="m" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 18} color="blue" dayNumber={18} icon="i" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 14} color="darkred" dayNumber={14} dimensions="tall" icon="g" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 2} color="yellow" dayNumber={2} icon="x" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 9} color="blue" dayNumber={9} icon="j" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 1} color="purple" dayNumber={1} dimensions="wide" icon="A" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 17} color="beige" dayNumber={17} icon="l" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 6} color="darkblue" dayNumber={6} icon="p" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 23} color="darkgreen" dayNumber={23} dimensions="large" icon="v" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 8} color="blue" dayNumber={8} icon="y" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 16} color="darkred" dayNumber={16} icon="f" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 20} color="green" dayNumber={20} dimensions="wide" icon="O" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 10} color="yellow" dayNumber={10} icon="C" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 4} color="purple" dayNumber={4} icon="V" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 0} color="blue" dayNumber={0} icon="b" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 13} color="red" dayNumber={13}  icon="H" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 5} color="red" dayNumber={5} dimensions="tall" icon="s" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 15} color="darkblue" dayNumber={15} icon="E" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 19} color="yellow" dayNumber={19} icon="F" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 22} color="beige" dayNumber={22} dimensions="wide" icon="X" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 11} color="darkred" dayNumber={11} icon="c" onClick={handleDayClick} />
        <CalendarDay isSelected={selectedDay === 3} color="green" dayNumber={3}  icon="T" onClick={handleDayClick} />
      </Grid>

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
