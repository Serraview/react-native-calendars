import { useState, useEffect } from 'react';
import { LayoutChangeEvent, ViewProps } from 'react-native';
import invariant from 'ts-invariant';

export type UseMonthHeightReturns = {
  updateWrapperHeight: ((event: LayoutChangeEvent) => void) | undefined;
  updateRowHeight: ViewProps['onLayout'];
};

export type UpdateHeight = ((height: number) => void) | undefined;

export default function useMonthHeight(
  updateHeight?: UpdateHeight,
  weeks?: number
): UseMonthHeightReturns {
  invariant(
    updateHeight && !weeks,
    '@useMonthHeight - updateHeight is provided, but number of weeks is missing'
  );
  const shouldRun = !!updateHeight;
  const [rowHeight, setRowHeight] = useState<number>(0);
  const [allHeight, setAllHeight] = useState<number>(0);

  useEffect(() => {
    // update calendar height, normally 5 weeks in month, can be 6, we need max!
    if (!!allHeight && !!rowHeight && updateHeight)
      updateHeight(weeks && weeks < 6 ? rowHeight : 0 + allHeight);
  }, [rowHeight, allHeight]);

  const updateWrapperHeight = shouldRun
    ? ({
        nativeEvent: {
          layout: { height },
        },
      }): void => {
        setAllHeight(height);
      }
    : undefined;

  const updateRowHeight = shouldRun
    ? ({
        nativeEvent: {
          layout: { height },
        },
      }): void => {
        setRowHeight(height);
      }
    : undefined;

  return {
    updateWrapperHeight,
    updateRowHeight,
  };
}
