import styled from 'styled-components';

export const HangingItem = styled.div<{ inForeground?: boolean; }>`
  // start hanging items a bit above the viewport
  position: absolute;
  top: -50px;
  left: 0;

  z-index: ${props => props.inForeground ? 1 : -1};

  // hanging animation
  @keyframes hanging {
    0%   { transform: rotate(5deg) translateZ(0px); }
    100% { transform: rotate(-5deg) translateZ(0px); }
  }
  animation: ${props => props.inForeground ? '2s' : '1.5s'} ease-in-out infinite alternate hanging;

  // this makes it "hang" from center - top (rotation center is at x: 50%, y: -100%)
  transform-origin: 50% -100%;

  // image within the hanging container
  & svg {
    height: 100%;
    width: 15vw;
    @media screen and (max-width: 440px) {
      width: 20vw;
    }
    filter: ${props => props.inForeground ? 'drop-shadow(15px 10px 13px hsl(145deg 61% 16%))' : 'drop-shadow(5px 4px 4px hsl(145deg 61% 21%))'};
  }

  // this svg does not have a rope, so one is added via :after
  &.withRope {
    svg {
      margin-top: 190px;
    }
    :after {
      position: absolute;
      left: 50%; // align center
      top: 0; // start at top of svg
      display: block;
      content: '';
      width: 2px;
      height: 190px; // same as margin above svg
      background-color: #9b9b9b;
    }

    @media screen and (max-width: 440px) {
      svg {
        margin-top: 100px;
      }
      :after {
        height: 100px;
      }
    }
  }
`;
