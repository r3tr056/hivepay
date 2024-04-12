import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from 'react-native';

const PaymentSuceess = () => {
    const navigate = useNavigation();

    return (
        <View>
            <View>
                <Text style={styles.success_text}>
                    Money sent successfully
                </Text>
            </View>
            <Button onPress={() => navigate.navigate('Home')} style={styles.done_button} title="Done" />
        </View>
    );
}

const styles = StyleSheet.create({
    success_text: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
    done_button: {
        // TODO : Add button styles
    }
})