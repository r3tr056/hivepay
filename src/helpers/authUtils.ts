import { Operation, PrivateKey } from "@hiveio/dhive";
import { CREATOR_PRIV_KEYS, CREATOR_USERNAMES, getClient } from "./hiveClient";

const client = getClient();

export async function validateNewAccount(username: string, activeKey: string, postingKey: string): Promise<boolean> {
    try {
        // check if the provided password is a valid password/privkey;
        if (activeKey.startsWith('STM') && postingKey.startsWith('STM')) {
            throw new Error('This is a public key! Please enter a private key or master key');
        }

        // check if the account exists
        const accounts = await client.database.getAccounts([username]);
        if (!accounts) throw new Error('No Accounts found!');

        // password -> private key -> public key > for verification
        const postingPrivKey = PrivateKey.fromString(postingKey);
        const postingPublicKey = postingPrivKey.createPublic().toString();

        const activePrivKey = PrivateKey.fromString(activeKey);
        const activePublicKey = activePrivKey.createPublic().toString();

        // validate the public against the account public key
        const accountActivePublicKeys = accounts[0].active.key_auths.map((pair) => pair[0]);
        if (!accountActivePublicKeys.includes(activePublicKey)) {
            throw new Error('Invalid private key for the given account');
        }

        // validate the public posting key against the account posting public key
        const accountPostingPublicKeys = accounts[0].posting.key_auths.map((pair) => pair[0]);
        if (!accountPostingPublicKeys.includes(postingPublicKey)) {
            throw new Error('Invalid private key for the given account');
        }

        console.log('Account validation successful');
        return true;

    } catch (error) {
        console.error('Error validating account', error);
        return false;
    }
}

export async function checkHivePayAccountExists(username: string): Promise<boolean> {
    return false;
}


export async function createDiscountedAccount(
    username: string,
    password: string,
): Promise<any> {

    const accountExists = await checkHivePayAccountExists(username);
    if (!accountExists) {
        let ind = -1;
        let creator = '';
        let creatorPKey = '';

        // privat key of creator account, 1 - Owner, 2 - Active, 3 - Posting, 4 - Memo
        const ownerKey = PrivateKey.fromLogin(username, password, 'owner');
        const activeKey = PrivateKey.fromLogin(username, password, 'active');
        const postingKey = PrivateKey.fromLogin(username, password, 'posting');
        const memoKey = PrivateKey.fromLogin(username, password, 'memo');

        const creatorStat = (await client.database.call('get_accounts', [CREATOR_USERNAMES]));
        for (let index = 0; index < creatorStat.length; index++) {
            const element = creatorStat[index];
            if (element.pending_claimed_accounts > 0) {
                ind = index;
                break;
            }
        }

        if (ind !== -1) {
            creator = CREATOR_USERNAMES[ind];
            creatorPKey = CREATOR_PRIV_KEYS[ind];

            const ownerAuth = {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [[ownerKey.createPublic(), 1]],
            };
            const activeAuth = {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [[activeKey.createPublic(), 1]],
            };
            const postingAuth = {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [[postingKey.createPublic(), 1]],
            };

            const privateKey = PrivateKey.fromString(creatorPKey);
            let ops = [];

            // create operation to transmit
            const create_op = [
                'create_claimed_account',
                {
                    creator: creator,
                    new_account_name: username,
                    owner: ownerAuth,
                    active: activeAuth,
                    posting: postingAuth,
                    memo_key: memoKey.createPublic(),
                    json_metadata: JSON.stringify({ username: username, created_at: new Date().toJSON(), version: '0.0.1', benfit: 'discounted', creator: creator, platformId: 'hivepay' }),
                    extensions: [],
                },
            ] as Operation;

            ops.push(create_op);
            console.log(`Attempting to create account @${username} with creator ${creator}`);

            try {
                let result = await client.broadcast.sendOperations(ops, privateKey);
                if (result && result.id) {
                    return { success: true, username: username }
                }
            } catch (error) {
                console.error('Error creating account', error);
                return { success: false, username: null }
            }
        } else {
            throw Error('No available accounts in creator directory');
        }
    } else {
        throw Error('Account already exists!');
    }
}

interface KeychainQRData {
    username: string;
    keys: {
        posting: string;
        active: string;
    }
}

export async function importKeyChainQRCode(data: any): Promise<KeychainQRData> {
    try {
        if (!data.startsWith('keychain://add_account=')) {
            throw new Error('Invalid QR Code');
        } else {
            const obj = JSON.parse(data.replace('keychain://add_account=', ''));
            const { username, keys } = obj;
            const { posting, active } = keys;

            if (!username || !posting || !active) {
                throw new Error('Invalid QR Code Data!');
            }
            if (await validateNewAccount(username, active, posting)) {
                console.log('QR Data successfully read!');
                return { username, keys: { posting, active } };
            } else {
                throw new Error('Error, Invalid Keys');
            }
        }
    } catch (error) {
        throw new Error(`Error reading QR code : ${error}`);
    }
}