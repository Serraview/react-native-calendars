import React, { memo, ReactElement } from 'react';
import { View, StyleProp, ViewStyle, ViewProps } from 'react-native';

type OwnProps = {
  children: ReactElement | ReactElement[];
  style?: StyleProp<ViewStyle>;
};

type WrapperProps = Omit<ViewProps, keyof OwnProps>;
export type WeekWrapperProps = WrapperProps & OwnProps;

function WeekWrapper({
  children,
  style = {},
  ...other
}: WeekWrapperProps): ReactElement {
  return (
    <View
      collapsable={false}
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexWrap: 'nowrap',
        },
        style,
      ]}
      {...other}
    >
      {children}
    </View>
  );
}

export default memo(WeekWrapper);
