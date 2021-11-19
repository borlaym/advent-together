import React, { useCallback, useState } from "react";
import styled, { css } from "styled-components";

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
}>`
  position: relative;
  float: left;
  width: var(--size);
  height: var(--size);
  border: 1px solid rgba(50 50 50 / 0.3);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  margin: 0 var(--margin) var(--margin) 0;
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;

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
    width: calc(calc(var(--size) * 2) + var(--margin));
    height: calc(calc(var(--size) * 2) + var(--margin));

    ${Icon} {
      font-size: 260px;
    }
  `}

  :hover {
    transform: scale(1.1) rotate(1deg);
    z-index: 2;
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
  dimensions?: 'tall' | 'wide' | 'large';
  color: keyof typeof colorValues;
  icon: string;
  onClick: (dayNumber: number) => void;
}

export default function CalendarDay({
  dayNumber,
  dimensions,
  color,
  icon,
  onClick
}: Props) {

  const handleClick = useCallback(() => onClick(dayNumber), []);

  return (
    <DayContainer
      id={`day_${dayNumber}`}
      dimensions={dimensions}
      style={{
        backgroundColor: colorValues[color]
      }}
      onClick={handleClick}
    >
      <Icon>{icon}</Icon>
      <DayNumber>{dayNumber + 1}</DayNumber>
    </DayContainer>
  )
}