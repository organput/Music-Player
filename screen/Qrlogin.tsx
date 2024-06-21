/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { useStyle } from '../src/style';

const BASE_URL = 'http://172.19.121.9:3000'; // 替换为你的 API 地址

const api = axios.create({
  baseURL: BASE_URL,
});

export function Qrlogin({navigation}) {
  const {s,sc,Colors} = useStyle();
  const [unikey, setUnikey] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [qrStatus, setQrStatus] = useState(801); // 初始状态为等待扫码

  useEffect(() => {
    // 在组件挂载时获取二维码 key
    getQrKey();
  }, []);

  const getQrKey = async () => {
    try {
      const response = await api.get('/login/qr/key');
      if (response.data.code === 200) {
        setUnikey(response.data.data.unikey);
        // 根据获取的 key 生成二维码
        generateQRCode(response.data.data.unikey);
      } else {
        Alert.alert('Error', 'Failed to generate QR key');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch QR key');
      console.error(error);
    }
  };

  const generateQRCode = async key => {
    try {
      const response = await api.get(`/login/qr/create?key=${key}`);
      if (response.data.code === 200) {
        setQrUrl(response.data.data.qrurl);
        // 开始检测二维码状态
        checkQRCodeStatus(key);
      } else {
        Alert.alert('Error', 'Failed to generate QR code');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch QR code');
      console.error(error);
    }
  };

  const checkQRCodeStatus = async key => {
    let interval = setInterval(async () => {
      try {
        const response = await api.get(`/login/qr/check?key=${key}`);
        const status = response.data.code;
        if (status === 803) {
          // 如果二维码状态为授权登录成功，处理登录逻辑或导航到其他页面
          navigation.navigate('Nav');
        }
        if (status === 800 || status === 803){
            clearInterval(interval);
        }
        setQrStatus(status);
      } catch (error) {
        console.error(error);
      }
    }, 2000); // 每隔 2 秒轮询一次
  };

  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   {qrStatus === 802 && (
    //     <Text style={{fontSize: 20,color:Colors.mid}}>Please confirm login on your device</Text>
    //   )}
    //   {qrStatus === 803 && (
    //     <Text style={{fontSize: 20,color:Colors.emphasis}}>QR Code login successful!</Text>
    //   )}
    //   {qrStatus === 800 && <Text style={[,{fontSize: 20,color:Colors.warn}]}>QR Code expired</Text>}
    //   {qrUrl !== '' && qrStatus === 801 && <QRCode value={qrUrl} size={200} />}
    //   <Pressable
    //     style={{marginTop: 20}}
    //     onPress={() => navigation.navigate('Loading')}>
    //     <Text style={{color: 'blue', fontSize: 20}}>Back</Text>
    //   </Pressable>
    // </View>
    <View style={[{flex:1}]}>
        <Pressable
            onPress={()=>{
                navigation.navigate('Loading');
            }}
        >
            <Text style={s.backButton}>{'<'}Back</Text>
        </Pressable>
        <View style={{marginTop:100,marginLeft:100}}>
            {qrUrl !== '' && qrStatus === 801 && <QRCode value={qrUrl} size={200} />}
            {qrStatus === 802 && <Text style={s.subTitleText}>Please confirm login on your device</Text>}
            {qrStatus === 803 && <Text style={{color:Colors.emphasis}}>Login successful!</Text>}
            {qrStatus === 800 && <Text style={{color:Colors.warn}}>Out of Time</Text>}
        </View>
    </View>
  );
}
