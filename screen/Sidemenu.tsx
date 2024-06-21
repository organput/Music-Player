/* eslint-disable prettier/prettier */
import React from 'react';
import {Switch, Text, View} from 'react-native';
import {useStyle} from '../src/style';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../src/slice';

export function Sidemenu() {
    const {s, sc, Colors} = useStyle();
    const theme = useSelector((state:any) => state.themeChange.isDark);
    const dispatch = useDispatch();
    const toggleTheme = ()=>{
        dispatch(setTheme());
    };
    return (
        <View style={[{backgroundColor: Colors.mid,flex:1,height:'90%',width:'90%'},s.box]}>
            <View style={[s.borderbox,{ flexDirection: 'row', alignItems: 'center' ,gap:10}]}>
                <Text style={[s.titleText,{justifyContent:'flex-start'}]}>{theme ? 'Dark mode' : 'Light mode'}</Text>
                <Switch onValueChange={toggleTheme} value={theme} />
            </View>
        </View>
    );
}
