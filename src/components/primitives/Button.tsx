import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import Colors from '../../constants/Colors'

export default function Button({ mode, style, ...props }: any) {
    return (
        <PaperButton
            children={undefined} style={[
                styles.button,
                mode === 'outlined' && { backgroundColor: Colors.black50 },
                style,
            ]}
            labelStyle={styles.text}
            mode={mode}
            {...props} />
    )
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        marginVertical: 10,
        paddingVertical: 2,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 26,
    },
})