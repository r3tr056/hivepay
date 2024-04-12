import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button } from "react-native-paper";
import { useAuth } from "../helpers/auth";

const SignUp = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [ispremium, setIsPremium] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const navigation = useNavigation();

    // NOTE : username, password, is_premium
    const { createClaimedAccount, signInWithPhoneNumber } = useAuth();

    const createAccount = (username, password, is_premium) => {
        createClaimedAccount(username, password);
        signInWithPhoneNumber(phoneNumber)
        // TODO : Implement Signin
        navigation.navigate('OTPScreen', { confirm });
    }

    return (
        <View>
            <Button onPress={() => createClaimedAccount()} />
        </View>
    )

}

export default SignUp