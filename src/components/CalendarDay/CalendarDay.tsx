import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { getCurrentDay } from "../../utils/getCurrentDay";

export const DOOR_ANIMATION_LENGTH = 800; // in ms
const DOOR_OPENING_DEGREES = { // in deg
  open: 70,
  closed: 0,
  opened: 5,
  unopenable: 35
};

const Icon = styled.span`
  font-family: Advent;
  font-size: 140px;
  text-shadow: 2px 2px 5px rgba(50 50 50 / 0.5);
  @media screen and (max-width: 440px) {
    font-size: 100px;
  }
  color: rgba(255 255 255 / 0.8);
  user-select: none;
`;

const DayContainer = styled.div<{
  dimensions?: 'tall' | 'wide' | 'large';
  isOpen: boolean;
}>`
  position: relative;
  float: left;
  width: var(--size);
  height: var(--size);

  margin: 0 var(--margin) var(--margin) 0;
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;

  perspective: 30rem;

  transform-style: preserve-3d;
  z-index: ${props => props.isOpen ? 2 : 1};

  background-color: rgba(200 200 200);

  transition: transform 150ms ease-in-out;

  box-shadow: 5px 5px 10px 0 rgba(50, 50, 50, 0.7);

  ${props => props.dimensions === 'tall' && css`
    height: calc(calc(var(--size) * 2) + var(--margin));

    ${Icon} {
      font-size: 200px;
      @media screen and (max-width: 440px) {
        font-size: 160px;
      }
    }
  `}
  ${props => props.dimensions === 'wide' && css`
    width: calc(calc(var(--size) * 2) + var(--margin));
  `}
  ${props => props.dimensions === 'large' && css`
    // overriding perspective, to make the opening nicer
    perspective:60rem;
    width: calc(calc(var(--size) * 2) + var(--margin));
    height: calc(calc(var(--size) * 2) + var(--margin));

    ${Icon} {
      font-size: 260px;
    }
  `}

  :hover {
    transform: scale(1.03);
  }
`;

const DayNumber = styled.span`
  position: absolute;
  bottom: 0.5rem;
  left: 1rem;
  font-size: 20px;
  color: rgba(255 255 255 / 0.9);
  text-shadow: 2px 2px 5px rgba(50 50 50 / 0.5);
`;

const Door = styled.div<{ openingDegree: number; }>`
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;

  /* this makes things 3d */
  transition: transform ${DOOR_ANIMATION_LENGTH}ms ease-in-out;
  /* rotate rotates(!), translateZ fixes safari... */
  transform: rotate3d(0, 1, 0, 0) translateZ(1px);
  transform-origin: left 0; /* hogy a bal sarok nyiljon */
  transform-style: preserve-3d;
  z-index: 2;

  ${props => props.openingDegree && css`
    transform: rotate3d(0, 1, 0, ${props.openingDegree * -1}deg) translateZ(1px);
  `}
`;

const Inside  = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  // transform: rotate(0deg) translateX(0) translateZ(1px);
`;

const Present = styled.div<{ isOpen: boolean }>`
  font-family: Advent;
  font-size: 10em;
  margin-left: 10px;
  transition: transform 400ms linear 400ms;
  z-index: 10;
  transform-style: preserve-3d;

  transform: rotate(0deg) translateX(0) translateZ(0);
  ${props => props.isOpen && css`
    transform: rotate(10deg) translateX(20%) translateZ(0);
  `}
`;

const colorValues = {
  green: '#146B3A',
  darkgreen: '#165B33',
  blue: '#0f354f',
  darkblue: '#0c142e',
  red: '#EA4630',
  darkred: '#BB2528',
  purple: '#57000c',
  yellow: '#F8B229',
  beige: '#cc954a',
};

type Props = {
  dayNumber: number;
  isSelected?: boolean;
  dimensions?: 'tall' | 'wide' | 'large';
  color: keyof typeof colorValues;
  icon: string;
  onClick: (dayNumber: number) => void;
}

export default function CalendarDay({
  dayNumber,
  isSelected,
  dimensions,
  color,
  icon,
  onClick
}: Props) {

  const handleClick = useCallback(() => onClick(dayNumber), [dayNumber, onClick]);

  const dayInDecember = getCurrentDay();
  const canBeOpened = (dayInDecember >= dayNumber && dayInDecember > -1);

  const doorOpeningDegree = (() => {
    if (isSelected && canBeOpened) {
      return DOOR_OPENING_DEGREES['open'];
    } else if (!isSelected && canBeOpened) {
      return DOOR_OPENING_DEGREES['opened'];
    } else if (isSelected) {
      return DOOR_OPENING_DEGREES['unopenable'];
    }
    return DOOR_OPENING_DEGREES['closed'];
  })();

  return (
    <DayContainer
      id={`day_${dayNumber}`}
      dimensions={dimensions}
      isOpen={isSelected}
      onClick={handleClick}
    >
      <Door
        openingDegree={doorOpeningDegree}
        style={{
          backgroundColor: colorValues[color]
        }}
      >
        <Icon>{icon}</Icon>
        <DayNumber>{dayNumber + 1}</DayNumber>
      </Door>
      <Inside>
        <Present isOpen={isSelected}>{canBeOpened ? 'I' : 'R'}</Present>
      </Inside>

    </DayContainer>
  )
}
