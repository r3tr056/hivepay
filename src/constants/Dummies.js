
import { IMAGES } from "./Assets";

export const USER_DATA = {
    username: "@satoshi",
    amount: 2,
    token: "HBD",
    address: "0xE21603B45E2675fFeB9f20EED098e268219508CB",
};

/**
 * The currency price in USD is based on the price grabbed on Google on 16 Apr 2022 at around 6PM
 */

export const TOKENS = {
    'HBD': {
        id: 1,
        name: "Hive Backed Dollar",
        symbol: "HBD",
        icon: IMAGES.Hbd,
        rate: 2.45,
        priceRupees: 0.25,
        status: "I",
        balance: 0,
        defaultSwapChain: "HiveChain",
    },
    'HIVE': {
        id: 1,
        name: "Hive Token",
        symbol: "HBD",
        icon: IMAGES.Hive,
        rate: 2.45,
        priceRupees: 25.5,
        status: "I",
        balance: 0,
        defaultSwapChain: "HiveChain",
    }
};

export const TRANSACTIONS = [
    {
        id: 1,
        type: "stake",
        amount: 0,
        token: "HBD",
        date: "2022/04/16",
    },
    {
        id: 2,
        type: "swap",
        amount: 100,
        from: "Hive",
        to: "HBD",
        date: "2022/03/30",
    },
    {
        id: 12,
        type: "buy",
        amount: 100,
        token: "HBD",
        date: "2021/03/30",
    },
];