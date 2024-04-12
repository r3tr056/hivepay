import { Asset } from "@hiveio/dhive";
import { TOKENS } from '../constants/Dummies';
import { getClient } from "./hiveClient";

export const sanitizeUsername = (username) => username.toLowerCase().trim();

export const sanitizeAmount = (amount, currency, decimals = 3) => {
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

export const getRC = async (account) => {
    const rcAcc = await getClient().rc.findRCAccounts([account.name]);
    const rc = await getClient().rc.calculateRCMana(rcAcc[0]);
    return rc;
};

const convertTokenToRupees = (price, token) => {
    if (!token || !price) {
        return Number(0).toFixed(2).toString();
    }
    const chain = TOKENS[token];
    const total = price * chain.priceRupees;
    return total.toString();
}