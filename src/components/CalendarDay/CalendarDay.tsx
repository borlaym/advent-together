import React, { useCallback, useState } from "react";
import styled from '@emotion/styled';
import { css } from '@emotion/css';

const Icon = styled.span`
  font-family: Advent;
  font-size: 140px;
  color: rgba(255 255 255 / 0.8);
`;

const DayContainer = styled.div<{
  dimensions: 'tall' | 'wide' | 'large';
}>`
  position: relative;
  float: left;
  width: var(--size);
  height: var(--size);
  /* border: 1px solid rgba(120 120 120 / 0.5); */
  font-size: 36px;
  text-align: right;
  padding: 1rem 1rem 0 0;
  margin: 0 var(--margin) var(--margin) 0;
  box-sizing: border-box;
  border-radius: 5px;

  background-color: rgba(200 200 200);

  transition: transform 150ms ease-in-out;

  /* box-shadow: 5px 5px 18px 4px rgba(100 100 100 / 0.75) */
  box-shadow: 5px 5px 10px 0 rgba(52, 52, 52, 0.69);

  ${props => props.dimensions === 'tall' && css`
    height: calc(calc(var(--size) * 2) + var(--margin));

    ${Icon} {
      font-size: 260px;
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
`;

const colorValues = {
  green: '#146B3A',
  darkgreen: '#165B33',
  blue: '#0f354f',
  red: '#EA4630',
  darkred: '#BB2528',
  yellow: '#F8B229',
  purple: '#57000c',
  beige: '#cc954a',
};

type Props = {
  dayNumber: number;
  numberOfPresents: number;
  onSubmitPresent: (dayNumber: number, content: string) => void;
  dimensions: 'tall' | 'wide' | 'large';
  color: keyof typeof colorValues;
}

export default function CalendarDay({
  dayNumber,
  numberOfPresents,
  onSubmitPresent,
  dimensions,
  color
}: Props) {
  const [newPresentInput, setNewPresentInput] = useState('');
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPresentInput(event.target.value);
  }, []);
  const submit = useCallback(() => {
    onSubmitPresent(dayNumber, newPresentInput);
    setNewPresentInput('');
  }, [dayNumber, newPresentInput, onSubmitPresent]);
  return (
    <DayContainer
      dimensions={dimensions}
      style={{
        backgroundColor: colorValues[color]
      }}
    >
      <DayNumber>Dec {dayNumber + 1}</DayNumber>
      {numberOfPresents} presents
      <input type="text" value={newPresentInput} onChange={handleChange} /><button onClick={submit}>Add present</button>
    </DayContainer>
  )
}