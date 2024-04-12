import { Client } from '@hiveio/dhive';
import * as bodyparser from 'body-parser';
import * as express from 'express';
import admin from 'firebase-admin';

const DEFAULT_APIS = ['https://api.hive.blog'];
const DEFAULT_CHAIN_ID = '';

const client = new Client(DEFAULT_APIS, DEFAULT_CHAIN_ID);

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

main.use(bodyparser.json());
main.use(bodyparser.urlencoded({ extended: false }));
main.use('/api/', app);

app.post('/get-balance', async (req, res) => {
    try {
        const { username, uid } = req.body;
        const account = await client.database.getAccounts([username]);
        const hiveBalance = parseFloat(account[0].balance.split(' ')[0]);
        const hbdBalance = parseFloat(account[0].hbd_balance.split(' ')[0]);
        const newDoc = await db.collection('users').doc(uid).set({
            hiveBalance: 0,
            hbdBalance: 0,
        });
        console.log('Account Balance : ', hiveBalance, 'HIVE');
        console.log('Account Balance : ', hbdBalance, 'HBD');
        return { hiveBalance, hbdBalance };
    } catch (error) {
        console.error(error);
        throw error;
    }
});


app.post()