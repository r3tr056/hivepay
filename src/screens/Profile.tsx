import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../context/auth";

const Profile = (): React.ReactNode => {
    const { user } = useAuth();

    return (
        <View>
            <Text>
                Username : {user?.username}
                Public Key : {user?.publicKey}
            </Text>
        </View>
    )
}

export default Profile;