import { v4 as uuid } from 'uuid';

export function createAndGetUserId(calendarId?: string): string | void {
  if (!calendarId) {
    return undefined;
  }
  const rawData = window.localStorage.getItem('userTokens');
  let data;
  try {
    data = JSON.parse(rawData || '');
  } catch (err) {
    data = {};
  }
  if (data[calendarId]) {
    return calendarId;
  }
  const newId = uuid();
  data[calendarId] = newId;
  window.localStorage.setItem('userTokens', JSON.stringify(data));
  return newId;
}

export function getUserName(calendarId: string): string | void {
  const rawData = window.localStorage.getItem('userNames');
  let data;
  try {
    data = JSON.parse(rawData || '');
  } catch (err) {
    data = {};
  }
  if (data[calendarId]) {
    return calendarId;
  }
  return '';
}

export function setUserName(calendarId: string, name: string): string | void {
  const rawData = window.localStorage.getItem('userNames');
  let data;
  try {
    data = JSON.parse(rawData || '');
  } catch (err) {
    data = {};
  }
  data[calendarId] = name;
  window.localStorage.setItem('userNames', JSON.stringify(data));
}