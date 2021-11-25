import styled from 'styled-components';
import { useCallback } from "react";
import { Present } from "../../types";
import { original, thumbnail } from '../UploadForm/ImageUploader';

const ListItem = styled.li`
  margin: 0.3em;
  display: flex;
  align-items: center;

  a {
    display: flex;
  }

  img {
    max-height: 20px;
    max-width: 20px;
    display: inline-block;
    margin: 0 3px;
  }

  ::before {
    display: inline-block;
    font-family: Advent;
    content: 'h';
    margin-right: 3px;
  }
`;

export const InlineButton = styled.button`
  display: inline-block;
  margin: 0 0 0 10px;
  outline: none;
  border: none;
  border-radius: 3px;
  padding: 0.3em;

  font-family: inherit;
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
      December {present.day + 1}: {present.image && (
        <a href={original(present.image)} target="_blank">
          <img src={thumbnail(present.image)} />
        </a>
      )} {present.content} <InlineButton onClick={deleteItem}>Törlés</InlineButton>
    </ListItem>
  )
}
