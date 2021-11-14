import { Present } from "src/types";

export default function PresentListItem({ present }: { present: Present}) {
  return (
    <li>
      Day {present.day + 1}: {present.content}
    </li>
  )
}