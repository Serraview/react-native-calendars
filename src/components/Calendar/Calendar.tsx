import React, { memo, ReactElement, useContext } from 'react';
import { View, StyleSheet /* , Platform */ } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import { CalendarDimensionsCtx, MonthControllerCtx } from '../../contexts';
import { MONTH_ORDER } from '../../consts';
import MonthWrapper from './MonthWrapper';

export type CalendarProps = {};

function Calendar(): ReactElement {
  const { updateWidth, isSet, height } = useContext(CalendarDimensionsCtx);
  const { keys, monthForward, monthBack, pagerPosition } = useContext(
    MonthControllerCtx
  );

  return (
    <View
      style={{
        backgroundColor: 'lime',
        flexGrow: 0,
        flexShrink: 1,
      }}
      pointerEvents="box-none"
    >
      {isSet ? (
        <ViewPager
          key={keys.viewPager}
          style={[
            {
              flexShrink: 1,
              backgroundColor: 'wheat',
              height,
            },
          ]}
          initialPage={pagerPosition}
          // transitionStyle="curl"
          onPageSelected={({ nativeEvent: { position } }): void => {
            if (position < pagerPosition) monthBack();
            else if (position > pagerPosition) monthForward();
          }}
          orientation="horizontal"
          scrollEnabled
        >
          <MonthWrapper key={keys.past} order={MONTH_ORDER.PAST} />
          <MonthWrapper key={keys.present} order={MONTH_ORDER.PRESENT} />
          <MonthWrapper key={keys.future} order={MONTH_ORDER.FUTURE} />
        </ViewPager>
      ) : (
        <MonthWrapper
          key={keys.present}
          order={MONTH_ORDER.PRESENT}
          style={{ borderColor: 'red', borderWidth: 1 }}
        />
      )}
      <View
        style={[StyleSheet.absoluteFill]}
        pointerEvents="none"
        key="Calendar-width-probe"
        onLayout={updateWidth()}
      />
    </View>
  );
}

export default memo(Calendar);
