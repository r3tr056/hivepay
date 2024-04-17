import { Asset } from "@hiveio/dhive";
import { TOKENS } from '../constants/Dummies';
import { getClient } from "./hiveClient";

export const truncate = (str: string) => {
    if (!str) {
        return "";
    }
    return `${str.substring(0, 4)}...${str.substring(
        str.length - 4,
        str.length
    )}`;
}

export const validateUsername = (username: string) => {
    return new RegExp(
        /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z\-](?=[0-9a-z])){2,}([\.](?=[a-z][0-9a-z\-][0-9a-z\-])[a-z]([0-9a-z]|[0-9a-z\-](?=[0-9a-z])){1,}){0,}$/,
    ).test(username);
};


export const sanitizeUsername = (username: string) => username.toLowerCase().trim();

export const sanitizeAmount = (amount: any, currency: string, decimals = 3) => {
    if (typeof amount !== 'string') {
        amount = amount.toString();
    }
    if (currency) {
        return `${parseFloat(amount.replace(/, /g, '.')).toFixed(decimals)} ${currency}`;
    } else {
        return `${amount.replace(/,/g, '.')}`;
    }
};

export const getAccountPrice = async () => {
    const price = await getClient().database.call('get_chain_properties', []);
    return Asset.fromString(price.account_creation_fee.toString()).amount;
}

export const getRC = async (username: string) => {
    const rcAcc = await getClient().rc.findRCAccounts([username]);
    const rc = await getClient().rc.calculateRCMana(rcAcc[0]);
    return rc;
};

const convertTokenToRupees = (price: string, token: string) => {
    if (!token || !price) {
        return Number(0).toFixed(2).toString();
    }
    const chain = TOKENS[token];
    const total = price * chain.priceRupees;
    return total.toString();
}