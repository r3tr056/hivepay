import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import QRCodeStyled from "react-native-qrcode-styled";
import { useRecoilValue } from "recoil";
import { CurrentTokenState } from "../atoms";
import TokenSelector from "../components/TokenSelector";
import { SIZES } from "../constants/Assets";
import Colors from "../constants/Colors";
import { useAuth } from "../context/auth";
import { RootStackParamList } from "../navigation";


const Receive = ({ navigation, route }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Receive'>, route: RouteProp<RootStackParamList, 'Receive'> }) => {

    const { amount, memo } = route.params;
    const { user, getReceiveQRCode } = useAuth();
    const currentToken = useRecoilValue(CurrentTokenState);

    return (
        <View>
            <View style={{
                margin: SIZES.p20,
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderColor: Colors.gray10,
                padding: SIZES.extraLarge,
                borderRadius: SIZES.base,
                alignItems: "center",
            }}>
                <TokenSelector style={{ borderColor: Colors.gray10, marginBottom: SIZES.extraLarge }} dropDownContainerStyle={styles.dropDownContainerStyle} />

                <View style={{ marginVertical: SIZES.large }}>
                    <QRCodeStyled
                        data={getReceiveQRCode(amount, memo)}
                        style={styles.qrStyle}
                        padding={20}
                        pieceSize={8}
                        color={'#000'}
                        innerEyesOptions={{
                            borderRadius: 12,
                            color: '#ffa114',
                        }}
                    />
                </View>

                <Text style={{ textAlign: "center", paddingVertical: SIZES.large }}>
                    Username : {user?.username}
                </Text>
                <Text style={{ textAlign: "center", paddingVertical: SIZES.large }}>
                    Public Active Key : {user?.publicKey}
                </Text>
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text>
                    Send only {currentToken.name} ({currentToken.symbol}) to this address
                </Text>
                <Text style={{ fontWeight: '100' }}>
                    Sending any other token to this address will result in loss of funds
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: SIZES.extraLarge,
            }}>
                <View style={innerStyles.iconWrapper}>
                    <Ionicons name="copy" size={24} style={innerStyles.icon} />
                </View>
                <View style={innerStyles.iconWrapper}>
                    <Ionicons name="share-social" style={innerStyles.icon} size={24} />
                </View>
            </View>

        </View>
    );
}

const innerStyles = StyleSheet.create({
    iconWrapper: {
        height: 50,
        width: 50,
        borderRadius: SIZES.extraLarge,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: SIZES.large,
    },
    icon: {
        padding: SIZES.font,
        color: Colors.white,
    }
});

const styles = StyleSheet.create({
    qrStyle: {
        backgroundColor: 'white'
    },

    dropDownContainerStyle: {
        width: '100%',
        marginTop: 5,
        borderColor: Colors.gray10,
    }
})

export default Receive;
