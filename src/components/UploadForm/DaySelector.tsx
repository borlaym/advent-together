import styled, { css } from "styled-components"

type Props = {
  selectedDay?: number;
  numberOfPresents: number[];
  onChange: (day: number) => void;
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-around;
  max-width: 300px;
`;

const Day = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 50px;
`;

const PresentsIndicator = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: black;
  font-family: Advent;
  position: absolute;
  top: -150%;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0.2em;
`;

const DayNumber = styled.div<{ isSelected?: boolean; hasPresent: boolean; }>`
  font-size: 26px;
  color: rgba(0 0 0 / 0.65);

  ${props => props.hasPresent && css`
    font-weight: bold;
    color: rgba(80 80 80 / 0.4);
  `}
  ${props => props.isSelected && css`
    // text-decoration: underline;
    color: rgba(0 0 0 / 1);
  `}
`;

export default function DaySelector({
  selectedDay,
  numberOfPresents,
  onChange
}: Props) {
  const minPresents = numberOfPresents.reduce((acc, n) => {
    if (n < acc) {
      return n;
    }
    return acc;
  }, numberOfPresents[0]);
  const maxPresents = numberOfPresents.reduce((acc, n) => {
    if (n > acc) {
      return n;
    }
    return acc;
  }, numberOfPresents[0]);
  const range = maxPresents - minPresents;
  return (
    <Container>
      {numberOfPresents.map((n, i) => {
        const indicator = (() => {
          if (n === 0) {
            return 0;
          }
          return Math.min(Math.ceil(((n - minPresents) / range) * 3), n);
        })();
        return (
          <Day key={i} onClick={() => onChange(i)}>
            {i === selectedDay && <PresentsIndicator>
              {(new Array(indicator)).fill(true).map((_, i) => (
                <div key={i}>h</div>
              ))}
              {n === 0 && <span>🙁</span>}
            </PresentsIndicator>}
            <DayNumber
              isSelected={i === selectedDay}
              hasPresent={n !== 0}
            >{i + 1}</DayNumber>
          </Day>
        );
      })}
    </Container>
  )
}
