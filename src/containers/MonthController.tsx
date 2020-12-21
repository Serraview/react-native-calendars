import React, { memo, ReactElement, useState, useContext } from 'react';
import { subMonths, addMonths /* , format, isSameMonth  */ } from 'date-fns';
import { MonthControllerCtx, BaseConfigCtx } from '../contexts';
import { Month } from '../utils';
import { MONTH_ORDER /* , MONTH_FORMAT */ } from '../consts';
import {
  calculateMinMonth,
  calculateMaxMonth,
  getCalculatedMonth,
  calculatePagerPosition,
  getKeys,
} from './helpers';

export type MonthControllerProps = {
  // minMonth?: Date | undefined;
  // maxMonth?: Date | undefined;
  pastScrollRange: number;
  futureScrollRange: number;
  initialDate?: Date;
};

function MonthController({
  children,
  futureScrollRange,
  pastScrollRange,
  initialDate = new Date(),
}: MonthControllerProps & IBaseProps): ReactElement {
  const { startingDayIndex } = useContext(BaseConfigCtx);
  const [currentMonth, setCurrentMonth] = useState<Month>(
    new Month({
      date: initialDate,
      startingDay: startingDayIndex,
      order: MONTH_ORDER.PRESENT,
    })
  );

  const [finalMinMonth] = useState(
    calculateMinMonth(currentMonth.date, pastScrollRange)
  );
  const [finalMaxMonth] = useState(
    calculateMaxMonth(currentMonth.date, futureScrollRange)
  );

  const [previousMonth, setPreviousMonth] = useState<Month | null>(
    getCalculatedMonth(currentMonth.date, finalMinMonth, subMonths, {
      order: MONTH_ORDER.PAST,
      startingDayIndex,
    })
  );
  const [nextMonth, setNextMonth] = useState<Month | null>(
    getCalculatedMonth(currentMonth.date, finalMaxMonth, addMonths, {
      order: MONTH_ORDER.FUTURE,
      startingDayIndex,
    })
  );

  const [pagerPosition, setPagerPosition] = useState<number>(
    calculatePagerPosition(previousMonth)
  );

  const setNewValues = (past, present, future): void => {
    setPreviousMonth(past);
    setCurrentMonth(present);
    setNextMonth(future);
    setPagerPosition(calculatePagerPosition(past));
  };

  const monthForward = (): void => {
    // console.log('%c @MonthController/monthForward', 'color:#f00', {
    //   currentMonth,
    //   previousMonth,
    //   nextMonth,
    // });
    if (!nextMonth) return;
    const newFuture = getCalculatedMonth(
      nextMonth.date,
      finalMaxMonth,
      addMonths,
      { order: MONTH_ORDER.FUTURE, startingDayIndex }
    );
    // if (newFuture === null) return;
    const newCurrent = nextMonth;
    newCurrent.order = MONTH_ORDER.PRESENT;
    const newPast = currentMonth;
    newPast.order = MONTH_ORDER.PAST;
    setNewValues(newPast, newCurrent, newFuture);
  };
  const monthBack = (): void => {
    // console.log('%c @MonthController/monthBack', 'color:#f00');
    if (!previousMonth) return;
    const newPast = getCalculatedMonth(
      previousMonth.date,
      finalMinMonth,
      subMonths,
      { order: MONTH_ORDER.PAST, startingDayIndex }
    );
    // console.log({ newPast });
    // if (newPast === null) return;
    const newCurrent = previousMonth;
    newCurrent.order = MONTH_ORDER.PRESENT;
    const newFuture = currentMonth;
    newFuture.order = MONTH_ORDER.FUTURE;
    setNewValues(newPast, newCurrent, newFuture);
  };

  const getByOrder = (order: MONTH_ORDER): Month | null => {
    switch (order) {
      case MONTH_ORDER.PAST:
        return previousMonth;
      case MONTH_ORDER.PRESENT:
        return currentMonth;
      case MONTH_ORDER.FUTURE:
        return nextMonth;
      default:
        return currentMonth;
    }
  };

  // console.groupCollapsed('MonthController');
  // console.log({
  //   currentMonth,
  //   previousMonth,
  //   nextMonth,
  //   monthForward,
  //   monthBack,
  //   getByOrder,
  //   keys: getKeys({ currentMonth, nextMonth, previousMonth }),
  //   futureScrollRange,
  //   pastScrollRange,
  //   finalMaxMonth,
  //   finalMinMonth,
  // });
  // console.groupEnd();
  return (
    <MonthControllerCtx.Provider
      value={{
        currentMonth,
        setCurrentMonth,
        previousMonth,
        setPreviousMonth,
        nextMonth,
        setNextMonth,
        monthForward,
        monthBack,
        getByOrder,
        keys: getKeys({ currentMonth, nextMonth, previousMonth }),
        pagerPosition,
      }}
    >
      {children}
    </MonthControllerCtx.Provider>
  );
}

export default memo(MonthController);
