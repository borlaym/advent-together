import styled from 'styled-components';
import { useCallback } from "react";
import { Present } from "../../types";

const ListItem = styled.li`
  margin: 0.3em;
`;

const Button = styled.button`
  display: inline-block;
  margin: 0 0 0 10px;
  outline: none;
  border: none;
  border-radius: 3px;
  padding: 0.3em;

  font-family: 'Acme', cursive;
  box-shadow: 2px 2px 17px 0px #0000005c;
  background-color: #F44336;
  color: #fff;
`;

export default function PresentListItem({
  present,
  onDelete
}: {
  present: Present;
  onDelete: (present: Present) => void;
}) {

  const deleteItem = useCallback(() => onDelete(present), [onDelete, present])

  return (
    <ListItem>
      December {present.day + 1}: {present.content} <Button onClick={deleteItem}>Töröld</Button>
    </ListItem>
  )
}
