import { createContext } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { Month } from '../utils';

export interface ICalendarDimensionsCtx {
  rowHeight: number;
  setRowHeight: (newHeight: number) => void;
  calendarHeight: number;
  setCalendarHeight: (newHeight: number) => void;
  getHeight: () => number;
  getWidth: () => number;
  updateMonthViewHeight: (
    m: Month
  ) => ((e: LayoutChangeEvent) => void) | undefined;
  updateRowHeight: (m: Month) => ((e: LayoutChangeEvent) => void) | undefined;
  updateWidth: () => ((e: LayoutChangeEvent) => void) | undefined;
  isSet: boolean;
  height: number;
  width: number;
}
export const CalendarDimensionsCtx = createContext<ICalendarDimensionsCtx>({
  rowHeight: 0,
  setRowHeight: () => {},
  calendarHeight: 0,
  setCalendarHeight: () => {},
  getHeight: () => 0,
  updateMonthViewHeight: () => undefined,
  updateRowHeight: () => undefined,
  updateWidth: () => undefined,
  isSet: false,
  getWidth: () => 0,
  height: 0,
  width: 0,
});
