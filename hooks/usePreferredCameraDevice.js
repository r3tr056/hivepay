import { useCallback, useMemo } from 'react';
import { useMMKVString } from 'react-native-mmkv';

export function usePreferredCameraDevice() {
    const [preferredDeviceId, setPreferredDeviceId] = useMMKVString('camera.preferredDeviceId');
    const set = useCallback((device) => {
        setPreferredDeviceId(device.id);
    }, [setPreferredDeviceId]);

    const devices = useCameraDevices();
    const device = useMemo(() => devices.find((d) => d.id === preferredDeviceId), [devices, preferredDeviceId]);

    return [device, set];
}