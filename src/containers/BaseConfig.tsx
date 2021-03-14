import React, { memo, ReactElement, useState } from 'react';
import { BaseConfigCtx } from '../contexts';
import { TWeekDayIndexes } from '../utils';

export type BaseConfigProps = {
  startingDay?: number | string | TWeekDayIndexes;
};

function BaseConfig({
  children,
  startingDay,
}: BaseConfigProps & IBaseProps): ReactElement {
  const [startingDayIndex /* , setStartingDayIndex */] = useState(
    (startingDay || 0) as TWeekDayIndexes
  );
  return (
    <BaseConfigCtx.Provider value={{ startingDayIndex }}>
      {children}
    </BaseConfigCtx.Provider>
  );
}

export default memo(BaseConfig);
