
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast from '../components/Toast';
import Button from '../components/primitives/Button';
import TextInput from '../components/primitives/TextInput';
import Colors from '../constants/Colors';
import { useAuth } from '../context/auth';
import { RootStackParamList } from '../navigation';

const LoginScreen = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> }) => {

    const { signIn } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [errMsg, setErrMsg] = useState<string>('');

    const onLoginPressed = () => {
        setLoading(true);
        signIn().then(() => {
            setLoading(false);
            navigation.navigate('Home');
        }).catch(error => {
            setLoading(false);
            setErrMsg(error.message)
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Welcome back.
            </Text>
            <Text style={styles.header}>Login to HivePay</Text>
            <TextInput
                aria-label='username'
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
                autoComplete='username'
                keyboardType='email-address'
            />
            <Button loading={loading} mode="contained" onPress={onLoginPressed}>
                Login
            </Button>
            <Toast message={errMsg} onDismiss={() => { }} type='error' />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    header: {
        fontSize: 21,
        letterSpacing: -1.5,
        lineHeight: 48,
        color: Colors.black50,
        textAlign: "left",
        fontWeight: '600',
    },
    logo: {
        width: 110,
        height: 110,
        marginBottom: 8,
    },
    buttonLabel: {
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 26,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: Colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: Colors.primary,
    },
    forgotUsername: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    }
});

export default LoginScreen;
