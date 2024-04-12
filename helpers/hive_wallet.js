import { PrivateKey } from '@hiveio/dhive';
import firestore from '@react-native-firebase/firestore';
import { getClient } from './hiveClient';

async function updateTransactionInFirestore({ result, from_username, to_username, memo }) {
    try {
        const transactionRef = firestore().collection('transactions');
        transact
        const transactionData = {
            from: from_username,
            to: to_username,
            memo: memo,
            id: result.id,
            block_num: result.block_num,
            expired: result.expired || false,
        };

        await transactionRef.doc(result.id).set(transactionData, { merge: true });
    } catch (error) {

    }
}

export async function getAccountBalance({ username }) {
    try {
        const account = await client.database.getAccounts([this.username]);
        const hiveBalance = parseFloat(account[0].balance.split(' ')[0]);
        const hbdBalance = parseFloat(account[0].hbd_balance.split(' ')[0]);
        console.log('Account Balance : ', hiveBalance, 'HIVE');
        console.log('Account Balance : ', hbdBalance, 'HBD');
        return { hiveBalance, hbdBalance };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getTransactions({ username }) {
    try {
        const transactions = await getClient().database.getAccountHistory(username, -1, 100);
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

export async function calculateAvgSpend({ username }) {
    try {
        const transactions = await getTransactions(username)
        let totalSpend = 0;
        let count = 0;
        transactions.forEach(transaction => {
            if (transaction[1].op[0] === 'transfer' && transaction[1].op[1].to === this.username) {
                totalSpend += parseFloat(transaction[1].op[1].amount.split(' ')[0]);
                count++;
            }
        });

        if (count == 0) return 0;
        return totalSpend / count;
    } catch (error) {
        console.error('Error calculating average spend:', error);
        throw error;
    }
}

export async function transferHive(username, privKey, recipient_username, amount, memo = '') {
    try {
        const client = getClient();
        const senderPrivKey = PrivateKey.fromString(privKey);

        const transfer = {
            from: username,
            to: recipient_username,
            amount: `${amount.toFixed(3)} HIVE`,
            memo: memo,
        };

        // boardcast the transfer
        client.broadcast.transfer(transfer, senderPrivKey).then(result => {
            console.log('Included in Block : ' + result.block_num, 'Expired : ' + result.expired);
            if (result.block_num) {
                return { success: true, block_num: result.block_num, id: result.id }
            } else {
                return { success: false, block_num: null, id: result.id }
            }
        });
    } catch (error) {
        console.error(error);
        return { success: false, block_num: null, id: null }
    }
}

export async function transferHBD(recipient_username, amount, memo = '') {
    try {
        const senderPrivKey = PrivateKey.fromString(this.privateKey);
        const transfer = {
            from: this.username,
            to: recipient_username,
            amount: `${amount.toFixed(3)} HBD`,
            memo: memo,
        };

        getClient().broadcast.transfer(transfer, senderPrivKey).then(result => {
            console.log('Included in Block : ' + result.block_num, 'Expired : ' + result.expired);
            if (result.block_num) {
                return { success: true, block_num: result.block_num, id: result.id }
            } else {
                return { success: false, block_num: null, id: result.id }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export const generateReceiveQRCode = (username, amount, memo) => {
    const qrObj = {
        recp_uname: username,
        recp_amount: amount,
        memo: memo
    }
    const qrStr = JSON.stringify(qrObj);
    return qrStr
}
