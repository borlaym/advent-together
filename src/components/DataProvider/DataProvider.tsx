import React, { Dispatch, useReducer } from "react";
import { Present } from "../../types";

export type CalendarData = {
  presents: Present[];
  numberOfPresents: number[];
  calendarName: string;
}

type State = {
  calendarData: CalendarData | null;
  myPresents: Present[];
}

export type Action = {
  type: 'SET_PRESENTS_DATA';
  presentsData: CalendarData | null;
} | {
  type: 'SET_MYPRESENTS';
  myPresents: Present[];
} | {
  type: 'ADD_PRESENT';
  present: Present;
} | {
  type: 'DELETE_PRESENT';
  uuid: string;
}

function reducer(prevState: State, action: Action): State {
  switch (action.type) {
    case 'SET_PRESENTS_DATA':
      return {
        ...prevState,
        calendarData: action.presentsData
      };
    case 'SET_MYPRESENTS':
      return {
        ...prevState,
        myPresents: action.myPresents
      };
    case 'ADD_PRESENT':
      return {
        calendarData: {
          ...prevState.calendarData,
          numberOfPresents: prevState.calendarData?.numberOfPresents.map((n, i) => i === action.present.day ? n + 1 : n),
        },
        myPresents: [...prevState.myPresents, action.present]
      };
    case 'DELETE_PRESENT': {
      const presentToRemove = prevState.myPresents.find(p => p.uuid === action.uuid);
      if (!presentToRemove) {
        return prevState;
      }
      return {
        calendarData: {
          ...prevState.calendarData,
          numberOfPresents: prevState.calendarData?.numberOfPresents.map((n, i) => i === presentToRemove.day ? n - 1 : n),
        },
        myPresents: prevState.myPresents.filter(p => p.uuid !== action.uuid)
      }
    }
  }
}

const initialState: State = {
  calendarData: null,
  myPresents: []
}

export const StateContext = React.createContext<State>(initialState);

export const DispatchContext = React.createContext<Dispatch<Action>>(() => null);

type Props = {
  children: React.ReactNode;
}

export default function StateWrapper(props: Props): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {props.children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}