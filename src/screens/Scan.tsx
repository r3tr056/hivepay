import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { StatusBarBlurBackground } from '../components/StatusBarBlurBg';
import Toast from '../components/Toast';
import Colors from '../constants/Colors';
import { useIsForeground } from '../hooks/useIsForeground';
import { RootStackParamList } from '../navigation';


export function Scan({ navigation, route }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Scan'>, route: RouteProp<RootStackParamList, 'Scan'> }) {

    const device = useCameraDevice('back');

    // check if the camera page is active
    const isFocused = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocused && isForeground;

    const [errMsg, setErrMsg] = useState<string>('');
    const [flash, setFlash] = useState<boolean>(false);

    // On Code scan callback
    const onCodeScanned = useCallback((codes: any[]) => {
        const qrcode = codes[0]?.value;
        if (qrcode == null) return;
        if (!qrcode.startsWith('hivepay://account=')) {
            throw new Error('Invalid QR Code');
        } else {
            const { username, amount, memo } = JSON.parse(qrcode.replace('hivepay://account=', ''));
            navigation.navigate('Send', { username, amount, memo });
        }
    }, [])


    // Code Scanner to scan QR Codes
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: onCodeScanned,
    })

    const onError = useCallback((error: any) => {
        console.error('Camera error:', error);
        setErrMsg('Camera error: ' + error.message);
    }, []);


    return (
        <View style={styles.container}>
            {device != null && (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isActive}
                    onError={onError}
                    onStarted={() => 'Camera stated!'}
                    onStopped={() => 'Camera stopped!'}
                    enableZoomGesture={true}
                    exposure={0}
                    codeScanner={codeScanner}
                />
            )}

            <StatusBarBlurBackground style={{}} />

            <View style={styles.rightButtonRow}>
                <PressableOpacity style={styles.button} onPress={() => setFlash(!flash)} disabledOpacity={0.4}>
                    <Ionicons name={flash === true ? 'flash' : 'flash-off'} color="white" size={24} />
                </PressableOpacity>
            </View>


            <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
                <Ionicons name="chevron-back" color="white" size={35} />
            </PressableOpacity>

            <Toast message={errMsg} onDismiss={() => { }} type='error' />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    button: {
        marginBottom: 100,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.gray10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightButtonRow: {
        position: 'absolute',
        right: 40,
        top: 40,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 20,
    }
})