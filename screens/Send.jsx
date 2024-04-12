import React from "react";
import { Text, TextInput, Touchable, View } from "react-native";
import { useRecoilValue } from "recoil";
import { CurrentTokenState } from "../atoms";
import TokenSelector from "../components/TokenSelector";
import { FONTS, SIZES } from "../constants/Assets";
import COLORS from '../constants/Colors';
import styles from '../styles';

const Send = () => {
    const currentToken = useRecoilValue(CurrentTokenState);

    return (
        <View>
            <View style={[styles.cardMainWrapper, { padding: SIZES.p20 }]}>
                <TokenSelector style={styles.selectorStyle} dropDownContainerStyle={styles.dropDownContainerStyle} />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", marginTop: SIZES.large }}>
                    <Text style={{ color: COLORS.black50, fontFamily: FONTS.monoMedium }}>
                        Balance {currentToken?.balance} {currentToken.symbol}
                    </Text>

                    <Touchable text="Use max" textStyle={{
                        textTransform: 'uppercase',
                        fontFamily: FONTS.semibold,
                        color: COLORS.tertiary,
                    }}
                    />
                </View>

                <View style={{
                    marginVertical: SIZES.extraLarge + SIZES.font,
                    flexDirection: 'row',
                    justifyContent: "center",
                }}
                >
                    <TextInput placeholder="0.00" autoFocus showSoftInputOnFocus style={{ fontFamily: FONTS.monoBold, fontSize: SIZES.extraLarge }} />

                </View>
                <Text style={{ color: COLORS.black50, fontFamily: FONTS.regular, marginBottom: SIZES.base, textTransform: "uppercase" }}>
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
                    <TextInput placeholder="Public address(0x) or ENS" style={{ flex: 1, }} showSoftInputOnFocus />
                    <Vector as="ionicons" name="scan" size={24} color={COLORS.black50} />
                </View>
            </View>
            <TouchableText text="Send" style={styles.primaryButtonView} textStyle={styles.primaryButtonText} />
        </View>
    )
}

export default Send;