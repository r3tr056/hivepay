import { Client, PrivateKey } from '@hiveio/dhive';

const client = new Client('https://api.hive.blog');


async function getAccountBalance({ username }) {
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

async function getTransactions() {
    try {
        const transactions = await client.database.getAccountHistory(this.username, -1, 100);
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

async function calculateAvgSpend() {
    try {
        const transactions = await this.getTransactions();
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

async function transferHive(recipient_username, amount, memo = '') {
    try {
        const senderPrivKey = PrivateKey.fromString(this.privateKey);

        const transfer = {
            from: this.username,
            to: recipient_username,
            amount: `${amount.toFixed(3)} HIVE`,
            memo: memo,
        };

        // boardcast the transfer
        client.broadcast.transfer(transfer, senderPrivKey).then(result => {
            console.log('Included in Block : ' + result.block_num, 'Expired : ' + result.expired);
        });
    } catch (error) {
        console.error(error);
    }
}

async function transferHBD(recipient_username, amount, memo = '') {
    try {
        const senderPrivKey = PrivateKey.fromString(this.privateKey);
        const transfer = {
            from: this.username,
            to: recipient_username,
            amount: `${amount.toFixed(3)} HBD`,
            memo: memo,
        };

        client.broadcast.transfer(transfer, senderPrivKey).then(result => {
            console.log('Included in Block : ' + result.block_num, 'Expired : ' + result.expired);
        });
    } catch (error) {
        console.error(error);
    }
}
