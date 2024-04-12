import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ToggleButton } from 'react-native-paper';
import { PressableOpacity } from 'react-native-pressable-opacity';
import Reanimated, { Extrapolation, interpolate, runOnJS, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { StatusBarBlurBackground } from '../components/StatusBarBlurBg';
import { SIZES } from '../constants/Assets';
import { USER_DATA } from '../constants/Dummies';
import { useAuth } from '../helpers/auth';
import { generateReceiveQRCode } from '../helpers/hive_wallet';
import { useIsForeground } from '../hooks/useIsForeground';
import { usePreferredCameraDevice } from '../hooks/usePreferredCameraDevice';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
    zoom: true
})


export function Scan() {
    const navigation = useNavigation();

    const { user } = useAuth();
    const [scanMode, setScanMode] = useState(true);
    const [memo, setMemo] = useState('');

    const toggleScanMode = () => {
        setScanMode(prevMode => !prevMode);
    }

    const camera = useRef(null);

    // check if the camera page is active
    const isFocused = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocused && isForeground;

    // TODO : Check of front camera is needed, remove it if not
    const [cameraPos, setCameraPos] = useState('back');
    const [flash, setFlash] = useState('off')

    // NOTE : Front camera switch capablity
    const [preferredDevice] = usePreferredCameraDevice();
    let device = useCameraDevice(cameraPos);

    if (preferredDevice != null && preferredDevice.position === cameraPos) {
        device = preferredDevice;
    }

    // NOTE : Flash support for low light conditions
    const supportsFlash = device?.hasFlash ?? false;

    // Set the zoom to neutral value
    const zoom = useSharedValue(device.neutralZoom);
    const zoomOffset = useSharedValue(0);

    const cameraAnimatedProps = useAnimatedProps(() => {
        // bound value
        const z = Math.max(Math.min(zoom.value, device.maxZoom), device.minZoom);
        return { zoom: z };
    }, [zoom]);

    // NOTE : add on active listener and interpolate the pinch gesture to linear zoom values
    const pinchGesture = Gesture.Pinch()
        .onBegin(() => {
            zoomOffset.value = zoom.value;
        })
        .onUpdate(event => {
            const z = zoomOffset.value * event.scale
            zoom.value = interpolate(
                z,
                [1, 10],
                [device.minZoom, device.maxZoom],
                Extrapolation.CLAMP,
            )
        })

    // TODO :The Focus
    const tapGesture = Gesture.Tap().onEnd(({ x, y }) => {
        runOnJS(onFocusTap)({ x, y })
    });

    const onFocusTap = useCallback(({ x, y }) => {
        if (!device?.supportsFocus) return;
        camera.current?.focus({
            x: x,
            y: y,
        })
    }, [device?.supportsFocus]);

    // Code Scanner to scan QR Codes
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: onCodeScanned,
    })

    const onCodeScanned = useCallback((codes) => {
        const qrcode = codes[0]?.value;
        if (qrcode == null) return;
        const qrObj = JSON.parse(qrcode);
        navigation.navigate('Send', { qrObj });
    }, [])

    const onError = useCallback((error) => {
        console.error('Camera error:', error);
        navigation.navigate('ErrorPage', { message: `Failed to open camera : ${error}` });
    }, []);

    const onFlipCameraPressed = useCallback(() => {
        setCameraPos((p) => (p === 'back' ? 'front' : 'back'))
    }, []);

    const onFlashPressed = useCallback(() => {
        setFlash((f) => (f === 'off' ? 'on' : 'off'))
    }, [])

    // reset the zoom to it's default value everytime the 'device' changes
    useEffect(() => {
        zoom.value = device?.neutralZoom ?? 1
    }, [zoom, device]);

    if (scanMode) {
        return (
            <View style={styles.container}>
                {device != null && (
                    <GestureDetector gesture={Gesture.Race(pinchGesture, tapGesture)}>
                        <Reanimated.View onTouchEnd={onFocusTap} style={StyleSheet.absoluteFill}>
                            <ReanimatedCamera
                                ref={camera}
                                style={StyleSheet.absoluteFill}
                                device={device}
                                isActive={isActive}
                                animatedProps={cameraAnimatedProps}
                                onError={onError}
                                flash={flash}
                                onStarted={() => 'Camera stated!'}
                                onStopped={() => 'Camera stopped!'}
                                enableZoomGesture={false}
                                exposure={0}
                                codeScanner={codeScanner}
                            />

                        </Reanimated.View>
                    </GestureDetector>
                )}

                <StatusBarBlurBackground />

                <View style={styles.controls}>
                    <ToggleButton
                        icon="qr"
                        value="qr"
                        status={scanMode}
                        onPress={toggleScanMode}
                    />
                    <PressableOpacity
                        title="Flip"
                        onPress={onFlipCameraPressed}
                        style={styles.button}
                        disabledOpacity={0.4}
                    >
                        <Ionicons name="camera-reverse" size={24} color="white" />
                    </PressableOpacity>
                    {supportsFlash && (
                        <PressableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
                            <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
                        </PressableOpacity>
                    )}

                    <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
                        <Ionicons name="chevron-back" color="white" size={35} />
                    </PressableOpacity>

                </View>
            </View>
        )
    } else {
        const qrData = generateReceiveQRCode(user.username, null, memo);
        return (
            <View>
                <View style={{
                    margin: SIZES.p20,
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.gray10,
                    padding: SIZES.extraLarge,
                    borderRadius: SIZES.base,
                    alignItems: "center",
                }}>
                    <TokenSelector style={{
                        borderColor: COLORS.gray10,
                        marginBottom: SIZES.extraLarge
                    }}
                        dropdownContainerStyle={StyleSheet.dropdownContainerStyle}
                    />

                    <View style={{ marginVertical: SIZES.large }}>
                        <QRCodeStyled data={qrData} style={styles.qr_style} padding={20} peiceSize={8} color={'#000'} errorCorrectionLevel={'H'} innerEyesOptions={{
                            borderRadius: 12,
                            color: '#ffa114',
                        }}
                            logo={{
                                href: require('../../assets/SVG_logo.png'),
                                padding: 4
                            }}
                        />
                    </View>

                    <Text style={{ textAlign: "center", paddingVertical: SIZES.large }}>
                        {USER_DATA.address}
                    </Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: SIZES.extraLarge,
                }}
                >
                    <View style={innerStyles.iconWrapper}>
                        <Vector as="feather" name="copy" style={innerStyles.icon} size={24} />
                    </View>
                    <View style={innerStyles.iconWrapper}>
                        <Vector as="feather" name="share" style={innerStyles.icon} size={24} />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    button: {
        marginBottom: CONTENT_SPACING,
        width: CONTROL_BUTTON_SIZE,
        height: CONTROL_BUTTON_SIZE,
        borderRadius: CONTROL_BUTTON_SIZE / 2,
        backgroundColor: 'rgba(140, 140, 140, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightButtonRow: {
        position: 'absolute',
        right: SAFE_AREA_PADDING.paddingRight,
        top: SAFE_AREA_PADDING.paddingTop,
    },
    backButton: {
        position: 'absolute',
        left: SAFE_AREA_PADDING.paddingLeft,
        top: SAFE_AREA_PADDING.paddingTop,
    },
    iconWrapper: {
        height: 50,
        width: 50,
        borderRadius: SIZES.extraLarge,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: SIZES.large,
    },
    icon: {
        padding: SIZES.font,
        color: COLORS.white,
    },
})