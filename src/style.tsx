/* eslint-disable prettier/prettier */
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

//const Is_Android = Platform.OS === 'android';

const ScreenSizes = Dimensions.get('window');
const { height, width } = ScreenSizes;
const shortSideLength = height > width ? width : height;
const unitSize = shortSideLength / 32;

const Sizes = {
    cm: 16, // 标准尺度，常用字体大小
    scm: 8, // 较小尺度，padding, margin边距调整
    mcm: 24, // 中等尺度
    bcm: 32, // 较大尺度，标题字体大小
    xcm: 64, // max 最大尺度
};

const { cm, bcm, scm, mcm, xcm } = Sizes;

export { cm, bcm, scm, mcm, xcm, unitSize, height as ScreenHeight, width as ScreenWidth };

export function useStyle() {

    const isDark = useSelector((state:any) => state.themeChange.isDark);
    // 将来Themed，至少分dark, light, perfer dark as default
    const Colors =
        isDark ? {
            bg: '#222222', // 底色
            mid: '#444444', // 中间背景色
            front: '#CFCFCF', // 前景色，primary
            sub: '#CDCDCD', // 副前景色
            shadow: '#181818', // 影子颜色
            link: 'lightskyblue', // 连接色，用于外部资源，或则场景跳转
            act: 'coral', // interactive互动，用于本场景的互动
            warn: 'tomato', // 警告色
            emphasis: 'white', // 强调色，祝贺
            trans: 'rgba(64, 64, 64, 0.5)',
        } : {
            bg: 'white', // 底色
            mid: '#efefef', // 中间背景色
            front: 'dimgray', // 前景色，primary
            sub: 'darkgrey', // 副前景色
            shadow: 'dimgray',
            link: 'cadetblue', // 连接色，用于外部资源，或则场景跳转
            act: 'lightsalmon', // interactive互动，用于本场景的互动
            warn: 'tomato', // 警告色
            emphasis: '#333333', // 强调色，祝贺
            trans: 'rgba(248, 248, 248, 0.5)',
        };

    const { front, bg, mid, sub, link, warn, act, emphasis, shadow, trans } = Colors;

    // react navigation colors
    const NavColors = {
        primary: front,
        background: bg,
        card: bg,
        text: sub,
        border: mid,
        notification: warn,
    };

    // styles ---- basic elements
    const s = StyleSheet.create({
        container: { flex: 1, backgroundColor: bg },
        row: { flexDirection: 'row', alignItems: 'center', gap: cm },
        rowSpaceBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        margin: { margin: cm },
        marginL: { marginLeft: cm },
        marginR: { marginRight: cm },
        padding: { padding: cm },
        radius: { borderRadius: cm },
        centered: { justifyContent: 'center', alignItems: 'center' },
        // text standards
        normalText: { color: front, fontSize: cm },
        // textAlignVertical only for Android
        subText: { color: sub, fontSize: cm - 2 },
        headerText: { color: front, fontSize: bcm },
        titleText: { color: front, fontSize: mcm },
        subTitleText: { color: sub, fontSize: mcm - 4 },
        importantText: { color: emphasis, fontSize: cm },
        smallText: { fontSize: cm - 4, color: sub },
        shadow: {
            elevation: 16,// android only
            shadowColor: shadow,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: scm,
        },
        //
        box: { backgroundColor: mid, padding: scm, borderRadius: scm },
        borderbox: { padding: scm, borderRadius: scm, borderColor: sub, borderWidth: StyleSheet.hairlineWidth },
        inputbox:{justifyContent:'center',marginTop: 200},
        buttontext:{fontSize:16,textAlign: 'center'},
        backButton:{color:Colors.link,fontSize:20,marginTop:20,marginLeft:20},
        tabUnderline: {
            position: 'absolute',
            bottom: 0,
            left:'20%',
            height: 2,
            backgroundColor: link,
        },
        separator:{ borderBottomWidth: 4},
        round: { backgroundColor: bg, width: bcm, height: bcm, borderRadius: cm, alignItems: 'center', justifyContent: 'center' },
        content: {
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            backgroundColor: Colors.mid,
            zIndex: 1,
            padding: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        },
    });

    // style array ---- 组合
    const sc = {
        card: [s.radius, s.padding, s.margin, { backgroundColor: mid }],
        boxLink: [s.box, { backgroundColor: link }],
        boxAct: [s.box, { backgroundColor: act }],
        boxAct2: [s.box, { backgroundColor: sub }],
        roundLink: [s.round, { backgroundColor: link }],
        roundAct: [s.round, { backgroundColor: act }],
        navigationContainer: [s.box,{backgroundColor: '#ecf0f1'}],
        input: {height: 40,margin: 12,borderWidth: 1,padding: 10},
        inputPass:{height: 40,margin: 12,borderWidth: 0,padding: 10,borderBottomColor: 'gray',borderBottomWidth: 1},
    };

    return ({ s, sc, Colors, NavColors, isDark });
}
