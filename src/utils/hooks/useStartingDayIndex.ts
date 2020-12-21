import { useEffect, useState } from 'react';
import { getDayIndex, EWEEK_DAYS, TWeekDayIndexes } from '../dateHelpers';

export default function useStartingDayIndex(
  startingDay: string | EWEEK_DAYS
): TWeekDayIndexes {
  const [startingDayIndex, setStartingDayIndex] = useState(
    getDayIndex(startingDay)
  );
  useEffect(() => {
    setStartingDayIndex(getDayIndex(startingDay));
  }, [startingDay]);
  return startingDayIndex;
}
