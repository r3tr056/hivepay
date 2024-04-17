import { PrivateKey } from '@hiveio/dhive';
import { Transaction } from '../types';
import { getClient } from './hiveClient';

const client = getClient();

export async function getAccountBalanceFromHive(username: string): Promise<{ hiveBalance: string, hbdBalance: string }> {
    try {
        const account = await client.database.getAccounts([username]);
        const hiveBalance = account[0].balance.toString().split('')[0]
        const hbdBalance = account[0].hbd_balance.toString().split(' ')[0]
        console.log('Account Balance : ', hiveBalance, 'HIVE');
        console.log('Account Balance : ', hbdBalance, 'HBD');
        return { hiveBalance, hbdBalance };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getTransactionHistory(username: string): Promise<Transaction[]> {
    try {
        const accountHistory = await getClient().database.getAccountHistory(username, -1, 100);
        const transactionHistory = accountHistory.map(entry => {

            const operation = entry[1].op;
            const timestamp = new Date(entry[1].timestamp + 'Z');
            const type = operation[0];

            // initialize transaction detail object
            const transactionDetail: Transaction = {
                timestamp,
            };

            switch (type) {
                case 'transfer':
                    transactionDetail['from'] = operation[1].from;
                    transactionDetail['to'] = operation[1].to;
                    transactionDetail['amount'] = operation[1].amount;
                    transactionDetail['memo'] = operation[1].memo;
                    transactionDetail['type'] = operation[1].type;
                    break;

                default:
                    break;
            }
            return transactionDetail;
        });

        return transactionHistory;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

export async function transferHive(
    username: string,
    privKey: string,
    recipient_username: string,
    amount: string,
    memo: string = '',
    type: string = 'send',
): Promise<{ success: boolean, blockNum: number | null, id: string | null }> {
    try {
        const client = getClient();
        const senderPrivKey = PrivateKey.fromString(privKey);

        const metadata = { type: type, processor: 'hivepay' }

        const transfer = {
            from: username,
            to: recipient_username,
            amount: `${amount} HIVE`,
            memo: memo,
            extensions: [[0, {
                beneficiaries: [],
                json: JSON.stringify(metadata),
            }]]
        };

        // boardcast the transfer
        const status = await client.broadcast.transfer(transfer, senderPrivKey);
        if (status && status.block_num) {
            console.log('Included in Block : ' + status.block_num, 'Expired : ' + status.expired);
            return { success: true, blockNum: status.block_num, id: status.id };
        } else {
            return { success: false, blockNum: null, id: status.id }
        }
    } catch (error) {
        console.error(error);
        return { success: false, blockNum: null, id: null }
    }
}

export async function transferHBD(senderUsername: string, privKey: string, recpUsername: string, amount: string, memo: string = ''): Promise<{ success: boolean, blockNum: number | null, id: string | null }> {
    try {
        const senderPrivKey = PrivateKey.fromString(privKey);
        const transfer = {
            from: senderUsername,
            to: recpUsername,
            amount: `${amount} HBD`,
            memo: memo,
        };

        const status = await client.broadcast.transfer(transfer, senderPrivKey);
        if (status && status.block_num) {
            console.log('Included in Block : ' + status.block_num, 'Expired : ' + status.expired);
            return { success: true, blockNum: status.block_num, id: status.id }
        } else {
            return { success: false, blockNum: null, id: status.id }
        }
    } catch (error) {
        console.error(error);
        return { success: false, blockNum: null, id: null }
    }
}
