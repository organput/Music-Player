/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {  useEffect, useState } from 'react';
import {Dimensions, View, Image, TouchableWithoutFeedback, Pressable, Alert, Text, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {useComputedAnim} from './useComputedAnim';
import {Layouts} from './Layout';
import { useFocusEffect } from '@react-navigation/native';


const {width} = Dimensions.get('window');
const height = 200;

interface CarouselProps {
	banner: never[]; // Assuming banner is an array of numbers as per your previous example
}

const Carousel: React.FC<CarouselProps> = ({banner}) => {
  // 获取基础值
    const computedAnimResult = useComputedAnim(width, banner.length);
    const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
    const handlerOffsetX = useSharedValue<number>(0);
    const offsetX = useDerivedValue(() => {
      const x = handlerOffsetX.value % computedAnimResult.WL;
      return isNaN(x) ? 0 : x;
    }, [computedAnimResult]);
    const pauseAutoPlay = () => {
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
    };

    const startAutoPlay = () => {
      const id = setInterval(() => {
        // if(handlerOffsetX.value<0) var curX = -handlerOffsetX.value;
        // else var curX = handlerOffsetX.value
        if (Math.abs(Math.round(handlerOffsetX.value/width)-(handlerOffsetX.value/width))<1e-13) {
          handlerOffsetX.value = withSpring(handlerOffsetX.value - width);
          // Alert.alert(
          //   "warnning",
          //   `${Math.abs(handlerOffsetX.value - (handlerOffsetX.value / width) * width)}`
          // )
        }
        // else{
        //   Alert.alert(
        //     "warnning",
        //     `${Math.abs(handlerOffsetX.value) % width}+${handlerOffsetX.value}+${width}`
        //   )
        // }
      }, 3000);
      setTimerId(id);
    };

    const animatedListScrollHandler =
      useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
        {

          onStart: (_, ctx: any) => {
            ctx.startContentOffsetX = handlerOffsetX.value;
          },

          onActive: (e, ctx: any) => {
            handlerOffsetX.value = ctx.startContentOffsetX + e.translationX;
          },
          onEnd: (e) => {
            const nearestIndex = Math.round(handlerOffsetX.value / width);
            const targetOffset = nearestIndex * width;
            handlerOffsetX.value = withSpring(targetOffset);
          },
        },[],
    );

    function pressin(){
      Alert.alert('1');
    }
    useFocusEffect(
      React.useCallback(() => {
        startAutoPlay();
        return () => {
          pauseAutoPlay();
        };
      }, [])
    );

    return (
      <PanGestureHandler onHandlerStateChange={animatedListScrollHandler}>
        <Animated.View
          style={{
            width,
            height,
            flexDirection: 'row',
            position: 'relative',
          }}>
          {banner.map((_:any, i) => {
            return (
              <Layouts
                width={width}
                index={i}
                key={i}
                height={200}
                offsetX={offsetX}
                computedAnimResult={computedAnimResult}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderColor: 'black',
                    // borderWidth: StyleSheet.hairlineWidth,
                  }}>
                  <TouchableWithoutFeedback onPressOut={startAutoPlay} onPressIn={pauseAutoPlay}>
                    <View style={{borderRadius:10,height:200,width:400}}>
                      <Image source={{uri:_.imageUrl}} style={{resizeMode:'cover',height:150,width:400,borderRadius:10}}/>
                    </View>
                  </TouchableWithoutFeedback>
               </View>
              </Layouts>
            );
          })}
        </Animated.View>
      </PanGestureHandler>
    );
};

export default Carousel;
