import React from "react"
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useStyle } from "../style"



export default function Poup(props) {
    const { visible, onClose, children } = props
    const {s,sc,Colors} = useStyle();
    
    return (
        <Modal transparent visible={visible} animationType={'fade'} onRequestClose={() => onClose()}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => onClose()} />
            <View style={s.content}>
                {children}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})
