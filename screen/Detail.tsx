/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {SafeAreaView, Text, View, FlatList, Image, Pressable, TouchableOpacity} from 'react-native';
import { useStyle } from '../src/style';



export function Detail({route,navigation}) {

    const BASE_URL = 'http://172.19.121.9:3000';

    const api = axios.create({
        baseURL: BASE_URL,
    });

    const {s,sc,Colors} = useStyle();

    const { playlist } = route.params;
    const [songs,setSongs] = useState([]);

    useEffect(()=>{
        api.get(`/playlist/track/all?id=${playlist.id}`)
        .then(res=>{
            setSongs(res.data.songs);
        });
    },[]);

    const renderItem = ({item,index})=>(
        <View>
            <Pressable
                onPress={()=>{
                    navigation.navigate('Player',{playlist:item,isChange:false})
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Text style={[s.titleText,{marginLeft:10}]}>{index + 1}</Text>
                    <View style={s.padding}>
                        <Text style={s.subText}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            {item.ar.map((artist:any) => (
                                <Text key={artist.id} style={s.smallText}>
                                {artist.name}
                                </Text>
                            ))}
                            <Text style={s.smallText}>-{item.al.name}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={[s.padding,{flex: 1}]}>
            <View>
                <Pressable
                    onPress={()=>{
                        navigation.navigate('Nav',{screen:'Home'});
                    }}
                >
                    <Text style={{color:Colors.link}}>{'< '}Back</Text>
                </Pressable>
            </View>
            <View style={[sc.card,s.row,{alignItems: 'flex-start'}]}>
                <Image source={{uri:playlist.coverImgUrl}} style={{width:100,height:100}}
                />
                <View style={{}}>
                    <Text style={[s.titleText]}>{playlist.name}</Text>
                    <View style={[{flexDirection: 'row', alignItems: 'center', gap: 8,marginTop:4}]}>
                        <Image source={{uri:playlist.creator.avatarUrl}} style={[{width:16,height:16,borderRadius:50}]}/>
                        <Text style={s.smallText}>{playlist.creator.nickname + ' >'}</Text>
                    </View>
                </View>
            </View>
            <View style={[s.borderbox,{width:'100%',flex:1}]}>
                {songs ? <FlatList
                    data={songs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                /> :
                <Text style={s.titleText}>空空如也呢~</Text>}
            </View>
        </SafeAreaView>
    );
}
