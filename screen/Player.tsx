import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import  { Alert, SafeAreaView, TouchableOpacity, View, Text, StyleSheet, Pressable, Image, FlatList} from "react-native";
import Video, { VideoRef } from 'react-native-video';
import { addTracks, setupPlayer } from "../src/Tracker/trackPlayerServices";
import TrackPlayer, { useTrackPlayerEvents,Event, useProgress } from "react-native-track-player";
import { useStyle } from "../src/style";
import Slider from '@react-native-community/slider';
import { BlurView } from '@react-native-community/blur';
import { ImageBackground } from "react-native";
import { useSelector } from "react-redux";
import { BackHandler } from "react-native";
import { getCurrentTrack } from "react-native-track-player/lib/src/trackPlayer";
import Poup from "../src/PoUp/Poup";
import { Musiclist } from "../src/PoUp/Musiclist";

export function Player({route,navigation}){

    const { playlist,isChange,changeUrl } = route.params;
    const [songUrl,setSongurl] = useState('');
    const [songID,setID] = useState<any>(0);
    const [songCi,setCi] = useState();
    const [visible, setVisible] = useState(false)
    const [isPlaying,setPlaying] = useState(true);
    const [queue, setQueue] = useState<any>([]);
    const { position, duration } = useProgress();
    const BASE_URL = 'http://172.19.121.9:3000';
    const { s,sc,Colors } = useStyle();
    const api = axios.create({
        baseURL: BASE_URL,
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
                const songs = await api.get(`/song/url?id=${playlist.id}`);
                const songci = await api.get(`/lyric/new?id=${playlist.id}`);
                const trackId = await TrackPlayer.getCurrentTrack();
                if (trackId !== null) {
                    const track = await TrackPlayer.getTrack(trackId);
                    setID(track);
                }
                const tracks = await TrackPlayer.getQueue();
                setQueue(tracks);
                setSongurl(songs.data.data[0].url);
                setCi(songci.data.lrc);
            } catch (e) {
                Alert.alert('Warning', 'Failed to fetch data');
            }
        };
        
        fetchData();
        setupPlayer();
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    }, []);

    useEffect(()=>{
        if(isChange){

        }
        else{
            if(playlist.id !== songID.id){
                playMusic(songUrl,playlist);
            }
            else{
                TrackPlayer.play();
            }
        }
    },[songUrl])

    const goBack = () => {
        navigation.goBack();
    };

    const handleBackPress = () => {
        goBack();
        return true; // 返回 true 表示我们已经处理了这个事件，不需要再交给系统处理
    };
    
    const playMusic = async (url,pl) => {
        // 停止当前播放的音乐
        await TrackPlayer.stop();

        // 添加新歌曲
        await TrackPlayer.add({
          id: pl.id,
          url: url, // 动态传入的音乐 URL
          title: pl.name,
          artist: pl.ar[0].name,
          artwork:pl.al.picUrl
        },0);
    
        // 播放音乐
        TrackPlayer.skip(0);
        TrackPlayer.play();

    };

    const pauseMusic =()=>{
        TrackPlayer.pause();
    }

    const seekTo = (value) => {
        TrackPlayer.seekTo(value);
    };

    

    const isDark = useSelector((state:any) => state.themeChange.isDark);
    return(
        <ImageBackground source={{ uri: !isChange ? playlist.al.picUrl : changeUrl}} style={{
            flex: 1
        }}>
        <BlurView style={{position: 'absolute',top: 0,left: 0,bottom: 0,right: 0,}} blurType={isDark?"light":"dark"} blurAmount={10} />
        <SafeAreaView style={{
            flex: 1,
            flexDirection:'column'
          }}>
            <Pressable
                onPress={()=>{
                    goBack();
                }}
            >
                <Text style={[{color:Colors.trans,fontSize:20,marginTop:20,marginLeft:20}]}>{'< '}Back</Text>
            </Pressable>
            <View style={{alignItems:'center'}}>
                <Text style={[{fontSize:32,color:Colors.sub,fontWeight:'bold',textAlign:'center',marginTop:10}]}>{!isChange ? playlist.name : playlist.title}</Text>
                <Text style={[s.smallText,{textAlign: 'center',marginTop:10}]}>{!isChange ? playlist.ar[0].name : playlist.artist}</Text>
                <Image source={{uri: !isChange ? playlist.al.picUrl : changeUrl}} style={{width:300,height:300,marginTop:60}}/>
                <View style={{width:'80%',backgroundColor:Colors.trans,borderRadius:10,alignItems: 'center',height:100,marginTop:60}}>
                    <Slider 
                        style={{width:'80%',height:40,marginTop:20}}
                        minimumValue={0}
                        maximumValue={duration}
                        value={position}
                        onSlidingComplete={seekTo}
                        minimumTrackTintColor="#2F4F4F"
                        maximumTrackTintColor="#F0F8FF"
                        thumbTintColor="red"
                    />
                    <View style={{flexDirection:'row', alignItems: 'center', width: '80%'}}>
                        <Pressable
                            onPress={()=>{
                                if(!isPlaying){
                                    TrackPlayer.play();
                                    setPlaying(true);
                                }
                                else{
                                    pauseMusic();
                                    setPlaying(false);
                                }
                            }}
                            style={{marginLeft:120}}
                        >
                            {songUrl ? (isPlaying ? <Image source={require('../assets/images/pause.png')} style={{width:30,height:30}}/> : <Image source={require('../assets/images/playing.png')} style={{width:30,height:30}}/>) : <Text>Loading</Text> }
                        </Pressable>
                        <Pressable
                            style={{marginLeft: 70}}
                            onPress={()=>{
                                setVisible(true);
                            }}
                        >
                            <Image source={require('../assets/images/playlist.png')} style={{width:25,height:25}} />
                        </Pressable>
                    </View>
                </View>
            </View>
            <Poup visible={visible} onClose={() => setVisible(false)}>
                <Musiclist />
            </Poup>

        </SafeAreaView>
        </ImageBackground>
    );
}
