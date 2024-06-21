/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, { useState } from 'react';
import {Alert, Pressable, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyle } from '../src/style';
import { TextInput } from 'react-native-gesture-handler';



export default function Loading({navigation}) {
    const [username,SetUser] = useState<string>('');
    const [password,SetPass] = useState<string>('');
    const BASE_URL = 'http://172.19.121.9:3000'; // 设置为你的本地 API 基础 URL

    const api = axios.create({
        baseURL: BASE_URL,
    });

    const login = ({ phone = '', pwd = '' }) => {
        return api.get(`/login/cellphone?phone=${phone}&password=${pwd}`, {});
    };

    const handleLogin = async () => {
        try{
          const response = await login({ phone: username, pwd: password });
        //setResponseData(response.data); // 设置响应数据到 state
          if(response.data.code === 200){
            navigation.navigate('Nav');
          }
          else if(response.data.code === 502){
            Alert.alert(
              'Login Failed',
              'Please check your paasword.',
            );
          }
          else if(response.data.code === 400){
            Alert.alert(
              'Login Failed',
              'Please check your username.',
            );
          }
        }catch(e){
          const { code, message } = e.response.data;
          if(code){
            Alert.alert(
              'Login Failed',
              message,
            );
          }
        }
    };
    const {s,sc,Colors} = useStyle();
    return(
        <SafeAreaView style={s.inputbox}>
          <View style={[s.centered,sc.card,s.radius]}>
            <Text style={s.subTitleText}>Login</Text>
            <View style={s.padding}>
              <View style={s.row}>
                <Text style={[s.normalText,{marginTop: 20}]}>Phone{'       '}</Text>
                <TextInput
                  style={[sc.inputPass,{width: '70%'}]}
                  value={username}
                  onChangeText={SetUser}
                 />
              </View>
              <View style={s.row}>
                <Text style={[s.normalText,{marginTop: 20}]}>Password</Text>
                <TextInput
                  style={[sc.inputPass,{width: '70%'}]}
                  value={password}
                  onChangeText={SetPass}
                 />
              </View>
            </View>
            <View style={[s.row,{marginLeft:160, marginTop:10}]}>
              <Pressable
                onPress={()=>{
                  handleLogin();
                }}
                style={[sc.boxLink, {width:75}]}
              >
                <Text style={s.buttontext}>Login</Text>
              </Pressable>
              <Pressable
                onPress={()=>{
                  navigation.navigate('Register')
                }}
                style={[sc.boxLink, {width:75}]}
              >
                <Text style={s.buttontext}>Register</Text>
              </Pressable>
            </View>
          </View>
          <Pressable
            style={{marginLeft:24,marginTop:8}}
            onPress={()=>{
              navigation.navigate('Qrlogin');
            }}
          >
            <Text style={{color:Colors.link}}>use other to login</Text>
          </Pressable>
        </SafeAreaView>
    );
}
