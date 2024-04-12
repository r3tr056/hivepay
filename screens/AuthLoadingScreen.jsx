
import auth from '@react-native-firebase/auth';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { theme } from '../core/theme';

export default function AuthLoadingScreen({ navigation }) {
    auth().onAuthStateChanged((user) => {
        if (user) {
            // User is logged in
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            })
        } else {
            // User is not logged in
            navigation.reset({
                index: 0,
                routes: [{ name: 'StartScreen' }],
            })
        }
    })

    return (
        <View>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    )
}