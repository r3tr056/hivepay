import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";
import Colors from "../constants/Colors";
import { AccountContext } from "../helpers/account";

const HomePage = () => {
    const navigation = useNavigation();
    const [usdBalance, setUsdBalance] = useState();
    const { getUSDBalance, getTransactions, transactions } = React.useContext(AccountContext);

    React.useEffect(() => {
        const loadData = async () => {
            if (!transactions) {
                await getTransactions();
                setUsdBalance(getUSDBalance());
            }
        }
        loadData();
    }, []);

    const onSendClick = () => {
        navigation.navigate('Send');
    }

    const onScanClick = () => {
        navigation.navigate('Scan');
    }

    const onRequestClick = () => {
        navigation.navigate('Request');
    }

    const onViewAllTransactionsClicked = () => {
        navigation.navigate('Transactions');
    }

    return (
        <View style={styles.homepage}>
            <Pressable
                style={styles.hamburgerMenu}
                onPress={() => navigation.toggleDrawer()}
            >
                <Ionicons
                    name="menu"
                    size={24}
                />
            </Pressable>
            <Pressable
                style={[styles.notification_button, styles.iconLayout]}
                // navigate to notification page
                onPress={() => navigation.navigate("Notifications")}
            >
                <Ionicons
                    name="notifications"
                    size={24}
                />
            </Pressable>
            <View style={[styles.wallet_card_red_bg, styles.wallet_card_layout]} />
            <Pressable
                style={styles.wallet_card}
                onPress={() => navigation.navigate("Wallet")}
            >
                <Text
                    style={[styles.yourBalance, styles.text1Clr]}
                >{`Your Balance `}</Text>
                <View style={[styles.rectangleParent, styles.groupChildLayout]}>
                    <View style={[styles.groupChild, styles.groupChildLayout]} />
                    <Text style={[styles.topUp, styles.topUpTypo]}>Top Up</Text>
                </View>
                <Text style={[styles.text1, styles.topUpTypo]}>$ 2000</Text>
                <Image
                    style={[styles.vuesaxlineareyeSlashIcon, styles.yourBalancePosition]}
                    contentFit="cover"
                    source={require("../assets/vuesaxlineareyeslash.png")}
                />
                <Image
                    style={[
                        styles.vuesaxlinearbinanceCoinBnIcon,
                        styles.homepageChildLayout,
                    ]}
                    contentFit="cover"
                    source={require("../assets/vuesaxlinearbinancecoinbnb.png")}
                />
            </Pressable>
            <Pressable
                style={[styles.groupParent, styles.parentGroupLayout]}
                onPress={() => navigation.navigate("SendMoneyPage")}
            >
                <View style={[styles.vuesaxlineartradeParent, styles.parentLayout]}>
                    <Image
                        style={[styles.vuesaxlineartradeIcon, styles.iconLayout]}
                        contentFit="cover"
                        source={require("../assets/vuesaxlineartrade.png")}
                    />
                    <Text style={[styles.addMoney, styles.sendTypo]}>Add Money</Text>
                </View>
                <View style={[styles.groupWrapper, styles.parentGroupLayout]}>
                    <View style={[styles.sendParent, styles.scanPosition]}>
                        <Text style={[styles.send, styles.sendTypo]}>Send</Text>
                        <Image
                            style={[styles.vuesaxlineararrowDownIcon, styles.iconLayout]}
                            contentFit="cover"
                            source={require("../assets/vuesaxlineararrowdown.png")}
                        />
                    </View>
                </View>
            </Pressable>
            <Pressable
                style={[styles.scanParent, styles.parentGroupLayout]}
                onPress={() => navigation.navigate("ScannerPage")}
            >
                <Text style={[styles.scan, styles.scanPosition]}>Scan</Text>
                <Image
                    style={styles.vuesaxlinearscanIcon}
                    contentFit="cover"
                    source={require("../assets/vuesaxlinearscan.png")}
                />
            </Pressable>
            <Pressable
                style={[styles.homepageInner, styles.parentGroupLayout]}
                onPress={() => navigation.navigate("MoneyRequest")}
            >
                <View style={[styles.requestParent, styles.parentLayout]}>
                    <Text style={[styles.send, styles.sendTypo]}>Request</Text>
                    <Image
                        style={[styles.vuesaxlineararrowDownIcon1, styles.iconLayout]}
                        contentFit="cover"
                        source={require("../assets/vuesaxlineararrowdown1.png")}
                    />
                </View>
            </Pressable>
            <View style={[styles.frameParent, styles.groupFrameLayout]}>
                <Image
                    style={[styles.groupItem, styles.groupFrameLayout]}
                    contentFit="cover"
                    source={require("../assets/frame-5.png")}
                />
                <Text style={[styles.akash, styles.akashTypo]}>Akash</Text>
                <Text style={[styles.aug252022, styles.topUpTypo]}>Aug 25, 2022</Text>
                <Text style={[styles.text2, styles.akashTypo]}>+ $100</Text>
            </View>
            <View style={[styles.frameGroup, styles.groupFrameLayout]}>
                <Image
                    style={[styles.groupItem, styles.groupFrameLayout]}
                    contentFit="cover"
                    source={require("../assets/frame-5.png")}
                />
                <Text style={[styles.dhruval, styles.akashTypo]}>Dhruval</Text>
                <Text style={[styles.aug252022, styles.topUpTypo]}>Aug 25, 2022</Text>
                <Text style={[styles.text2, styles.akashTypo]}>+ $100</Text>
            </View>
            <View style={[styles.frameContainer, styles.groupFrameLayout]}>
                <Image
                    style={[styles.groupItem, styles.groupFrameLayout]}
                    contentFit="cover"
                    source={require("../assets/frame-5.png")}
                />
                <Text style={[styles.dhruval, styles.akashTypo]}>Ankur</Text>
                <Text style={[styles.aug252022, styles.topUpTypo]}>Aug 25, 2022</Text>
                <Text style={[styles.text2, styles.akashTypo]}>+ $100</Text>
            </View>
            <View style={[styles.groupView, styles.groupFrameLayout]}>
                <Image
                    style={[styles.groupItem, styles.groupFrameLayout]}
                    contentFit="cover"
                    source={require("../assets/frame-5.png")}
                />
                <Text style={[styles.akash, styles.akashTypo]}>Akash</Text>
                <Text style={[styles.aug252022, styles.topUpTypo]}>Aug 25, 2022</Text>
                <Text style={[styles.text2, styles.akashTypo]}>+ $100</Text>
            </View>
            <View style={styles.transactionsParent}>
                <Text style={[styles.transactions, styles.akashTypo]}>
                    Transactions
                </Text>
                <Pressable
                    style={styles.viewAll}
                    onPress={() => navigation.navigate("Transaction")}
                >
                    <Text style={[styles.viewAll1, styles.viewAll1Typo]}>View All</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    iconPosition: {
        top: 0,
        position: "absolute",
    },
    iconLayout: {
        width: 24,
        height: 24,
    },
    wallet_card_layout: {
        height: 150,
        position: "absolute",
    },
    text1Clr: {
        color: Color.systemBackgroundLightPrimary,
        left: 24,
    },
    groupChildLayout: {
        height: 30,
        width: 84,
        position: "absolute",
    },
    topUpTypo: {
        fontFamily: FontFamily.poppinsSemiBold,
        textAlign: "center",
        fontWeight: "600",
        position: "absolute",
    },
    yourBalancePosition: {
        top: 24,
        position: "absolute",
    },
    parentGroupLayout: {
        height: 92,
        width: 97,
        borderRadius: Border.br_xs,
        backgroundColor: Color.colorGray_300,
        position: "absolute",
        overflow: "hidden",
    },
    parentLayout: {
        height: 52,
        top: 20,
    },
    sendTypo: {
        fontSize: FontSize.size_xs,
        fontFamily: FontFamily.poppinsSemiBold,
        textAlign: "center",
        fontWeight: "600",
    },
    scanPosition: {
        left: 34,
        position: "absolute",
    },
    groupFrameLayout: {
        height: 56,
        position: "absolute",
    },
    akashTypo: {
        color: Color.labelColorLightPrimary,
        fontFamily: FontFamily.poppinsSemiBold,
        fontWeight: "600",
        position: "absolute",
    },
    viewAll1Typo: {
        fontFamily: FontFamily.poppinsMedium,
        fontWeight: "500",
    },
    headerBarMiddle: {
        left: 82,
        borderBottomRightRadius: Border.br_lg,
        borderBottomLeftRadius: Border.br_lg,
        backgroundColor: Color.labelColorLightPrimary,
        width: 140,
        height: 25,
    },
    text: {
        letterSpacing: 1,
        fontFamily: FontFamily.outfitSemiBold,
        color: Color.colorGray_200,
        textAlign: "center",
        fontWeight: "600",
        top: 3,
        fontSize: FontSize.size_base,
        left: 0,
        position: "absolute",
    },
    headerBarLeftIcon: {
        left: 227,
        width: 96,
        height: 24,
        top: 3,
        position: "absolute",
    },
    navBar: {
        top: -1,
        width: 323,
        height: 27,
        left: 20,
        position: "absolute",
    },
    icon: {
        height: "100%",
        width: "100%",
    },
    hamburgerMenu: {
        top: 60,
        width: 40,
        height: 40,
        left: 36,
        position: "absolute",
    },
    notification_button: {
        right: 36,
        top: 60,
        position: "absolute",
    },
    wallet_card_red_bg: {
        top: 140,
        borderRadius: 16,
        width: 98,
        backgroundColor: Colors.primary,
        left: 242,
    },
    balance: {
        fontWeight: "500",
        top: 24,
        position: "absolute",
        textAlign: "center",
        fontSize: FontSize.size_base,
        color: Color.systemBackgroundLightPrimary,
    },
    groupChild: {
        borderRadius: Border.br_5xs,
        backgroundColor: Color.element,
        left: 0,
        top: 0,
    },
    topUp: {
        top: 5,
        left: 17,
        color: Color.colorWhitesmoke_100,
        fontSize: FontSize.size_sm,
    },
    rectangleParent: {
        top: 108,
        left: 24,
    },
    text1: {
        top: 50,
        fontSize: FontSize.size_5xl,
        color: Color.systemBackgroundLightPrimary,
        left: 24,
    },
    vuesaxlineareyeSlashIcon: {
        left: 143,
        width: 24,
        height: 24,
    },
    vuesaxlinearbinanceCoinBnIcon: {
        top: 45,
        left: 187,
        width: 150,
    },
    wallet_card: {
        top: 132,
        padding: 21,
        borderRadius: 16,
        width: '100%',
        height: 164,
        backgroundColor: Colors.black50,
        position: "absolute",
        overflow: "hidden",
    },
    vuesaxlineartradeIcon: {
        top: 0,
        position: "absolute",
        left: 20,
    },
    addMoney: {
        color: Color.element,
        top: 34,
        fontSize: FontSize.size_xs,
        left: 0,
        position: "absolute",
    },
    vuesaxlineartradeParent: {
        left: 14,
        width: 69,
        position: "absolute",
    },
    send: {
        top: 34,
        fontSize: FontSize.size_xs,
        left: 0,
        position: "absolute",
        color: Color.colorWhitesmoke_100,
    },
    vuesaxlineararrowDownIcon: {
        left: 3,
        top: 0,
        position: "absolute",
    },
    sendParent: {
        width: 31,
        height: 52,
        top: 20,
    },
    groupWrapper: {
        left: 0,
        top: 0,
    },
    groupParent: {
        left: 22,
        top: 332,
        width: 97,
    },
    scan: {
        top: 54,
        fontSize: FontSize.size_xs,
        fontFamily: FontFamily.poppinsSemiBold,
        textAlign: "center",
        fontWeight: "600",
        color: Color.colorWhitesmoke_100,
    },
    vuesaxlinearscanIcon: {
        left: 37,
        top: 20,
        width: 24,
        height: 24,
        position: "absolute",
    },
    scanParent: {
        left: 132,
        top: 332,
        width: 97,
    },
    vuesaxlineararrowDownIcon1: {
        left: 13,
        top: 0,
        position: "absolute",
    },
    requestParent: {
        width: 50,
        left: 24,
        position: "absolute",
    },
    homepageInner: {
        top: 332,
        width: 97,
        left: 242,
    },
    groupItem: {
        width: 56,
        height: 56,
        borderRadius: Border.br_xs,
        left: 0,
        top: 0,
        overflow: "hidden",
    },
    akash: {
        left: 63,
        top: 4,
        color: Color.labelColorLightPrimary,
        fontSize: FontSize.size_base,
        textAlign: "center",
    },
    aug252022: {
        top: 27,
        color: Color.colorDarkgray_200,
        left: 63,
        fontSize: FontSize.size_sm,
    },
    text2: {
        top: 7,
        left: 226,
        fontSize: FontSize.size_lg,
        textAlign: "center",
    },
    frameParent: {
        top: 521,
        width: 284,
        height: 56,
        left: 37,
    },
    dhruval: {
        textAlign: "left",
        left: 63,
        top: 4,
        color: Color.labelColorLightPrimary,
        fontSize: FontSize.size_base,
    },
    frameGroup: {
        top: 681,
        width: 284,
        height: 56,
        left: 36,
    },
    frameContainer: {
        top: 601,
        width: 284,
        height: 56,
        left: 37,
    },
    groupView: {
        top: 761,
        width: 284,
        height: 56,
        left: 36,
    },
    transactions: {
        fontSize: FontSize.size_3xl,
        width: 149,
        textAlign: "center",
        left: 0,
        top: 0,
    },
    viewAll1: {
        color: Color.colorRoyalblue,
        textAlign: "right",
        width: 64,
        fontSize: FontSize.size_sm,
    },
    viewAll: {
        left: 237,
        top: 9,
        position: "absolute",
    },
    transactionsParent: {
        top: 460,
        left: 29,
        width: 301,
        height: 33,
        position: "absolute",
    },
    homepage: {
        backgroundColor: Color.colorWhitesmoke_100,
        flex: 1,
        height: Layout.window.height,
        overflow: "hidden",
        width: "100%",
    },
});

export default HomePage;
