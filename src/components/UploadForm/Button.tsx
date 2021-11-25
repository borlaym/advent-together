import styled from 'styled-components';

export const Button = styled.button`
  display: block;
  margin: 2em auto;
  outline: none;
  border: none;
  border-radius: 1em;
  padding: 1rem;

  font-family: inherit;
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(50 50 50 / 0.5);
  box-shadow: 2px 2px 17px 0px #0000005c;
  background-color: rgba(204, 149, 74, 0.9);
  color: #fff;

  transition: transform 100ms linear, background-color 100ms linear;

  :hover {
    background-color: rgba(204, 149, 74, 1);
    transform: scale(1.05);
  }
`;
