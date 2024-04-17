import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';
import { useCallback, useState } from "react";
import { Alert, StyleSheet, View } from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity';
import { Camera, CameraRuntimeError, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { StatusBarBlurBackground } from '../components/StatusBarBlurBg';
import Toast from '../components/Toast';
import Colors from '../constants/Colors';
import { useAuth } from '../context/auth';
import { useIsForeground } from '../hooks/useIsForeground';
import { RootStackParamList } from '../navigation';


const ImportKeys = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'ImportKeys'> }) => {

    const { importKeys } = useAuth();
    const device = useCameraDevice('back');

    const [successMsg, setSuccessMsg] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    // check if the camera page is active
    const isFocused = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocused && isForeground;

    // On Code scan callback
    const onCodeScanned = useCallback((codes: any[]) => {
        const qrcode = codes[0]?.value;
        if (qrcode == null) return;
        importKeys(qrcode).then((success) => {
            if (success) {
                setSuccessMsg('Successfully Imported Keys from Keychain!')
                Alert.alert('Successfully Imported Keys from Keychain!')
            } else {
                setErrorMsg('Unable to Import Keys from keychain')
                Alert.alert('Unable to Import Keys from keychain')
            }
        }).catch(error => {
            setErrorMsg(error);
        });
    }, []);

    const onError = useCallback((error: CameraRuntimeError) => {
        setErrorMsg(`Camera error: ${error.toString()}`);
    }, []);

    // Code Scanner to scan QR Codes
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: onCodeScanned,
    })

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

            <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
                <Ionicons name="chevron-back" color="white" size={35} />
            </PressableOpacity>

            <Toast message={errorMsg} onDismiss={() => { navigation.navigate('Home') }} type='error' />
            <Toast message={successMsg} type='success' onDismiss={() => { }} />
        </View>
    );

};

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

export default ImportKeys;