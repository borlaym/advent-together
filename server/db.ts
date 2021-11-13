import firebase from "./firebase";
import { Calendar } from "./types";
import { v4 as uuid } from 'uuid';

export const calendarsRef = firebase.ref('/calendar');

export function createCalendar(): Promise<Calendar> {
  const newCalendar: Calendar = {
    uuid: uuid(),
    presents: []
  }
  return calendarsRef.push(newCalendar).then(() => newCalendar);
}