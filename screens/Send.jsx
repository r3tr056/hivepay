import React, { useEffect, useState } from "react";
import { Text, TextInput, Touchable, View } from "react-native";
import { useRecoilValue } from "recoil";
import { CurrentTokenState } from "../atoms";
import { SIZES } from "../constants/Assets";
import COLORS from '../constants/Colors';
import styles from '../styles';

import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { useAuth } from "../helpers/auth";
import { transferHive } from '../helpers/hive_wallet';

const Send = ({ qrObj = {} }) => {
    const navigation = useNavigation();
    const { user } = useAuth();

    const [sending, setSending] = useState(false);
    const [amount, setAmount] = useState();
    const [memo, setMemo] = useState('');
    const [recipientUsername, setRecipientUsername] = useState();

    // NOTE : username search
    const [matchingUsernames, setMatchingUsernames] = useState([]);
    const [senderFound, setSenderFound] = useState();

    const currentToken = useRecoilValue(CurrentTokenState);

    useEffect(() => {
        // set the fields one by one
        if (qrObj.recp_uname) {
            setRecipientUsername(qrObj.recp_uname);
        }
        if (qrObj.recp_amount) {
            setAmount(qrObj.recp_amount);
        }
        if (qrObj.memo) {
            setMemo(qrObj.memo);
        }
    }, []);

    const searchUsernames = (username) => {
        // TODO : Search firestore for usernames and check them against the hive blockchain username api
    }

    const executeSendOrder = async () => {
        // TODO : Perform the send order
        try {
            setSending(true);
            const { username, keys: { activeKey } } = user;
            const status = await transferHive(username, activeKey, recipientUsername, amount, memo);
            // Navigate to the next page
            navigation.navigate('PaymentSuccess', { status: 'success' ? status.success : 'failed' });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View>
            <View style={[styles.cardMainWrapper, { padding: SIZES.p20 }]}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: SIZES.large }}>
                    <Text style={{ color: COLORS.black50, fontWeight: 'bold' }}>
                        Balance {user.balance} {user.token.symbol}
                    </Text>

                    <Touchable text="Use max" textStyle={{
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        color: COLORS.black50,
                    }}
                    />
                </View>

                <View style={{
                    marginVertical: SIZES.extraLarge + SIZES.font,
                    flexDirection: 'row',
                    justifyContent: "center",
                }}
                >
                    <TextInput placeholder="0.00" autoFocus showSoftInputOnFocus style={{ fontWeight: 'bold', fontSize: SIZES.extraLarge }} keyboardType="number-pad" value={amount} onChangeText={(text) => setAmount(text)} />

                    <TextInput placeholder="Add a message" style={{ fontSize: SIZES.base }} value={memo} onChangeText={(text) => setMemo(text)} />

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
                    <TextInput placeholder="Enter Recipeint Username" style={{ flex: 1, }} showSoftInputOnFocus value={recipientUsername} onChangeText={(text) => setRecipientUsername(text)} />
                    <Vector as="ionicons" name="scan" size={24} color={COLORS.black50} />
                </View>
            </View>
            <Button style={styles.primaryButtonView} onPress={() => executeSendOrder()} />
        </View>
    )
}

export default Send;