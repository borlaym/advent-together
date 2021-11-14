import React, { useCallback, useState } from "react";

type Props = {
  dayNumber: number;
  numberOfPresents: number;
  onSubmitPresent: (dayNumber: number, content: string) => void;
}

export default function CalendarDay({
  dayNumber,
  numberOfPresents,
  onSubmitPresent
}: Props) {
  const [newPresentInput, setNewPresentInput] = useState('');
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPresentInput(event.target.value);
  }, []);
  const submit = useCallback(() => {
    onSubmitPresent(dayNumber, newPresentInput);
    setNewPresentInput('');
  }, [dayNumber, newPresentInput, onSubmitPresent]);
  return (
    <div>
      <div>Dec {dayNumber + 1}</div>
      {numberOfPresents} presents
      <input type="text" value={newPresentInput} onChange={handleChange} /><button onClick={submit}>Add present</button>
    </div>
  )
}