
import auth from '@react-native-firebase/auth';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button as PaperButton } from 'react-native-paper';

// TODO : Move the start of the app, `App.js`
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const LoginScreen = () => {
    // if null, no sms has been sent
    const [confirm, setConfirm] = useState(null);
    // verification code
    const [code, setCode] = useState('');
    const recaptchaVerifier = useRef(null);

    const [username, setUsername] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState()
    const [error, setError] = useState();

    const onAuthStateChanged = (user) => {
        if (user) {
            // Process the user
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    async function signInWithPhoneNumber(phoneNumber) {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
    }

    async function confirmCode() {
        try {
            const userCreds = await confirm.confirm(code);
            setLoading(true);
        } catch (error) {
            console.log('Invalid code.');
        }
    }

    const onLoginPressed = () => {
        signInWithPhoneNumber(phonenumber);
    }


    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.header}>
                Welcome back.
            </Text>
            <Text>Login to HivePay</Text>
            <TextInput
                aria-label='Phone Number'
                returnKeyType='next'
                style={styles.input}
                placeholder="Phone Number"
                onChangeText={setPhoneNumber}
                value={phonenumber}
                autoCapitalize="none"
                autoComplete='tel'
                keyboardType='phone-pad'
            />
            <TextInput
                aria-label='username'
                style={styles.input}
                placeholder="Username"
                onChangeText={setUsername}
                value={username}
                autoComplete='username'
                keyboardType='email-address'
            />
            <View style={styles.forgotUsername}>
                <TouchableOpacity onPress={() => navigation.navigate('FindUsernameScreen')}>
                    <Text style={styles.forgot}>Forgot your username ?</Text>
                </TouchableOpacity>
            </View>
            <PaperButton style={[styles.button]} loading={loading} mode="contained" labelStyle={styles.buttonLabel} onPress={onLoginPressed}>
                Login
            </PaperButton>
            <View style={styles.row}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>

            <Toast message={error} onDismiss={() => setError('')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        color: theme.colors.primary,
        fontWeight: 'bold',
        paddingVertical: 12,
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
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    forgotUsername: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    }
});

export default LoginScreen;
