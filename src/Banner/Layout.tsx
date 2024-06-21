/* eslint-disable prettier/prettier */
import React from 'react';
import {FlexStyle, View} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {IComputedAnimResult} from './useComputedAnim';
import {useOffsetX} from './useOffsetX';

interface LayoutsProps {
  index: number;
  width: number;
  height?: FlexStyle['height'];
  offsetX: Animated.SharedValue<number>;
  computedAnimResult: IComputedAnimResult;
  children?: React.ReactNode; 
}

export const Layouts: React.FC<LayoutsProps> = ({
  index,
  width,
  height = '100%',
  offsetX,
  computedAnimResult,
  children,
}) => {
  const x = useOffsetX({
    offsetX,
    index,
    width,
    computedAnimResult,
  });

  const offsetXStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value - index * width}],
    };
  }, []);

  return (
    <Animated.View style={offsetXStyle}>
      <View style={{width, height}}>{children}</View>
    </Animated.View>
  );
};

export default Layouts;
