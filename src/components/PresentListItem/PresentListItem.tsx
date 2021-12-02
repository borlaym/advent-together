import styled from 'styled-components';
import { useCallback } from "react";
import { Present } from "../../types";
import { original, thumbnail } from '../UploadForm/ImageUploader';
import { getCurrentDay } from '../../utils/getCurrentDay';

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

const Text = styled.span`
  margin-left: 5px;
  @media screen and (max-width: 440px) {
    font-size: 0.9em;
  }
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const Date = styled.span`
  white-space: nowrap;
  font-weight: bold;
  font-size: 0.9em;
`;

export const InlineButton = styled.button`
  display: inline-block;
  margin: 0 0 0 10px;
  outline: none;
  border: none;
  border-radius: 3px;
  padding: 0.2em 0.3em;
  cursor: pointer;

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
      <Date>Dec. {present.day + 1}:</Date> {present.image && (
        <a href={original(present.image)} target="_blank" rel="noreferrer">
          <img src={thumbnail(present.image)} alt={present.content} />
        </a>
      )} <Text title={present.content}>{present.content}</Text> {present.day > getCurrentDay() && <InlineButton onClick={deleteItem}>✖</InlineButton>}
    </ListItem>
  )
}
