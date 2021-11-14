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