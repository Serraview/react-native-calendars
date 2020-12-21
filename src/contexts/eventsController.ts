import { createContext } from 'react';
import { ParsedCalendarEvent } from '../utils/types';

export interface IEventsControllerCtx {
  getEventsForDate:(date:Date)=>ParsedCalendarEvent[];
}
export const EventsControllerCtx = createContext<IEventsControllerCtx>({
  getEventsForDate:()=>[]
});
