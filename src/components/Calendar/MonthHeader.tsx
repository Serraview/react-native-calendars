import React, { memo, ReactElement, useContext } from 'react';
import { Pressable, View, Text } from 'react-native';
import { MonthControllerCtx } from '../../contexts';

export type MonthHeaderProps = {
  label: string;
};

function MonthHeader({ label }: MonthHeaderProps): ReactElement {
  const { monthForward, monthBack } = useContext(MonthControllerCtx);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <Pressable
        style={{ backgroundColor: '#0d839955', padding: 5 }}
        onPress={monthBack}
      >
        <Text>{'<'}</Text>
      </Pressable>
      <Text>{label}</Text>
      <Pressable
        style={{ backgroundColor: '#0d839955', padding: 5 }}
        onPress={monthForward}
      >
        <Text>{'>'}</Text>
      </Pressable>
    </View>
  );
}

export default memo(MonthHeader);
