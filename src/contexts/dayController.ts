import { createContext } from 'react';
import { Callback } from '../utils/types';

export type DayControllerPassedProps = {
  onDateSelected?: Callback<Date>;
};

export interface IDayControllerCtx {
  selectedDate: Date;
  setSelectedDate: (newDate: Date) => void;
  minDate: Date | undefined;
  maxDate: Date | undefined;
}
export const DayControllerCtx = createContext<IDayControllerCtx>({
  selectedDate: new Date(),
  setSelectedDate: (): void => {},
  minDate: undefined,
  maxDate: undefined,
});
