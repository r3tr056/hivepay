import { ExtendedAccount, Operation } from "@hiveio/dhive";
import { getClient } from "./hiveClient";
import { hiveEngineGet } from "./hiveEngineAPI";
import { sanitizeAmount, sanitizeUsername } from "./utils";

const client = getClient();

const SwapsConfig = {
    autoRefreshPeriodSec: +30,
    autoRefreshHistoryPeriodSec: +10,
    baseURL: 'https://swap.hive-keychain.com',
};

const getSwapAPI = async (url: string): Promise<any> => {
    try {
        return await new Promise((resolve, reject) => {
            try {
                fetch(`${SwapsConfig.baseURL}/${url}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }).then((res) => {
                    if (res && res.status === 200) {
                        return res.json();
                    }
                }).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            } catch (error) {
                reject(error);
            }
        })
    } catch (error) {
        console.error('Error fetching swap API : ', error);
        return error;
    }
}

export const getSwapTokenStartList = async (account: ExtendedAccount) => {
    let userTokenList: any = await hiveEngineGet({
        contract: 'tokens',
        table: 'balances',
        query: { account: account.name },
        indexes: [],
        limit: 100,
        offset: 0
    });

    userTokenList = userTokenList.sort((a, b) => {
        b.sumbol.toLowerCase() > a.symbol.toLowerCase() ? -1 : 1;
    })

}

const getEstimate = async (startToken: string, endToken: string, amount: string, handleErrors: () => void) => {
    if (startToken && endToken && amount.length && parseFloat(amount) > 0) {
        const res = await getSwapAPI(`token/estimate/${startToken}/${endToken}/${amount}`);
        if (res.status === 200) {
            return res.data;
        } else {
            handleErrors();
        }
        return res.data;
    }
}

type ActiveAccount = any;

// NOTE : Swap : HBD, HIVE, HIVE-ENGINE Tokens
export const processSwap = async (
    estimateId: string,
    startToken: string,
    amount: string,
    activeAccount: ActiveAccount,
    swapAccount: string
) => {
    if (startToken === 'HBD' || startToken === 'HIVE') {
        try {
            const status = await client.broadcast.transfer({
                from: activeAccount.name,
                to: sanitizeUsername(swapAccount),
                amount: sanitizeAmount(amount, startToken),
                memo: estimateId,
            }, activeAccount.keys.active!);
            return status && status.id ? status : null;
        } catch (error) {
            console.log('Swap, transfer currency error :', { error });
            return false;
        }
    } else {
        const status = await client.broadcast.sendOperations([['custom_json', {
            symbol: startToken,
            to: sanitizeUsername(swapAccount),
            quantity: sanitizeAmount(amount),
            memo: estimateId,
        }]] as Operation[], activeAccount.keys.activeKey!);
        return status && status.id ? status : null;
    }
}

export const getSwapHistory = async (username: string): Promise<any[]> => {
    try {
        const accountHistory = client.database.getAccountHistory(username, -1, 100);

        const swapHistory = (await accountHistory).filter(entry => {
            const operation = entry[1].op;
            if (operation[0] === 'custom_json' && operation[1].id === 'ssc-mainnet-hive') {
                const payload = JSON.parse(operation[1].json);
                if (payload.contractName === 'market' && payload.contractAction === 'buy') {
                    return true;
                }
            }
            return false;
        });

        // extract relevant information from the swap transactions
        const swapHistoryDetails = swapHistory.map(entry => {
            const operation = entry[1].op;
            const payload = JSON.parse(operation[1].json);
            return {
                timestamp: entry[1].timestamp,
                from: entry[1].op[1].from,
                to: entry[1].op[1].to,
                amount: payload.contractPayload.quantity,
                symbol: payload.contractPayload.symbol,
                memo: payload.contractPayload.memo
            };
        });

        return swapHistoryDetails;
    } catch (error) {
        console.error('Error retreiving swap history : ', error);
        throw error;
    }
}