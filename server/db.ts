import firebase from "./firebase";
import { Calendar, Present } from "./types";
import { v4 as uuid } from 'uuid';

export const calendarsRef = firebase.ref('/calendar');

export function createCalendar(): Promise<Calendar> {
  const newCalendar: Calendar = {
    uuid: uuid(),
    presents: []
  }
  return calendarsRef.push(newCalendar).then(() => newCalendar);
}

export function getCalendarByUuid(uuid: string): Promise<Calendar | null> {
  return calendarsRef.orderByChild('uuid').equalTo(uuid).get().then(snapshot => {
    const data: { [key: string]: Calendar } = snapshot.val() || {};
    const calendars = Object.values(data) || [];
    return calendars.find(c => c.uuid === uuid);
  })
}

export function getCalendarRefByUuid(uuid: string): Promise<string | null> {
  return calendarsRef.orderByChild('uuid').equalTo(uuid).get().then(snapshot => {
    const data: { [key: string]: Calendar } = snapshot.val() || {};
    const calendarRefs = Object.keys(data) || [];
    return calendarRefs.find(key => data[key].uuid === uuid);
  })
}

export function addPresent(calendarUuid: string, present: Present): Promise<Present> {
  return getCalendarRefByUuid(calendarUuid).then(firebaseId => {
    if (!firebaseId) {
      throw new Error("Can't find calendar with that id");
    }
    return firebase.ref(`/calendar/${firebaseId}/presents`).push(present);
  }).then(() => {
    return present;
  })
}

export type VisiblePresents = {
  presents: Present[];
  numberOfPresents: number[]
}



export function getVisiblePresents(calendarId: string): Promise<VisiblePresents> {
  return getCalendarByUuid(calendarId).then(calendar => {

    function presentsOnDay(day: number): number {
      return calendar.presents.reduce((acc, present) => {
        if (present.day === day) {
          return acc + 1;
        }
        return acc;
      }, 0);
    }

    const dayInDecember = Math.floor((Date.now() - new Date('2021.12.01')) / 1000 * 60 * 60 * 24);
    return {
      presents: calendar.presents.filter(p => p.day <= dayInDecember),
      numberOfPresents: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(presentsOnDay)
    }
  });
}