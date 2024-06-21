/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import React, {useEffect, useState} from 'react';
import {Pressable, SafeAreaView, View, Text, Dimensions, Image, Alert} from 'react-native';
import {useStyle} from '../src/style';
import axios from 'axios';
import Carousel from '../src/Banner/Carousel';


export function Main({navigation}) {
  const {s, sc, Colors} = useStyle();

  const BASE_URL = 'http://172.19.121.9:3000'; // 设置为你的本地 API 基础 URL
  const [banner, setBanner] = useState([]);
  const [recommend, setRecommend] = useState<any>([]);
  const api = axios.create({
    baseURL: BASE_URL,
  });
  useEffect(() => {

    const fetchData = async () => {
      try {
        const recommend_d = await api.get(`/recommend/songs`);
        const [banner_d] = await Promise.all([
          api.get(`/banner?type`),
          
        ]);

        

        setBanner(banner_d.data.banners);
        // if(recommend_d.data.code === 200){
        //   Alert.alert(
        //     'ok'
        //   )
        // }
        setRecommend(recommend_d.data.data.dailySongs);

      } catch (e) {
        Alert.alert('Warning', 'Failed to fetch data');
        console.error(e);
      }
    };

    fetchData();
  }, []);

  function getTime(){
    var date = new Date();
    var hour =  date.getHours();
    if(hour >= 0 && hour < 5){
      return '凌晨好'
    }
    else if(hour>=5 && hour < 9){
      return '早上好'
    }
    else if(hour>=9 && hour < 11){
      return '上午好'
    }
    else if(hour>=11 && hour < 14){
      return '中午好'
    }
    else if(hour >= 14 && hour < 18){
      return '下午好'
    }
    else if(hour >= 18 && hour < 24){
      return '晚上好'
    }
  }

  function getDays(){
    var date = new Date();
    var day = date.getDay();
    return day;
  }

  return (
    <SafeAreaView style={{flexDirection:'column'}}>
      <Carousel banner={banner}></Carousel>
      <View style={{flexDirection:'column'}}>
        <Text style={{marginLeft:8,justifyContent:'flex-start',fontSize:24,color:Colors.front,fontWeight:'bold',marginBottom:10}}>{getTime()}</Text>
        <Pressable 
          style={{marginLeft:10,width:100,height:100}}
          onPress={()=>{
            navigation.navigate('Recommend',{playlist:recommend,isChange:false})
          }}
        >
          <Text style={[{position:'absolute',top: 10, left: 10,zIndex:1,fontSize:16,color:'white',fontWeight:'bold'}]}>每日推荐</Text>
          <View style={[{backgroundColor: Colors.trans, width: 70, height: 70, borderRadius: 50, alignItems: 'center', justifyContent: 'center',position:'absolute',top: 60, left: 60,zIndex:1}]}/>
          {getDays()<10 && <Text style={[{position:'absolute',top: 55, left: 78,zIndex:1,fontSize:58,color:'white',fontWeight:'bold'}]}>{getDays()}</Text>}
          {getDays()>=10 && <Text style={[{position:'absolute',top: 64, left: 68,zIndex:1,fontSize:45,color:'white',fontWeight:'bold'}]}>{getDays()}</Text>}
          
          {recommend[0] ?
          <Image source={{uri:recommend[0].al.picUrl}} style={{height:200,width:200,borderRadius:10}}/> :
          <View style={[{backgroundColor: Colors.mid,height:200,width:200,borderRadius:10}]}></View>}

        </Pressable>
      </View>
    </SafeAreaView>
  );
}
