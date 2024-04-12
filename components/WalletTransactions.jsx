import React from "react";
import { Image, Text, View } from "react-native";
import Vector from "../assets/vectors";
import { SHADOWS, SIZES } from "../constants/Assets";
import Colors from "../constants/Colors";
import { TOKENS, TRANSACTIONS } from "../constants/Dummies";

const TransactionIcon = ({ type, token, destination }) => {
    if ("swap" === type && token && destination) {
        return (
            <View style={{ flexDirection: "row", position: "relative" }}>
                <Image source={TOKENS[token].icon} style={styles.leadingIcon} />
                <Image source={TOKENS[destination].icon} style={[styles.leadingIcon, { position: "absolute", right: -20, top: 10 }]} />
            </View>
        );
    }

    if (["stake", "buy", "send"].includes(type) && token) {
        const hasDecreased = ["send", "stake"].includes(type);

        return (
            <View style={{ position: "relative" }}>
                <Image source={TOKENS[token].icon} style={styles.leadingIcon} />
                <View style={{
                    position: "absolute",
                    backgroundColor: hasDecreased ? Colors.red : Colors.green,
                    bottom: 0,
                    right: 0,
                    borderRadius: 20,
                }} >
                    <Vector as="feather" name={hasDecreased ? "minus" : "plus"} style={{ colors: Colors.white }} size={18} />
                </View>
            </View>
        );
    }

    return (
        <Vector as="feather" name="activity" size={30} style={{ colors: Colors.black50, borderColor: Colors.black50 }} />
    )
}

const TransactionTitle = ({ type, amount, token, destination, style }) => {
    if (type === "swap" && amount && destination && token) {
        return (
            <Text style={style}>
                Swap {Number(amount).toFixed(2)} {TOKENS[token].symbol} for{" "} {Number(TOKENS[destination]?.balance)} {TOKENS[destination].symbol}
            </Text>
        );
    }

    return <Text style={[style, { textTransform: "capitalize" }]}>{type}</Text>
};

const TransactionCard = ({ item }) => {
    return (
        <View style={styles.cardWrapper}>
            <View style={{
                width: SIZES.p50,
                height: SIZES.p50,
                borderRadius: 70,
                justifyContent: "center",
                alignItems: "center",
                marginRight: SIZES.p15 + 5,
                marginLeft: 9,
                ...SHADOWS.shadow8,
            }}
            >
                <TransactionIcon type={item.type} token={item.token} destination={item.to} />
            </View>
            <View style={{ width: "100%", flex: 1, alignSelf: "flex-start" }}>
                <TransactionTitle amount={item.amount || 0} type={item.type} token={item.token} destination={item.to} style={{
                    fontFamily: FONTS.semibold,
                    fontWeight: "500",
                    fontSize: 18,
                    marginBottom: 5,
                }}
                />
                <Text style={{ fontFamily: FONTS.monoLight }}>
                    {dateFormat(item.date)}
                </Text>
            </View>
            {!["approve", "swap"].includes(item.type) && item.token && (
                <View>
                    <Text style={{
                        fontFamily: FONTS.monoMedium,
                        fontSize: SIZES.large,
                        marginBottom: 5,
                    }}>
                        {item.amount} {TOKENS[item.token]?.symbol}
                    </Text>
                    <Text style={{
                        fontFamily: FONTS.monoLight,
                        alignSelf: "flex-end"
                    }}
                    >
                        ${convertTokenToDollars(item.amount || 0, item.token)}
                    </Text>
                </View>
            )}
        </View>
    )
}

const WalletTransactions = () => {
    return (
        <FlatList data={TRANSACTIONS} renderItem={TransactionCard} showsVerticalScrollIndicator={false} keyExtractor={({ id }) => `${id}`} contentContainerStyle={{ paddingBottom: SIZES.p50 }} />
    );
}