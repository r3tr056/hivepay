import axios from "axios";

export const getCoinRequest = async (coinId: string) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        return response.data
    } catch (error) {
        console.log(error);
    }
};


export const getMarketChart = async (coinId: string) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getMarketData = async () => {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getWatchListData = async (updatedCoinId: string) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${updatedCoinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
