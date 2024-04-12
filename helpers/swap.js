import { Client } from "@hiveio/dhive";
import firestore from "@react-native-firebase/firestore";
import { hiveEngine, TRANSACTIONS_COLLECTION, USERS_COLLECTION } from "./config";
import { sanitizeAmount, sanitizeUsername } from "./utils";

const client = new Client([]);

// NOTE : Processes Hive-Engine Tokens, off chain tokens
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

const updateSwapTransaction = async (uid, estimateId, updateSwapData) => {
    try {
        /*  // Swap schema
       {
           amount: 100,
           received: 100,
           estimateId: '123456',
           expectedAmountAfterFee: 100,
           status: 'pending',
           transferInitiated: false,
       }
   */
        const swap_history_ref = firestore().collection(USERS_COLLECTION).doc(uid).collection(TRANSACTIONS_COLLECTION).where()
        const swap_history_snapshot = await swap_history_ref.get();
        if (swap_history_snapshot.empty) {
            return false;
        }

        const swap_history_doc = swap_history_snapshot.docs[0];
        const swaps = swap_history_doc.data().swaps;

        const swapIndex = swaps.findIndex(swap => swap.estimateId === estimateId);
        if (swapIndex === -1) {
            return false;
        }

        swaps[swapIndex] = { ...swaps[swapIndex], ...updateSwapData };
        await swap_history_ref.update({ swaps });

        return result;
    } catch (error) {
        console.error(error);
    }
}

// NOTE : Process a Swap Operation
export const processSwap = async (estimateId, startToken, amount, activeAccount, swapAccount) => {
    let swapData = {};
    if (startToken === 'HBD' || startToken === 'HIVE') {
        try {
            const status = await client.broadcast.transfer({
                from: activeAccount.name,
                to: sanitizeUsername(swapAccount),
                amount: sanitizeAmount(amount, startToken),
                memo: estimateId,
            });

            client.database.getTransaction
            swapData = {
                amount: sanitizeAmount(amount, startToken),
                received: null,
                estimateId: estimateId,
                process_block_num: status.block_num,
                expectedAmountAfterFee: null,
                status: status.id && status.block_num ? 'completed' : 'pending',
                transferInitiated: false,
            }
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
        swapData = {
            to: sanitizeUsername(swapAccount),
            symbol: startToken,
            amount: sanitizeAmount(`${amount.toFixed(tokenInfo.precision)}`),
            received: null,
            estimateId: status.id,
            process_block_num: status.block_num,
            expectedAmountAfterFee: null,
            status: status.id && status.block_num ? 'completed' : 'pending',
            transferInitiated: false,
        }
    }

    if (swapData) {

    }
}

export const getSwapHistory = async (username) => {
    // TODO : Use firebase to get history
    const swap_history_ref = firestore().collection('swap_history').where('username', '==', username);
    const swap_history_snapshot = await swap_history_ref.get();

    if (swap_history_snapshot.empty) {
        return []
    }

    const swaps = [];
    swap_history_snapshot.forEach(doc => {
        const s = doc.data();
        if (s.status === "pending" && !s.transferInitiated) return;
        swaps.push({
            ...s,
            amount: withCommas(Number(s.amount).toString(), 3),
            received: s.received && withCommas(Number(s.received).toString(), 3),
            finalAmount: withCommas(Number(s.received ?? s.expectedAmountAfterFee).toString(), 3),
        });
    });

    return swaps;
}