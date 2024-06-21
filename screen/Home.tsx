/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {Alert, FlatList, Image, Pressable, SafeAreaView, ScrollView, SectionList, Text, TouchableOpacity, View} from 'react-native';
import { useStyle } from '../src/style';
import axios from 'axios';



const TabbarComponent = ({ tabIndex, setTabIndex }) => {
  const {s} = useStyle();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 50 }}>
      <TouchableOpacity onPress={() => setTabIndex(1)}>
        <Text style={{ color: tabIndex === 1 ? 'cadetblue' : 'grey', fontSize:24 }}>歌单</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setTabIndex(2)}>
        <Text style={{ color: tabIndex === 2 ? 'cadetblue' : 'grey', fontSize:24 }}>动态</Text>
      </TouchableOpacity>
      <View
          style={[s.tabUnderline,{width:'10%',transform:[{translateX:(tabIndex-1) * 190}]}]}
        />
    </View>
  );
};

export function Home({navigation}) {
    const BASE_URL = 'http://172.19.121.9:3000'; 
    const [list,setlist] = useState([]);
    const [detail,setDetail] = useState('');
    const [nickname,setName] = useState('');
    const [level,setLevel] = useState(0);
    const [countsong,setCount] = useState(0);
    const [tabIndex,setIndex] = useState(1);

    const api = axios.create({
      baseURL: BASE_URL,
    });

    const {s, sc, Colors} = useStyle();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await api.get('/user/account');
          const userId = res.data.account.id;

          const [playlistRes, detailRes] = await Promise.all([
            api.get(`/user/playlist?uid=${userId}`),
            api.get(`/user/detail?uid=${userId}`),
          ]);

          setlist(playlistRes.data.playlist);
          setDetail(detailRes.data.profile.avatarUrl);
          setName(detailRes.data.profile.nickname);
          setLevel(detailRes.data.level);
          setCount(detailRes.data.listenSongs);
        } catch (e) {
          Alert.alert('Warning', 'Failed to fetch data');
          console.error(e);
        }
      };

      fetchData();
    }, []);

    const renderItem = ({ item }) => (
      <TouchableOpacity onPress={()=>{
        navigation.navigate('Detail',{playlist:item});
      }}>
        <View style={[s.borderbox,s.separator,{flexDirection:'column'}]}>
          <View style={s.row}>
            <Image source={{ uri: item.coverImgUrl }} style={{width:42, height:42}} />
          <View style={{flexDirection:'column'}}>
            <Text style={[s.normalText]}>{item.name}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={[s.subText,{marginTop:10}]}>{'歌单·'}{item.trackCount}{'首·'}</Text>
              <Text style={[s.subText,{marginTop:10}]}>{item.creator.nickname}</Text>
            </View>
          </View>
          </View>
        </View>
      </TouchableOpacity>
    );


    return(
      <SafeAreaView style={[s.container,s.borderbox]}>
        <View style={s.box}>
          <Image source={{uri:detail}} style={{borderRadius:50,width:100,height:100,marginLeft:140}}/>
          <Text style={[s.titleText,{color:Colors.emphasis,marginLeft:140}]}>{nickname}</Text>
          <Text style={[s.smallText,{marginLeft:150,marginBottom:30,marginTop:20}]}>{level}{'等级     '}{countsong}{'听歌'}</Text>
        </View>
        <View style={[s.borderbox,{elevation: 3,height:500,marginTop:10}]}>
          <TabbarComponent tabIndex={tabIndex} setTabIndex={setIndex} />
          {tabIndex === 1 &&
            <View style={[{margin:16}]}>
                <FlatList
                  data={list}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                />
            </View>}
          {tabIndex === 2 &&
            <View>
              <Text>
                dongtai
              </Text>
            </View>}
        </View>
      </SafeAreaView>
    );
}


