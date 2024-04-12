import { Ionicons } from '@expo/vector-icons';
import { ChartPathProvider, ChartYLabel } from '@rainbow-me/animated-charts';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { AcccountContext, getCoinRequest, getMarketChart } from "../helpers/account";

export default function AccountDetails() {
    const { listData, getStoreCoinId, removeStoreCoinId } = useContext(AcccountContext);
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [coinPrice, setCoinPrice] = useState(1);
    const [usdtPrice, setUsdtPrice] = useState("");

    const route = useRoute();

    const coinInformation = async () => {
        setLoading(true);
        const getCoinData = await getCoinRequest(coinId);
        const getCoinChart = await getMarketChart(coinId);
        setData(getCoinData);
        setChartData(getCoinChart);
        setUsdtPrice(getCoinData.market_data.current_price.usd.toString());
        setLoading(false);
    };

    useEffect(() => {
        coinInformation();
    }, []);

    const { image: { small }, name, symbol, market_cap_rank, market_data: { current_price, total_volume, market_cap }, descripton: { en } } = data;
    const total_volume_usd = total_volume.usd;
    const market_cap_usd = market_cap.usd;
    const { prices } = chartData;

    const handleIconColor = price_change_percentage_24h < 0 ? "#dc2626" : "#34d399";
    const handleIcon = price_change_percentage_24h < 0 ? "caretdown" : "caretup";
    const { width: size } = Dimensions.get("window");

    const handleFromat = (value) => {
        "worklet";
        if (value === "") {
            return `$${current_price.usd.toFixed(2)}`;
        } else {
            return `$${parseFloat(value).toFixed(2)}`;
        }
    };

    const handleChartColor = current_price.usd > prices[0][1] ? "#16c784" : "#ea3943";
    const handleUsdPrice = (value) => {
        setUsdPrice(value);
        const floatValue = parseFloat(value) || 0;
        const result = (floatValue / current_price.usd).toFixed(4);
        setCoinPrice(result.toString());
    };

    const handlecoinPrice = (value) => {
        setCoinPrice(value);
        const floatValue = parseFloat(value) || 0;
        const result = (floatValue * current_price.usd).toFixed(2);
        setUsdPrice(result.toString());
    };

    const handleWatchListIconColor = () => {
        return listData.some((coinIdValue) => coinIdValue === coinId);
    };

    const handleWatchListFunction = () => {
        if (handleWatchListIconColor()) {
            return removeStoreCoinId(coinId);
        } else {
            return getStoreCoinId(coinId);
        }
    };

    return (
        <View>
            <ChartPathProvider data={{
                points: prices.map((price) => ({ x: price[0], y: price[1] })),
                smoothingStrategy: "bezier",
            }}>
                <View>
                    <Ionicons name="chevron-back" size={24} color="black" onPress={() => navigation.goBack()} />
                    <View >
                        <Image source={{ uri: small }} style={{}} />
                        <Text style={{}}>
                            {symbol.toUpperCase()}
                        </Text>
                    </View>
                    <Ionicons name="star" size={20} color={handleWithListIconColor() ? "yellow" : "white"} onPress={() => handleWithListFunction()} />
                </View>
                <View>
                    <View>
                        <Text style={{}}>{name}</Text>
                        <ChartYLabel format={handleFormat} style={styles.chart_y_label} />
                    </View>
                    <Text>Total Volume : {total_volume_usd}</Text>
                    <Text>Current Proce : {current_price}</Text>
                    <Text>Market Cap : {market_cap_usd}</Text>
                    <Text>Market Cap Rank : {market_cap_rank}</Text>
                </View>
            </ChartPathProvider>
        </View>
    )
}