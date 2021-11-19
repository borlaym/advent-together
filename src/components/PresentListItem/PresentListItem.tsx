import { useCallback } from "react";
import { Present } from "../../types";

export default function PresentListItem({
  present,
  onDelete
}: {
  present: Present;
  onDelete: (present: Present) => void;
}) {

  const deleteItem = useCallback(() => onDelete(present), [onDelete, present])

  return (
    <li>
      Dec {present.day + 1}: {present.content} <button onClick={deleteItem}>Remove present</button>
    </li>
  )
}