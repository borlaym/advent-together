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
  @media screen and (max-width: 440px) {
    max-width: 270px;
  }
`;

const Day = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  cursor: pointer;
  width: 50px;
  @media screen and (max-width: 440px) {
    width: 45px;
  }
`;

const PresentsIndicator = styled.div`
  color: black;
  font-size: 16px;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 10px;

  .icon {
    font-size: 20px;
    font-family: Advent;
  }
`;

const DayNumber = styled.div<{ isSelected?: boolean; hasPresent: boolean; }>`
  font-size: 36px;
  @media screen and (max-width: 440px) {
    font-size: 30px;
  }
  color: rgba(0 0 0 / 0.65);
  max-width: 40px;

  ${props => props.hasPresent && css`
    font-weight: bold;
    color: rgba(80 80 80 / 0.4);
  `}
  ${props => props.isSelected && css`
    // text-decoration: underline;
    color: hsl(145deg 61% 25%);
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
          return Math.min(Math.ceil(((n - minPresents) / range) * 2), n);
        })();
        return (
          <Day key={i} onClick={() => onChange(i)}>
            <DayNumber
              isSelected={i === selectedDay}
              hasPresent={!!n}
            >{i + 1}</DayNumber>
            <PresentsIndicator>
              {(new Array(indicator)).fill(true).map((_, i) => (
                <span className="icon" key={i}>h</span>
              ))}
            </PresentsIndicator>
          </Day>
        );
      })}
    </Container>
  )
}
