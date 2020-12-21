import React, {
  memo,
  ReactElement,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { LayoutChangeEvent } from 'react-native';
import { MONTH_ORDER } from '../consts';
import { CalendarDimensionsCtx } from '../contexts';
import { Month } from '../utils/classes';

// eslint-disable-next-line @typescript-eslint/naming-convention
enum SET_STATE {
  UNSET,
  TRUE,
  FALSE,
}

export type CalendarDimensionsProps = {
  children: ReactElement | ReactElement[];
};

function CalendarDimensions({
  children,
}: CalendarDimensionsProps): ReactElement {
  const [isSet, setIsSet] = useState(false);
  /**
   * Month can have 5 or 6 week rows.
   * If we get the initial measurement from the month that has 5 week rows, we need to add 1 extra.
   * That way when we get to 6 row month, we have a correct height.
   * We want to update this only once so we use int map
   */
  const [addExtraRow, setAddExtraRow] = useState(SET_STATE.UNSET);
  const [rowHeight, setRowHeight] = useState(0);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [availableWidth, setAvailableWidth] = useState(0);

  useEffect(() => {
    if (availableWidth && rowHeight && calendarHeight) setIsSet(true);
  }, [availableWidth, rowHeight, calendarHeight]);

  const getHeight = useCallback(() => {
    if (!calendarHeight || !rowHeight) return 0;
    let extra = 0;
    if (addExtraRow === SET_STATE.TRUE) extra = rowHeight;
    return extra + calendarHeight;
  }, [rowHeight, calendarHeight]);

  const getWidth = useCallback(() => {
    if (!availableWidth) return 0;
    return availableWidth;
  }, [availableWidth]);

  const updateMonthViewHeight = useCallback(
    (m: Month) => {
      if (m.order !== MONTH_ORDER.PRESENT) return undefined;

      if (!calendarHeight) {
        return ({
          nativeEvent: {
            layout: { height },
          },
        }: LayoutChangeEvent): void => {
          if (addExtraRow === SET_STATE.UNSET) {
            if (m.numberOfWeeks <= 5) setAddExtraRow(SET_STATE.TRUE);
            else setAddExtraRow(SET_STATE.FALSE);
          }
          setCalendarHeight(height);
        };
      }
      return undefined;
    },
    [calendarHeight]
  );
  const updateRowHeight = useCallback(
    (m: Month) => {
      if (m.order !== MONTH_ORDER.PRESENT) return undefined;
      if (!rowHeight) {
        return ({
          nativeEvent: {
            layout: { height },
          },
        }: LayoutChangeEvent): void => {
          setRowHeight(height);
        };
      }
      return undefined;
    },
    [rowHeight]
  );

  const updateWidth = useCallback(() => {
    if (!availableWidth) {
      return ({
        nativeEvent: {
          layout: { width },
        },
      }: LayoutChangeEvent): void => {
        setAvailableWidth(width);
      };
    }
    return undefined;
  }, [availableWidth]);

  return (
    <CalendarDimensionsCtx.Provider
      value={{
        calendarHeight,
        setCalendarHeight,
        rowHeight,
        setRowHeight,
        getHeight,
        updateMonthViewHeight,
        updateRowHeight,
        updateWidth,
        isSet,
        getWidth,
        width: getWidth(),
        height: getHeight(),
      }}
    >
      {children}
    </CalendarDimensionsCtx.Provider>
  );
}

export default memo(CalendarDimensions);
