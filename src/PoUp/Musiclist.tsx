import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import TrackPlayer, { State, useTrackPlayerEvents,Event } from "react-native-track-player";
import { useStyle } from "../style";
import { useNavigation } from "@react-navigation/native";


export function Musiclist() {
    const navigation = useNavigation();
    const [queue, setQueue] = useState<any>([]);
    const [currentTrack, setCurrentTrack] = useState<any>();
    const {s,sc,Colors} = useStyle();

    async function loadPlaylist() {
      const queue = await TrackPlayer.getQueue();
      setQueue(queue);
    }

  
    useEffect(() => {
      loadPlaylist();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
        TrackPlayer.getCurrentTrack().then(res=>{
          setCurrentTrack(res);
        })
    });
  
  
    function PlaylistItem({index, title, isCurrent}) {
  
      function handleItemPress() {
        TrackPlayer.skip(index);
        TrackPlayer.play();
        navigation.navigate('Player',{playlist:title,isChange:true,changeUrl:title.artwork});
      }
  
      return (
        <TouchableOpacity onPress={handleItemPress} style={{marginBottom:10}}>
            {isCurrent || (!currentTrack && index===0) ? 
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2}}>
                <Image source={require('../../assets/images/playing.png')} style={{width:20,height:20}}/>
                <Text style={[s.titleText,{marginLeft:10,fontWeight:'bold'}]}>
                    {index+1}
                </Text>
                <Text style={[s.normalText,{marginLeft:10,fontWeight:'bold'}]}>
                    {title.title}{'   -'}{title.artist}
                </Text>
            </View>:
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2}}>
                <Text style={[s.titleText,{marginLeft:10}]}>
                    {index+1}
                </Text>
                <Text style={[s.normalText,{marginLeft:10}]}>
                    {title.title}{'   -'}{title.artist}
                </Text>
            </View> 
            }
        </TouchableOpacity>
      );
    }
  
    return(
      <View style={{backgroundColor:Colors.mid}}>
        <FlatList
        data={queue}
        renderItem={({item, index}) => <PlaylistItem
                                            index={index}
                                            title={item}
                                            isCurrent={currentTrack === index}
                                            />
        }
        />
      </View>
    );
  }