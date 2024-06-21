/* eslint-disable prettier/prettier */
import React from 'react';
import {Switch, Text, View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useStyle } from '../src/style';
import { setTheme } from '../src/slice';


export default function Setting() {
  // true: dark  false: light
  const { s, sc } = useStyle();
  const theme = useSelector((state:any) => state.themeChange.isDark);
  const dispatch = useDispatch();
  const toggleTheme = ()=>{
    dispatch(setTheme());
  };
  return (
    <SafeAreaView style = {s.container}>
      <View style={[sc.card,{ flexDirection: 'row', alignItems: 'center' ,gap:144}]}>
        <Text style={[s.titleText,{justifyContent:'flex-start'}]}>{theme ? 'Dark mode' : 'Light mode'}</Text>
        <Switch onValueChange={toggleTheme} value={theme} />
      </View>
    </SafeAreaView>
  );
}


