import { enforceDay } from "./getCurrentDay";

const ROOT = process.env.NODE_ENV === 'production' ? 'https://adventinaptar.herokuapp.com/api' : 'http://localhost:9000/api';

export default function getJson<T>(path: string): Promise<T> {
  return fetch(ROOT + path, {
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'x-force-day': String(enforceDay)
    }
  })
    .then(response => response.json())
    .catch(err => console.error(err));
}

export function post<T>(path: string, body: any): Promise<T> {
  return fetch(ROOT + path, {
    method: 'POST',
    body: JSON.stringify(body),
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'x-force-day': String(enforceDay)
    }
  })
  .then(res => res.json())
}