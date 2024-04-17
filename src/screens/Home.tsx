import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { TouchableOpacity, View } from "react-native";
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';
import { CurrentTokenState } from '../atoms';
import HomeTabs from '../components/HomeTabs';
import TokenSelector from '../components/TokenSelector';
import { FONTS, SHADOWS, SIZES } from '../constants/Assets';
import Colors from '../constants/Colors';
import Layout from "../constants/Layout";
import { useAuth } from '../context/auth';
import { truncate } from '../helpers/utils';
import { RootStackParamList } from '../navigation';

interface Tab {
    title: string;
    id: number;
    route: any;
}

const WALLET_TOP_TABS: Tab[] = [
    { title: 'Send', id: 1, route: 'Send' },
    { title: 'Receive', id: 2, route: 'Receive' },
    { title: 'Trade', id: 3, route: 'Trade' }
]

const Home = ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> }) => {

    const { user } = useAuth();
    const [showAmount, setShowAmount] = useState(false);
    const currentToken = useRecoilValue(CurrentTokenState);

    const onToggleAmount = () => {
        setShowAmount((state) => !state)
    }

    const getTokenBalanceUSD = () => {
        return '';
    }

    return (
        <View style={{ height: Layout.window.height }}>
            <View>
                <View style={{
                    height: 320,
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
                                    <Ionicons name="scan" size={24} color={Colors.primary} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: SIZES.p15,
                        }}>
                            <Text style={{
                                color: Colors.primary,
                                fontFamily: FONTS.regular,
                                fontSize: SIZES.medium,
                            }}>
                                {user?.username}
                            </Text>

                            <View style={{ minWidth: "50%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <Text style={{ color: Colors.primary, fontSize: 20, fontWeight: "bold", marginVertical: SIZES.p15, flex: 1, textAlign: "center", fontFamily: FONTS.monoBold }}>
                                    {showAmount ? `US ${getTokenBalanceUSD()}` : "******"}
                                </Text>

                                <TouchableOpacity onPress={onToggleAmount}>
                                    <Ionicons name={showAmount ? "eye-off" : "eye"}
                                        size={16} color={Colors.primary}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                padding: 6,
                                paddingHorizontal: 12,
                                backgroundColor: Colors.secondary,
                                borderRadius: 100,
                            }} >
                                <Text style={{ fontFamily: FONTS.regular }}>
                                    {truncate(user?.publicKey!)}
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
                                    borderLeftWidth: index !== 0 ? 0.5 : 0,
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
            <HomeTabs />
        </View>
    );
}

export default Home;