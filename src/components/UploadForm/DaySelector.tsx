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
  justify-content: flex-start;
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
  cursor: pointer;
`;

const PresentsIndicator = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: black;
  font-family: Advent;
`

const DayNumber = styled.div<{ isSelected?: boolean }>`
  font-size: 16px;
  color: black;

  ${props => props.isSelected && css`
    color: red;
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
            <PresentsIndicator>
              {(new Array(indicator)).fill(true).map((_, i) => (
                <div key={i}>h</div>
              ))}
            </PresentsIndicator>
            <DayNumber isSelected={i === selectedDay}>{i + 1}</DayNumber>
          </Day>
        );
      })}
    </Container>
  )
}