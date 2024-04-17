import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SIZES } from "../constants/Assets";
import COLORS from '../constants/Colors';

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text, TextInput } from "react-native-paper";
import { useRecoilValue } from "recoil";
import { CurrentTokenState } from "../atoms";
import TokenSelector from "../components/TokenSelector";
import Colors from "../constants/Colors";
import { useAuth } from "../context/auth";
import { getAccountBalanceFromHive, transferHive } from '../helpers/hive_wallet';
import { sanitizeAmount, sanitizeUsername } from "../helpers/utils";
import { RootStackParamList } from "../navigation";

const Send = ({ route, navigation }: { route: RouteProp<RootStackParamList, 'Send'>, navigation: NativeStackNavigationProp<RootStackParamList, 'Send'> }) => {
    // TODO : Fix this, get this from the shared state
    let { username, amount, memo } = route.params;

    const { user } = useAuth();
    const currentToken = useRecoilValue(CurrentTokenState);

    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<{ hiveBalance: string, hbdBalance: string }>({ hiveBalance: '', hbdBalance: '' });
    const [recipientUsername, setRecipientUsername] = useState();

    useEffect(() => {
        async function getBalance() {
            const fetchBalance = await getAccountBalanceFromHive(user?.username!);
            setBalance(fetchBalance);
        }
    })

    const executeSendOrder = async () => {
        // TODO : Perform the send order
        try {
            setLoading(true);
            if (user) {
                const status = await transferHive(user?.username!, user?.keys.active!, sanitizeUsername(username), sanitizeAmount(amount, 'HIVE'), memo);
                // Navigate to the next page
                navigation.navigate('PaymentSuccess', { status: status.success ? 'success' : 'failed' });
                setLoading(false);
            } else {
                throw new Error('User not logged in');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View>
            <View style={[styles.cardMainWrapper, { padding: SIZES.p20 }]}>

                <TokenSelector style={styles.selectorStyle} dropDownContainerStyle={styles.dropDownContainerStyle} />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: SIZES.large }}>
                    <Text style={{ color: Colors.black50, fontWeight: 'bold' }}>
                        Balance {currentToken.balance} {currentToken.symbol}
                    </Text>
                </View>

                <View style={{
                    marginVertical: SIZES.extraLarge + SIZES.font,
                    flexDirection: 'row',
                    justifyContent: "center",
                }}
                >
                    <TextInput placeholder="0.00" autoFocus showSoftInputOnFocus style={{ fontWeight: 'bold', fontSize: SIZES.extraLarge }} keyboardType="number-pad" value={amount} onChangeText={(text) => { amount = text }} />

                    <TextInput placeholder="Add a message" style={{ fontSize: SIZES.base }} value={memo} onChangeText={(text) => { memo = text }} />

                </View>
                <Text style={{ color: COLORS.black50, marginBottom: SIZES.base, fontWeight: 'bold', textTransform: "uppercase" }}>
                    Send to
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: COLORS.gray10,
                        height: SIZES.extraLarge * 2,
                        paddingHorizontal: SIZES.p15,
                        borderRadius: SIZES.base,
                    }}
                >
                    <TextInput placeholder="Enter Recipeint Username" style={{ flex: 1, }} showSoftInputOnFocus value={recipientUsername} onChangeText={(text) => { username = text }} left={<TextInput.Icon icon="account" />} />
                </View>
            </View>
            <Button loading={loading} style={styles.primaryButtonView} onPress={() => executeSendOrder()}>
                Send Tokens
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    cardMainWrapper: {
        margin: SIZES.p20,
        backgroundColor: Colors.white,
        borderRadius: SIZES.small,
        borderWidth: 1,
        borderColor: Colors.gray10,
    },

    primaryButtonView: {
        backgroundColor: Colors.primary,
        marginHorizontal: SIZES.p20,
        padding: SIZES.p15,
        borderRadius: SIZES.small,
    },

    selectorStyle: {
        borderColor: Colors.gray10,
    },
    dropDownContainerStyle: {
        width: "100%",
        marginTop: 5,
        borderColor: Colors.gray10,
    }

})

export default Send;