/* eslint-disable prettier/prettier */
import React, { useEffect,useRef, useState } from 'react';
import { NavigationContainer,DarkTheme, DefaultTheme, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './screen/Home';
import SettingsScreen from './screen/Setting';
import { Main } from './screen/Main';
import { Image, DrawerLayoutAndroid, View, Text, BackHandler, Button, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import SideMenu from 'react-native-side-menu';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

import {useStyle} from './src/style';
import Input from './screen/Myinput';
import Loading from './screen/Loading';
import { Register } from './screen/Register';
import { Qrlogin } from './screen/Qrlogin';
import { Detail } from './screen/Detail';
import { Sidemenu } from './screen/Sidemenu';
import { Recommend } from './screen/Recommend';
import { Player } from './screen/Player';
import { Musiclist } from './src/PoUp/Musiclist';


const onBackPress = () => {
    // 返回 true 以禁止返回
    return true;
  };

function Nav({navigation}) {
    const [isOpen,setOpen] = useState(false);
    const themeMode = useSelector((state:any) => state.themeChange.isDark);
    const {s,sc,Colors} = useStyle();

    useFocusEffect(
        React.useCallback(() => {
          const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
          return () => backHandler.remove();
        }, [])
    );


    return (
        <SideMenu
            menu={<Sidemenu />}
            isOpen={isOpen}
            onChange={(res)=>{
                setOpen(res);
            }}
        >
        <View style={[s.container]}>
            <Pressable
                style={[{position: 'absolute',top: 18,left: 20,zIndex: 1},s.round]}
                onPress={() => {setOpen(!isOpen);}}
            >
                <Image source={require('./assets/images/cebian.png')} style={{width: 20, height: 20}}/>
            </Pressable>
            <Tab.Navigator initialRouteName="Main" screenOptions={({route})=>({
                tabBarIcon:({focused})=>{
                    let icon;
                    if(route.name === 'Home' && themeMode === false){
                            icon = focused ? (
                                <Image source={require('./assets/images/Home_s.png')}
                                style={{width:25,height:25}}/>
                            ) : (
                                <Image source={require('./assets/images/Home.png')}
                                style={{width:25,height:25}}/>
                            );
                        } else if(route.name === 'Main' && themeMode === false){
                            icon = focused ? (
                                <Image source={require('./assets/images/Main_s.png')}
                                style={{width:25,height:25}}/>
                            ) : (
                                <Image source={require('./assets/images/Main.png')}
                                style={{width:25,height:25}}/>
                            );
                        } else if(route.name === 'Settings' && themeMode === false){
                            icon = focused ? (
                                <Image source={require('./assets/images/Setting_s.png')}
                                style={{width:25,height:25}}/>
                            ) : (
                                <Image source={require('./assets/images/Setting.png')}
                                style={{width:25,height:25}}/>
                            );
                        } else if(route.name === 'Settings' && themeMode === true){
                            icon = focused ? (
                                <Image source={require('./assets/images/Setting.png')}
                                style={{width:25,height:25}}/>
                            ) : (
                                <Image source={require('./assets/images/Setting_s.png')}
                                style={{width:25,height:25}}/>
                            );
                        } else if(route.name === 'Home' && themeMode === true){
                            icon = focused ? (
                                <Image source={require('./assets/images/Home.png')}
                                style={{width:25,height:25}}/>
                            ) : (
                                <Image source={require('./assets/images/Home_s.png')}
                                style={{width:25,height:25}}/>
                            );
                        } else if(route.name === 'Main' && themeMode === true){
                            icon = focused ? (
                                <Image source={require('./assets/images/Main.png')}
                                style={{width:25,height:25}}/>
                            ) : (
                                <Image source={require('./assets/images/Main_s.png')}
                                style={{width:25,height:25}}/>
                            );
                        }
                        return icon;
                },
                tabBarActiveTintColor: themeMode ? 'grey' : 'black',
                tabBarInactiveTintColor: themeMode ? '#444444' : '#333333',
                headerTitleAlign:'center',
            })}
            >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Main" component={Main} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
        </View>
        </SideMenu>
    );
}


export default function App() {
    const {NavColors, isDark} = useStyle();
    const navTheme = isDark ? DarkTheme : DefaultTheme;
    const NavTheme = {
        ...navTheme,
        colors: {
            ...navTheme.colors,
            ...NavColors,
        },
    };

    return (
        <NavigationContainer theme={NavTheme}>
        <Stack.Navigator screenOptions={{ gestureEnabled: false, headerShown: false }} initialRouteName="Loading">
            <Stack.Screen
            name="Nav"
            component={Nav}
            options={{headerShown: false, gestureEnabled: false}}
            />
            <Stack.Screen name="Input" component={Input} />
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Qrlogin" component={Qrlogin} />
            <Stack.Screen name="Detail" component={Detail} />
            <Stack.Screen name="Recommend" component={Recommend} />
            <Stack.Screen name="Player" component={Player} />
            <Stack.Screen name="Musiclist" component={Musiclist} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}
