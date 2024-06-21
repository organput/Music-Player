/* eslint-disable prettier/prettier */

import React, { useEffect, useRef } from 'react';
import {Alert, SafeAreaView, Text, View, SectionList} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useStyle } from '../src/style';
import citiesData from '../assets/network/citys.json'; // 读取本地 JSON 文件

const groupCitiesByInitial = (cities: { cityId: number, name: string, pinyin: string, isHot: number }[]) => {
  const grouped: { [key: string]: { cityId: number, name: string, pinyin: string, isHot: number }[] } = {};

  cities.forEach(city => {
    const initial = city.pinyin[0].toUpperCase();
    if (!grouped[initial]) {
      grouped[initial] = [];
    }
    grouped[initial].push(city);
  });

  return Object.keys(grouped).sort().map(key => ({
    title: key,
    data: grouped[key],
  }));
};



export default function Myinput({navigation}) {
    const {sc,s,Colors} = useStyle();
    const [text, setText] = React.useState('');
    const [city, setCity] = React.useState<{title:string,data:{cityId: number, name: string, pinyin: string, isHot: number}[]}[]>([]);
    const unsavedChanges = useRef(false);
    React.useEffect(() =>
        {
          navigation.addListener('beforeRemove', (e) => {
            if (!unsavedChanges.current) {
              // If we don't have unsaved changes, then we don't need to do anything
              return;
            }
            // Prevent default behavior of leaving the screen
            e.preventDefault();
            // Prompt the user before leaving the screen
            Alert.alert(
              'Discard changes?',
              'You have unsaved changes. Are you sure to discard them and leave the screen?',
              [
                { text: "Don't leave", style: 'cancel', onPress: () => {} },
                {
                  text: 'Discard',
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => navigation.dispatch(e.data.action),
                },
              ]
            );
          });
    }, [navigation, unsavedChanges]);

    useEffect(()=>{
      const filterCities = () => {
        const filtered = citiesData.data.cities.filter(city =>
            city.name.includes(text) || city.pinyin.startsWith(text)
        );
        const grouped = groupCitiesByInitial(filtered);
        setCity(grouped);
        unsavedChanges.current = Boolean(text);
    };
    filterCities();
    },[text]);

    return(
        <SafeAreaView style={[s.box]}>
            <TextInput
            style={[sc.input,s.radius]}
            value={text}
            placeholder="Choose where kobe to go..."
            onChangeText={setText}
            />
            <SectionList
              sections={city}
              keyExtractor={(item) => item.cityId.toString()}
              renderItem={({ item }) => (
                <View style={{ padding: 10 }}>
                  <Text style={ {color: 'black',borderColor:Colors.sub,fontSize: 18}}>{item.name}</Text>
                </View>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={{ padding: 10, backgroundColor: Colors.trans }}>
                  <Text style={[{ fontWeight: 'bold' },s.normalText]}>{title}</Text>
                </View>
              )}
            />
        </SafeAreaView>
    );
}
