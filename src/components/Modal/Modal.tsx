import styled from "styled-components";

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;

  // this makes it appear above the opening doors (where perspective is set to 30em/60em)
  transform: translateZ(61em);

  // appearing animation
  @keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  animation: 100ms linear fadein;
`;

export const Modal = styled.div`
  position: relative;
  width: 90%;
  max-width: 700px;
  min-height: 300px;
  background: white;
  border: 2px solid gray;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 2em;
  z-index: 10;

  // appearing animation
  @keyframes slidein {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }
  animation: 300ms ease-in-out slidein;
`;
