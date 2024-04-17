import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View } from 'react-native';
import { Button, Text } from "react-native-paper";
import { SIZES } from "../constants/Assets";
import Colors from "../constants/Colors";
import { RootStackParamList } from "../navigation";

const PaymentSuceess = ({ route, navigation }: { route: RouteProp<RootStackParamList, 'PaymentSuccess'>, navigation: NativeStackNavigationProp<RootStackParamList, 'PaymentSuccess'> }): React.ReactNode => {

    const status = route.params.status;

    if (status === 'success') {
        return (
            <View>
                <View>
                    <Ionicons name="checkmark-circle" size={120} color="green" />
                    <Text style={styles.success_text}>
                        Money sent successfully
                    </Text>
                </View>
                <Button onPress={() => navigation.navigate('Home')} style={styles.done_button}>
                    Done
                </Button>
            </View>
        )
    } else {
        return (
            <View>
                <View>
                    <Ionicons name="close-circle" size={120} color="red" />
                    <Text style={styles.failed_text}>
                        Transaction failed
                    </Text>
                    <Button onPress={() => navigation.navigate('Home')} style={styles.done_button}>
                        Back to Home
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    success_text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
    failed_text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
    },
    done_button: {
        backgroundColor: Colors.primary,
        marginHorizontal: SIZES.p20,
        padding: SIZES.p15,
        borderRadius: SIZES.small,
    }
})

export default PaymentSuceess;