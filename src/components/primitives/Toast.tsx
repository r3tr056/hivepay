import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Snackbar } from 'react-native-paper'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Colors from '../../constants/Colors'

export default function Toast({ type = 'error', message, onDismiss }: any) {
    return (
        <View style={styles.container}>
            <Snackbar
                visible={!!message}
                duration={3000}
                onDismiss={onDismiss}
                style={{
                    backgroundColor:
                        type === 'error' ? Colors.red : Colors.green,
                }}
            >
                <Text style={styles.content}>{message}</Text>
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 80 + getStatusBarHeight(),
        width: '100%',
    },
    content: {
        fontWeight: '500',
        color: Colors.white,
    },
})