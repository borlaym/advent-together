import firebase from "./firebase";
import { Calendar, Present } from "./types";
import { v4 as uuid } from 'uuid';

function getCurrentDay(forceDay: number | null) {
  console.log((Date.now() - Number(new Date('2021.12.01'))));
  console.log(new Date());
  const actualDayInDecember = Math.floor((Date.now() - Number(new Date('2021.12.01'))) / (1000 * 60 * 60 * 24));
  const canForceDay = process.env.NODE_ENV !== 'production';
  const dayInDecember = (forceDay !== null && canForceDay) ? forceDay : actualDayInDecember;
  return dayInDecember;
}

export const calendarsRef = firebase.ref('/calendar');

export function createCalendar(name: string): Promise<Calendar> {
  const newCalendar: Calendar = {
    uuid: uuid(),
    presents: [],
    name
  }
  return calendarsRef.push(newCalendar).then(() => newCalendar);
}

export function getCalendarByUuid(uuid: string): Promise<Calendar | null> {
  return calendarsRef.orderByChild('uuid').equalTo(uuid).get().then(snapshot => {
    const data: { [key: string]: Calendar } = snapshot.val() || {};
    const calendars = Object.values(data) || [];
    return calendars.find(c => c.uuid === uuid) || null;
  })
}

export function getCalendarRefByUuid(uuid: string): Promise<string | null> {
  return calendarsRef.orderByChild('uuid').equalTo(uuid).get().then(snapshot => {
    const data: { [key: string]: Calendar } = snapshot.val() || {};
    const calendarRefs = Object.keys(data) || [];
    return calendarRefs.find(key => data[key].uuid === uuid) || null;
  })
}

export function addPresent(calendarUuid: string, present: Present): Promise<Present> {
  console.log('adding present', present);
  if (present.day <= getCurrentDay(null)) {
    throw new Error('Cant add presents to past days');
  }
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

export function getVisiblePresents(calendarId: string, forceDay: number | null): Promise<VisiblePresents> {
  return getCalendarByUuid(calendarId).then(calendar => {

    if (!calendar) {
      throw new Error("Can't find calendar with that id");
    }

    const presents = calendar.presents ? Object.values(calendar.presents) : [];

    function presentsOnDay(day: number): number {
      return presents.reduce((acc, present) => {
        if (present.day === day) {
          return acc + 1;
        }
        return acc;
      }, 0);
    }

    const dayInDecember = getCurrentDay(null);

    return {
      presents: presents.filter(p => p.day <= dayInDecember),
      numberOfPresents: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(presentsOnDay),
      calendarName: calendar.name || ''
    }
  });
}

export function getPresentsOfUser(calendarId: string, userId: string): Promise<Present[]> {
  return getCalendarByUuid(calendarId).then(calendar => {
    if (!calendar) {
      throw new Error("Can't find calendar with that id");
    }
    const presents = calendar.presents ? Object.values(calendar.presents) : [];
    return presents.filter(p => p.uploader === userId);
  });
}

export function deletePresent(calendarId: string, userId: string, presentId: string): Promise<boolean> {
  return getCalendarRefByUuid(calendarId).then(ref => {
    return firebase.ref(`/calendar/${ref}/presents`).get().then(snapshot => {
      const data: { [key: string]: Present } = snapshot.val() || {};
      const presentRef = Object.keys(data).find(key => {
        return data[key].uploader === userId && data[key].uuid === presentId;
      });
      if (!presentRef) {
        throw new Error("Can't find valid present to delete");
      }

      const present = data[presentRef];
      console.log('removing present', present);

      if (present.day <= getCurrentDay(null)) {
        throw new Error('Cant delete presents from past days');
      }
      return firebase.ref(`/calendar/${ref}/presents/${presentRef}`).remove().then(() => true);
    });
  });
}