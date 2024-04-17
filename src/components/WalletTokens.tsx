import { FlatList, Image, Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { useRecoilValue } from "recoil";
import { CurrentTokenState } from "../atoms";
import { SHADOWS, SIZES } from "../constants/Assets";
import Colors from "../constants/Colors";
import { TOKENS } from "../constants/Dummies";
import { getClient } from "../helpers/hiveClient";
import { IToken } from "../types";

interface Props {
    showDetails?: boolean;
    onPress?: () => void;
}

const hiveClient = getClient();

export const convertTokenToDollars = (amount: number, symbol: string): string => {
    if (!amount || !symbol) {
        return Number(0).toFixed(2).toString();
    }

    let total = 0;

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`).then(async (response) => {
        const data = await response.json();
        const tokenPrice = data[symbol]?.usd;
        if (tokenPrice) {
            total = amount * tokenPrice;
            return Number(total).toFixed(2).toString();
        }
    }).catch(error => {
        console.error("Error fetching token price from coingecko: ", error);
        return Number(0).toFixed(2).toString();
    })

    return Number(0).toFixed(2).toString();
}

const TokenCard = ({ item, showDetails = true, onPress }: { item: IToken } & Props) => {
    const hasDecreased = item.status === 'D';

    return (
        <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: showDetails ? 20 : 10 }} onPress={onPress}>
            <View style={{
                width: showDetails ? SIZES.p50 : SIZES.p40,
                height: showDetails ? SIZES.p40 : SIZES.p40,
                borderRadius: 70,
                justifyContent: "center",
                alignItems: "center",
                marginRight: SIZES.p15,
                marginLeft: showDetails ? 5 : 0,
                ...SHADOWS.shadow8,
            }}>
                <Image source={item.icon} style={{ width: "100%", height: "100%" }} />
            </View>
            <View style={{ width: "100%", height: "100%" }}>
                <Text style={{
                    fontWeight: "500",
                    fontSize: 18,
                    marginBottom: showDetails ? 5 : 0,
                }}
                >
                    {item.symbol}
                </Text>
                {showDetails && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: SIZES.medium, color: Colors.black50, marginRight: 10 }} >
                            ${convertTokenToDollars(1, item.symbol)}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: hasDecreased ? Colors.red : Colors.green,
                        }}>
                            {hasDecreased ? '-' : '+'}{item.rate}% {hasDecreased ? '↓' : '↑'}
                        </Text>
                    </View>
                )}
            </View>
            {showDetails && (
                <View>
                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: SIZES.large,
                            marginBottom: 5,
                        }}
                    >
                        {item.balance} {item.symbol}
                    </Text>
                </View>
            )}
        </Pressable>
    );
};

const WalletTokens = ({ showDetails, onPress }: Props) => {
    const currentToken = useRecoilValue(CurrentTokenState);

    const tokens = Object.values(TOKENS).reduce((acc, token) => {
        if (token.name === currentToken.name) {
            return [token, ...acc];
        }
        return [...acc, token];
    }, [] as IToken[]);

    return (
        <FlatList data={tokens} renderItem={({ item }) => <TokenCard item={item} showDetails={showDetails} onPress={onPress} />} keyExtractor={({ id }) => `${id}`} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SIZES.p50 }} />
    )
};

export default WalletTokens;