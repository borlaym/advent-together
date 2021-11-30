import styled, { css } from "styled-components"
import { getCurrentDay } from "../../utils/getCurrentDay";

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
  max-width: 420px;
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
  width: 70px;
  @media screen and (max-width: 440px) {
    width: 45px;
  }
`;

const PresentsIndicator = styled.div<{ isSelected?: boolean; }>`
  position: absolute;
  top: 0;
  right: 10px;
  color: black;
  font-size: 16px;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  flex-direction: column;
  width: 10px;

  @media screen and (max-width: 440px) {
    right: 5px;
  }

  .icon {
    font-size: 20px;
    line-height: 17px;
    font-family: Advent;
  }

  ${props => props.isSelected && css`
    color: rgba(250 250 250 / 0.9);
  `}
`;

const DayNumber = styled.div<{ isSelected?: boolean; disabled?: boolean }>`
  position: relative;
  font-size: 36px;
  @media screen and (max-width: 440px) {
    font-size: 30px;
  }
  color: rgba(0 0 0 / ${props => props.disabled ? '0.25' : '0.65'});
  max-width: 35px;
  margin-right: 25px;

  @media screen and (max-width: 440px) {
    margin-right: 15px;
  }

  ${props => props.isSelected && css`
    color: rgba(250 250 250 / 0.9);
    &:before {
      display: block;
      content: '';
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: -15px;
      right: -25px;
      background-color: #F44336;
      z-index: -1;
      border-radius: 5px;

      @media screen and (max-width: 440px) {
        left: 0px;
        right: -15px;
      }
    }
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
        const disabled = i <= getCurrentDay();
        return (
          <Day key={i} onClick={() => disabled ? null : onChange(i)}>
            <DayNumber disabled={disabled} isSelected={i === selectedDay}>{i + 1}</DayNumber>
            <PresentsIndicator isSelected={i === selectedDay}>
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
