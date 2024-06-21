import React from "react";
import { Button, FlatList, Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { useStyle } from "../src/style";

export function Recommend({route,navigation}){
    const { playlist } = route.params;
    const {s,sc,Colors} = useStyle();
    function getDays(){
        var date = new Date();
        var day = date.getDay();
        return day;
    }
    function getMonth(){
        var date = new Date();
        var month = date.getMonth();
        return month;
    }
    const renderItem = ({item,index})=>(
        <Pressable
            onPress={()=>{
                navigation.navigate('Player',{playlist:item,isChange:false})
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Image source={{uri:item.al.picUrl}} style={{width:42, height:42}}/>
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
    );
    return(
        <SafeAreaView>
            <Pressable 
                style={{marginTop:10}}
                onPress={()=>{
                    navigation.navigate('Nav',{screen:'Main'});
                }}
            >
                <Text style={s.backButton}>{'< '}Back</Text>
            </Pressable>
            <View style={{flexDirection:'column'}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{marginLeft:24,fontSize:64,fontWeight:'bold',color:Colors.front}}>{getDays()}</Text>
                    <Text style={{marginTop:32,fontSize:32,fontWeight:'bold',color:Colors.front}}>{'  /'}{(getMonth()<10) ? '0' + getMonth() : getMonth()}</Text>
                </View>
                <View style={sc.card}>
                    <FlatList
                        data={playlist}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}