import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from 'react-native';

const PaymentSuceess = ({ status }) => {
    const navigate = useNavigation();

    if (status === 'success') {
        return (
            <View>
                <View>
                    <Text style={styles.success_text}>
                        Money sent successfully
                    </Text>
                </View>
                <Button onPress={() => navigate.navigate('Home')} style={styles.done_button} title="Done" />
            </View>
        )
    } else {
        return (
            <View>
                <View>
                    <Text style={styles.failed_text}>
                        Transaction failed
                    </Text>
                    <Button onPress={() => navigate.navigate('Home')} style={styles.done_button} title="Back to Home" />
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
        // TODO : Add button styles
    }
})

export default PaymentSuceess;