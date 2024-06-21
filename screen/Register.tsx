/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyle } from '../src/style';
import StepIndicator from 'react-native-step-indicator';
import axios from 'axios';


export function Register({navigation}) {

    const [phone,setPhone] = useState<string>('');
    const [captcha,setCaptcha] = useState<string>('');
    const [name,setName] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [step,setStep] = useState(1);
    const {sc, s, Colors} = useStyle();

    const BASE_URL = 'http://172.19.121.9:3000'; // 设置为你的本地 API 基础 URL

    const api = axios.create({
        baseURL: BASE_URL,
    });

    const getCode = ({phonenum = ''})=>{
        return api.get(`/captcha/sent?phone=${phonenum}`);
    };

    const verifyCode = ({phonenum = '',captchanum = ''})=>{
        return api.get(`/captcha/verify?phone=${phonenum}&captcha=${captchanum}`);
    };

    const register = ({phonenum = '',captchanum = '',nickname = '',newpassword = ''})=>{
        return api.get(`/register/cellphone?phone=${phonenum}&password=${newpassword}&captcha=${captchanum}&nickname=${nickname}`)
    };

    const handleGetcode = async()=>{
        if(!phone){
            Alert.alert(
                'Warning',
                'Please input correct number'
            );
            return;
        }
        const response = await getCode({phonenum:phone});
        if(response.data.code === 200){
            // 60秒后才能再次请求验证码
        }
        else{
            Alert.alert(
                'sent captcha failed',
                'check your phone number'
            );
        }
    };

    const handleVercode = async()=>{
        if(!phone || !captcha){
            Alert.alert(
                'Warning',
                'Please input correct number'
            );
            return;
        }
        try{
            const responsebycode = await verifyCode({phonenum:phone,captchanum:captcha});
            if(responsebycode.data.code === 200){
                setStep(2);
            }
        }catch(error){
            Alert.alert(
                'verify captcha failed',
                'check your captcha'
            );
        }
    };

    const handleRegister = async()=>{
        if(!name || !password){
            Alert.alert(
                'Warning',
                'Please input correct information'
            );
            return;
        }
        const responseReg = await register({phonenum:phone,captchanum:captcha,nickname:name,newpassword:password});
        if(responseReg.data.code === 200){
            Alert.alert(
                'Successful',
                'You can back to login now'
            );
        }
    };

    const labels = ['Get captcha','Set your file'];

    const renderStep = ()=>{
        switch(step){
            case 1:
                return(
                    <View style={[s.centered,sc.card,s.radius]}>
                        <Text style={s.subTitleText}>Register</Text>
                        <View style={s.padding}>
                            <View style={s.row}>
                                <Text style={[s.normalText,{marginTop: 20}]}>Phone{'       '}</Text>
                                <TextInput
                                style={[sc.inputPass,{width: '70%'}]}
                                value={phone}
                                onChangeText={setPhone}
                                />
                            </View>
                        </View>
                        <View>
                            <View style={[s.row,{gap:12}]}>
                                <Text style={[s.normalText,{marginTop: 20}]}>Captcha{'       '}</Text>
                                <TextInput
                                style={[sc.inputPass,{width:'40%',marginLeft:2}]}
                                value={captcha}
                                onChangeText={setCaptcha}
                                />
                                <Pressable
                                    style={[sc.boxAct2,{justifyContent:'flex-end'}]}
                                    onPress={()=>{
                                        handleGetcode();
                                    }}
                                >
                                    <Text>Get Code</Text>
                                </Pressable>
                            </View>
                        </View>
                        <Pressable
                            style={{marginLeft:250,marginTop:18}}
                            onPress={()=>{
                                handleVercode();
                            }}
                        >
                            <Text style={{color:Colors.link,fontSize:20}}>Next{' >'}</Text>
                        </Pressable>
                    </View>
                );
            case 2:
                return(
                    <View style={[sc.card,s.radius]}>
                        <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Pressable
                                style={{position: 'absolute',right: '80%',top:'8%'}}
                                onPress={()=>{
                                    setStep(1);
                                }}
                            >
                                <Text style={{color:Colors.link,fontSize:16}}>{'<'}Go Back</Text>
                            </Pressable>
                        </View>
                        <View style={[s.padding,{marginTop:10}]}>
                            <View style={s.row}>
                                <Text style={[s.normalText,{marginTop: 20,justifyContent:'flex-end'}]}>Name{'       '}</Text>
                                <TextInput
                                style={[sc.inputPass,{width: '70%'}]}
                                value={name}
                                onChangeText={setName}
                                />
                            </View>
                        </View>
                        <View>
                            <View style={[s.row,{gap:17}]}>
                                <Text style={[s.normalText,{marginTop: 20,marginLeft:13}]}>Password{''}</Text>
                                <TextInput
                                style={[sc.inputPass,{width:'64%'}]}
                                value={password}
                                onChangeText={setPassword}
                                />
                            </View>
                        </View>
                        <Pressable
                            style={{marginLeft:285,marginTop:18}}
                            onPress={()=>{
                                handleRegister();
                                navigation.navigate('Loading');
                            }}
                        >
                            <Text style={{color:Colors.link,fontSize:20}}>Finish</Text>
                        </Pressable>
                    </View>
                );
        }
    };

    return(
        <SafeAreaView style={s.inputbox}>
            <StepIndicator
                stepCount={2}
                currentPosition={step}
                labels={labels}/>
            {renderStep()}
        </SafeAreaView>
    );
}
