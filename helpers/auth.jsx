import { PrivateKey } from '@hiveio/dhive';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getRandomValues } from '@react-native-module/get-random-values';
import * as bs58 from 'bs58';
import { createContext, useContext, useEffect, useState } from 'react';
import { decryptToJSON, encryptJSON } from './crypto';
import client, { getClient } from './hiveClient';
import { getAccountBalanceFromHive, getTransactionsFromHive } from './hive_wallet';
import { getFromKeychain, saveOnKeychain } from './keychain';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrData, setQRData] = useState(null);

    const [phonenumber, setPhonenumber] = useState();

    useEffect(() => {

        const initAuth = async () => {
            try {
                let userData = {}
                // Get user authentication info from the keychain
                const encUserdata = await getFromKeychain('account');
                if (encUserdata) {
                    userData = decryptToJSON(encUserdata);
                    // if the `uid`, `keys` are present
                    if (userData && userData.userId && userData.keys) {
                        const fetchedData = fetchUserData(userData.userId);
                        setUser({ uid: userId, ...fetchedData });
                    }
                } else {
                    const usersRef = firestore().collection('users');
                    const unsub = auth().onAuthStateChanged(async (user) => {
                        if (user) {
                            usersRef.doc(user.uid)
                                .get()
                                .then((document) => {
                                    const userData = document.data();
                                    setUser(userData);
                                }).catch((error) => {
                                    console.error(error);
                                });
                        } else {
                            setLoading(false);
                        }
                    });
                    return unsub;
                }
            } catch (error) {
                console.log('Error', error);
                setLoading(false);
            }
        }

        initAuth();
    }, []);


    const saveUserData = (userId, data) => {
        firestore().collection('users').doc(userId).set(data).then((result) => {
            console.log(`User data saved successfully`);
        }).catch((err) => {
            console.error(`Failed to save user data : `, error);
        })
    }

    // NTE : Expor tto the context children
    const signInWithPhoneNumber = async (phoneNumber) => {
        try {
            const confirmationResult = auth().signInWithPhoneNumber(phoneNumber);
            return confirmationResult;
        } catch (error) {
            console.error('Error signing in with phone number:', error);
        }
    }

    const resendOtp = async (phoneNumber) => {
        try {
            const confirmationResult = auth().signInWithPhoneNumber(phoneNumber, true);
            return confirmationResult;
        } catch (error) {
            console.error('Error resending OTP:', error);
        }
    }

    // NOTE : Export to the context children
    const fetchUserData = async (userId) => {
        try {
            const userData = await firestore().collection('users').doc(userId).get();
            if (userData.exists) {
                return userData.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching user data : ', error);
            throw error;
        }
    }

    const signInUser = async (userId) => {
        const existingUserData = await fetchUserData(userId);
        const { username, keys } = existingUserData;
        if (!existingUserData) {
            throw Error('User not found');
        }
        await saveUserDataOnKeychain({ userId, username, keys });
        setUser({ uid: userId, ...existingUserData });
    }

    // NOTE : Export to the context children
    const confirmOtp = async (confirmResult, otp) => {
        try {
            const userCred = await confirmResult.confirm(otp);
            // OTP is confirm, proceed to login
            const userId = userCred.user.uid;
            signInUser(userId);
            return true
        } catch (error) {
            console.error('Error confirming phone number:', error);
            throw error;
        }
    };

    const saveUserDataOnKeychain = async ({ userId, username, keys }) => {
        const account = { userId, username, keys };
        const encryptedAccount = encryptJSON(account);
        //NOTE: save the account on the keychain
        await saveOnKeychain('account', encryptedAccount);
    }

    const getUserData = async (is_new, username, userId, keys, phonenumber, transactions = [], notifications = [], photoURL = null, rc = 0) => {
        if (!is_new) {
            balance = getAccountBalanceFromHive({ username });
            transactions = getTransactionsFromHive({ username });
            const welcomeNotify = {
                'message': 'Welcome to Hive Pay',
            }
            notifications = [welcomeNotify];
        }

        const data = {
            uid: userId,
            username: username,
            keys: keys,
            name: username,
            phonenumber: phonenumber,
            balance: balance,
            photoURL: photoURL,
            resource_credits: 0,
        }
        return data;
    }

    async function validateNewAccount(username, password) {
        try {
            // fetch the account details from the Hive chain
            const account = (await getClient().database.getAccounts([username]))[0];
            if (!account || !account.length) throw new Error('Account not found');

            // Extract the public key from the provided password
            const privKey = PrivateKey.fromString(password);
            const publicKey = privKey.createPublic().toString();
            // check if the provided password is a valid password/privkey;
            if (password.startsWith('STM')) {
                throw new Error('This is a public key! Please enter a private key or master key');
            }
            // validate the public against the account public key
            const accountPublicKeys = account[0].posting.key_auths.map((pair) => pair[0]);
            if (!accountPublicKeys.includes(publicKey)) {
                throw new Error('Invalid private key for the given account');
            }
            console.log('Account validation successful');
            return true;
        } catch (error) {
            console.error('Error validating account', error);
            return false;
        }
    }

    // NOTE : export to the context children
    const signOut = async () => {
        try {
            await auth().signOut();
            // TODO : make a request to set the signed in value to false
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }


    const singinQRCode = async ({ data }) => {
        try {
            if (!data.startsWith('keychain://add_account=')) {
                console.error('Invalid QR Code');
            } else {
                const obj = JSON.parse(data.replace('keychain://add_account=', ''));
                const { username, keys } = obj;
                const { posting, active } = keys;

                if (!username || !posting || !active) {
                    console.error('Missing username or one of the Keys');
                    return;
                }

                let valid = await validateNewAccount(username, active);
                valid = valid && validateNewAccount(username, posting);

                if (valid) {
                    setQRData({ username, keys });

                    console.log('QR Data successfully set');
                } else {
                    throw new Error('Error, Invalid Keys');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const createClaimedAccount = async ({ username, password, is_premium }) => {

        try {
            const ownerKey = PrivateKey.fromLogin(username, password, 'owner');
            const activeKey = PrivateKey.fromLogin(username, password, 'active');
            const postingKey = PrivateKey.fromLogin(username, password, 'posting');
            const memoKey = PrivateKey.fromLogin(username, password, 'memo');

            const creatorStat = await client.database.call('get_accounts', [creator])[0];
            const update_code = process.env.UPDATE_CODE; // Assuming this variable is defined

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

            let ops = [];
            const create_op = [
                'create_claimed_account',
                {
                    creator: creator,
                    new_account_name: username,
                    owner: ownerAuth,
                    active: activeAuth,
                    posting: postingAuth,
                    memo_key: memoKey.createPublic(),
                    json_metadata: JSON.stringify({ profile: { name: username } }),
                    extensions: [],
                },
            ];
            ops.push(create_op);

            // Delegate vesting shares if necessary
            if (parseFloat(update_code) > 0) {
                const delegate_op = [
                    'delegate_vesting_shares',
                    {
                        delegator: creator,
                        delegatee: username,
                        vesting_shares: update_code,
                    },
                ];
                ops.push(delegate_op);
            }

            // Transfer points if user is premium
            if (is_premium) {
                const point_transfer = {
                    id: "hivepay_point_transfer",
                    required_auths: [creator],
                    required_posting_auths: [],
                    json: JSON.stringify({
                        "sender": creator,
                        "receiver": username,
                        "amount": "300.00 POINT",
                        "memo": "Premium bonus",
                    }),
                };
                ops.push(['custom_json', point_transfer]);
            }

            console.log(`Attempting to create account @${username} with creator ${creator}`);
            const result = await client.broadcast.sendOperations(ops, privateKey);

            // Handle success response
            if (result && result.id) {
                // Handle success response
                console.log(`Account @${username} created successfully.`);
                console.log(`Transfering RC Credits`)
                if (is_premium) {
                    const params = {
                        id: "rc",
                        required_auths: [],
                        required_posting_auths: [creator],
                        json: JSON.stringify(["delegate_rc", { "from": creator, "delegatees": [username], "max_rc": 15000000000 }]),
                    };

                    client.boardcast.sendOperations([['custom_json', params]], privateKey).then(
                        function (result) {
                            if (result && result.id) {
                                console.log('RC delegated');
                                return { success: true, message: `Account @${username} created successfully.` };
                            } else {
                                console.log(JSON.stringify(result));
                            }
                        }
                    );
                }
                return { success: true, message: `Account @${username} created successfully.` };

            }
        } catch (error) {
            console.error(`Error occurred while creating account @${username}:`, error);
            // Handle error response
            return { success: false, message: `Error occurred while creating account @${username}. Please try again later.` };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithPhoneNumber, confirmOtp, signOut, resendOtp, qrData, singinQRCode, createClaimedAccount }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

function decodePrivate(encodedKey) {
    const buffer = bs58.decode(encodedKey);
    if (buffer[0] !== 128) throw new Error('Invalid private key');
    return buffer.slice(0, -4);
}

export function privateKeyFrom(password) {
    return new PrivateKey(decodePrivate(password).slice(1));
}



function isKey(username, password) {
    try {
        privateKeyFrom(password);
        return true;
    } catch (e) {
        return false;
    }
}

const getPublicKeyWeight = (pubkey, perms) => {
    for (let n in perms.key_auths) {
        const keyWeight = perms.key_auths[n];
        const lpub = keyWeight['0'];
        if (pubkey === lpub) {
            return keyWeight['1'];
        }
    }
    return 0;
}

function validatePrivKey(account, password, publicKey) {
    let keys;
    if (publicKey === account.memo_key) {
        keys = { memo: password, memoPubkey: publicKey }
        return keys;
    } else if (getPublicKeyWeight(publicKey, account.posting)) {
        keys = { posting: password, postingPubkey: publicKey };
        return keys;
    } else if (getPublicKeyWeight(publicKey, account.active)) {
        keys = { active: password, activePubkey: publicKey };
        return keys;
    } else {
        return null;
    }
}


function isAuthorizedAccount(key) {
    return key.toString().startsWith('@');
}

export const generateMasterKey = () => {
    const array = new Uint32Array(10);
    const arrayrandomised = getRandomValues(array);
    const masterRandomised = 'P' + PrivateKey.fromSeed(arrayrandomised.toString()).toString();
    return masterRandomised;
}

export const validateUsername = (username) => {
    return new RegExp(
        /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z\-](?=[0-9a-z])){2,}([\.](?=[a-z][0-9a-z\-][0-9a-z\-])[a-z]([0-9a-z]|[0-9a-z\-](?=[0-9a-z])){1,}){0,}$/,
    ).test(username);
};
