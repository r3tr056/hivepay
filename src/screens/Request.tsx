import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import { CurrentTokenState } from '../atoms';
import TokenSelector from '../components/TokenSelector';
import { SIZES } from '../constants/Assets';
import Colors from '../constants/Colors';
import { RootStackParamList } from '../navigation';

const Request = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Request'> }) => {
    const [amount, setAmount] = useState<string>('');
    const [memo, setMemo] = useState<string>('');

    const currentToken = useRecoilValue(CurrentTokenState);

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
                    <TextInput placeholder="0.00" autoFocus showSoftInputOnFocus style={{ fontWeight: 'bold', fontSize: SIZES.extraLarge }} keyboardType="number-pad" value={amount} onChangeText={(text) => setAmount(text)} />

                    <TextInput placeholder="Add a message" style={{ fontSize: SIZES.base }} value={memo} onChangeText={text => setMemo(text)} />

                </View>

            </View>
            <Button style={styles.primaryButtonView} onPress={() => navigation.navigate('Receive', { amount: amount, memo: memo })}>
                Generate QR Code
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

export default Request;