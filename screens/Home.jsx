import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES } from '../constants/Assets';
import Layout from "../constants/Layout";

const WALLET_TOP_TABS = [
    { title: "Send", id: 1, route: "Send" },
    { title: "Request", id: 2, route: "Request" },
    { title: "Scan", id: 3, route: "Scan" },
]

const ROUTES = [
    { key: "tokens", title: "Tokens" },
    { key: "transactions", title: "Transactions" },
];

const Home = () => {
    const [showAmount, setShowAmount] = useState(false);
    const currentToken = "HBD";
    const navigation = useNavigation();

    const onToggleAmount = () => {
        setShowAmount((state) => !state)
    }

    return (
        <View style={{ height: Layout.window.height }}>
            <View>
                <View style={{
                    height: 320,
                    ...styles.primaryColors,
                    paddingHorizontal: SIZES.p20,
                    paddingTop: SIZES.p6,
                }}
                >
                    <SafeAreaView>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginVertical: 10,
                            zIndex: 10,
                        }}
                        >
                            <TokenSelector />
                            <TouchableOpacity style={{ alignItems: "flex-end" }}>
                                <View style={{
                                    height: 50,
                                    width: 50,
                                    backgroundColor: "center",
                                    alignItems: "center",
                                    borderRadius: 50,
                                }}
                                >
                                    <Vector as="ionicons" name="scan" size={24} color={styles.primaryColor.color} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: SIZES.p15,
                        }}>
                            <Text style={{
                                color: styles.primaryColor.color,
                                fontFamily: FONTS.regular,
                                fontSize: SIZES.medium,
                            }}>
                                {USER_DATA.username}
                            </Text>

                            <View style={{ minWidth: "50%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ color: styles.primaryColor.color, fontSize: 20, fontWeight: "bold", marginVertical: SIZES.p15, flex: 1, textAlign: "center", fontFamily: FONTS.monoBold }}>
                                    {showAmount ? `US ${convertTokenToDollars(USER_DATA.amount, currentToken.name)}` : "******"}
                                </Text>

                                <TouchableOpacity onPress={onToggleAmount}>
                                    <Vector as="feather" name={showAmount ? "eye-off" : "eye"}
                                        size={16} color={styles.primaryColor.color}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                padding: 6,
                                paddingHorizontal: 12,
                                ...styles.secondaryColor,
                                borderRadius: 100,
                            }} >
                                <Text style={{ fontFamily: FONTS.regular }}>
                                    {truncate(USER_DATA.address)}
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            bottom: -50,
                            height: 60,
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            width: "100%",
                            backgroundColor: "#fff",
                            borderRadius: SIZES.p6,
                            ...SHADOWS.shadow,
                        }}
                        >
                            {WALLET_TOP_TABS.map((tab, index) => (
                                <TouchableOpacity key={index} style={{
                                    height: "60%",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    borderLeftWidth: indx !== 0 ? 0.5 : 0,
                                    borderColor: "rgba(196, 196, 196, 0.54)",
                                    paddingLeft: index !== 0 ? 20 : 0,
                                }}

                                    onPress={() => navigation.navigate(tab.route)}
                                >
                                    <Text style={{
                                        fontFamily: FONTS.medium,
                                        fontSize: SIZES.medium,
                                        color: Colors.primary,
                                    }}>
                                        {tab.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </SafeAreaView>
                </View>
            </View>
            <View style={{
                flex: 1,
                backgroundColor: Colors.white,
                paddingHorizontal: SIZES.p20,
                paddingVertical: SIZES.p30,
                marginTop: SIZES.extraLarge,
                borderTopLeftRadius: SIZES.p40,
                borderTopRightRadius: SIZES.p40,
            }}>

            </View>
        </View>
    );
}

export default Home;