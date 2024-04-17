import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSatusBar from "../components/AppStatusBar";
import { IMAGES, SIZES } from "../constants/Assets";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../navigation";

const Onboarding = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> }): React.ReactNode => {
    return (
        <SafeAreaView style={styles.container}>
            <AppSatusBar backgroundColor="#fff">
                <View style={{ flex: 1 }}>
                    <Image source={IMAGES.Wallet} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                <View style={{ marginVertical: 30 }}>
                    <Text style={{ color: '#fff', fontSize: 30, lineHeight: 40 }}>
                        The future of decentrilized finance is here.
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <View style={styles.startButton}>
                        <Text
                            style={{
                                color: Colors.primary,
                                fontSize: SIZES.large,
                            }}
                        >
                            Let's get started
                        </Text>

                        <View style={styles.startIcon}>
                            <Ionicons name="arrow-forward" color="#fff" size={18} />
                        </View>
                    </View>
                </TouchableOpacity>
            </AppSatusBar>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        color: Colors.white,
        flex: 1,
        padding: SIZES.p20,
    },
    startButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        backgroundColor: Colors.secondary,
        borderRadius: 30,
        width: "100%",
        padding: 10,
        paddingHorizontal: 25,
    },
    startIcon: {
        height: 35,
        width: 35,
        borderRadius: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.tertiary,
    },
})

export default Onboarding;