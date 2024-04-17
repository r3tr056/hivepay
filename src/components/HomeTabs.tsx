import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { SIZES } from "../constants/Assets";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import WalletTokens from "./WalletTokens";
import WalletTransactions from "./WalletTransactions";

const ROUTES = [
    { key: 'tokens', title: 'Tokens' },
    { key: "transactions", title: "Transactions" },
]

const renderScene = SceneMap({
    tokens: WalletTokens,
    transactions: WalletTransactions
})

const HomeTabs = () => {
    const [index, setIndex] = useState(0);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: Colors.white,
                paddingHorizontal: SIZES.p20,
                paddingVertical: SIZES.p30,
                marginTop: SIZES.extraLarge,
                borderTopLeftRadius: SIZES.p40,
                borderTopRightRadius: SIZES.p40,
            }}
        >
            <TabView
                navigationState={{ index, routes: ROUTES }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Layout.window.width }}
                renderTabBar={(props) => (
                    <TabBar {...props} style={{
                        backgroundColor: Colors.white,
                        borderRadius: SIZES.base,
                        marginBottom: SIZES.p15,
                    }}
                        indicatorStyle={{
                            backgroundColor: Colors.primary,
                            height: '100%',
                            borderRadius: SIZES.base,
                        }}
                        indicatorContainerStyle={{
                            position: "absolute",
                            top: 5,
                            bottom: 5,
                            left: index !== 0 ? -5 : 5,
                        }}

                        renderLabel={({ route: { title } }) => (
                            <Text style={{ color: Colors.primary, fontWeight: "500", }}>{title}</Text>
                        )}
                    />
                )}
            />
        </View>
    )
}

export default HomeTabs;