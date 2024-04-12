import React from 'react';
import { View } from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import { useRecoilValue } from 'recoil';
import { CurrentTokenState } from '../atoms';
import { SIZES } from '../constants/Assets';
import COLORS from '../constants/Colors';

const Receive = () => {
    const currentToken = useRecoilValue(CurrentTokenState);

    return (
        <View>
            <View style={{
                margin: SIZES.p20,
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.gray10,
                padding: SIZES.extraLarge,
                borderRadius: SIZES.base,
                alignItems: "center",
            }}>
                <TokenSelector style={{
                    borderColor: COLORS.gray10,
                    marginBottom: SIZES.extraLarge
                }}
                    dropdownContainerStyle={StyleSheet.dropdownContainerStyle}
                />

                <View style={{ marginVertical: SIZES.large }}>
                    <QRCodeStyled data={USER_DATA} style={styles.qr_style} padding={20} peiceSize={8} color={'#000'} errorCorrectionLevel={'H'} innerEyesOptions={{
                        borderRadius: 12,
                        color: '#ffa114',
                    }}
                        logo={{
                            href: require('../../assets/SVG_logo.png'),
                            padding: 4
                        }}
                    />
                </View>

                <Text style={{ textAlign: "center", paddingVertical: SIZES.large }}>
                    {USER_DATA.address}
                </Text>
            </View>

            <View style={{ alignItems: "center" }}>
                <Text style={{ fontFamily: FONTS.regular }}>
                    Send only {currentToken.name} {currentToken.symbol} to this address
                </Text>
                <Text style={{ fontFamily: FONTS.light }}>
                    Sending any other coins may result in permanent loss.
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: SIZES.extraLarge,
            }}
            >
                <View style={innerStyles.iconWrapper}>
                    <Vector as="feather" name="copy" style={innerStyles.icon} size={24} />
                </View>
                <View style={innerStyles.iconWrapper}>
                    <Vector as="feather" name="share" style={innerStyles.icon} size={24} />
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
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: SIZES.large,
    },
    icon: {
        padding: SIZES.font,
        color: COLORS.white,
    },
})