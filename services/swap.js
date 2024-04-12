import { Client } from "@hiveio/dhive";
import { hiveEngine } from "./config";

const client = new Client([]);

export const sendToken = async (key, username, obj) => {
    const result = (await client.broadcast.json(key, {
        id: hiveEngine.CHAIN_ID,
        required_auths: [username],
        required_posting_auths: [],
        json: JSON.stringify({
            contractName: 'tokens',
            contractAction: 'transfer',
            contractPayload: obj
        }),
    }));
    return result;
}

const processSwap = async (estimateId, startToken, amount, activeAccount, swapAccount) => {
    if (startToken === getCurrency('HBD') || startToken === getCurrency('HIVE')) {
        try {
            const status = await client.broadcast.transfer({
                from: activeAccount.name,
                to: sanitizeUsername(swapAccount),
                amount: sanitizeAmount(amount, startToken),
                memo: estimateId,
            });
            return true;
        } catch (error) {
            console.log('Swap, transfer currency error :', { error });
            return false;
        }
    } else {
        const tokenInfo = await getTokenInfo(startToken);
        const status = await sendToken(activeAccount.keys.active, activeAccount.name, {
            symbol: startToken,
            to: sanitizeUsername(swapAccount),
            quantity: sanitizeAmount(`${amount.toFixed(tokenInfo.precision)}`),
            memo: estimateId,
        });

        return status && status.id ? status : null;
    }
}

const getSwapHistory = async (username) => {
    // TODO : Use firebase to get history
    const res = await api.get(`token-swap/history/${username}`);
    if (res.error) {
        return [];
    }
    const swaps = [];

    for (const s of res.result) {
        if (s.status === "pending" && !s.transferInitiated) continue;
        swaps.push({
            ...s,
            amount: withCommas(Number(s.amount).toString(), 3),
            received: s.received && withCommas(Number(s.received).toString(), 3),
            finalAmount: withCommas(Number(s.received ?? s.expectedAmountAfterFee).toString(), 3),
        });
    }

    return swaps;
}

const cancelSwap = async (swapid) => {
    await api.post(`token-swap/${swapid}/cancel`, {});
}