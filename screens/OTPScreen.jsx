import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from "../helpers/auth";

const OTPScreen = ({ confirm, phonenumber }) => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState();

    const { confirmOtp, resendOtp } = useAuth();

    const verifyOtp = () => {
        confirmOtp(confirm, otp);
        navigation.navigate('Home');
    }

    return (
        <View>
            //
            <Button onPress={() => navigation.goBack()}>
                Back
            </Button>
            <Button onPress={() => verifyOtp()}>
                Verify
            </Button>
            <Button onPress={() => resendOtp(phonenumber)} >
                Resend
            </Button>
        </View>
    )
}

const style = StyleSheet.create({
    textBox: {
        // TODO
    },
    textBoxes: {
        // TODO
    }
})

export default OTPScreen;