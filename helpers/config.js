
export const USERS_COLLECTION = 'users';
export const TRANSACTIONS_COLLECTION = 'transactions';

export const hiveEngine = {
    CHAIN_ID: 'ssc-mainnet-hive',
};

export const CLIENT_OPTIONS = {
    timeout: 3000,
    failOverThreshold: 15,
    consoleOnFailover: true,
}

export const rpcList = [
    DEFAULT_RPC,
    { uri: 'https://api.deathwing.me', testnet: false },
    { uri: 'https://api.openhive.network', testnet: false },
    { uri: 'https://anyx.io', testnet: false },
    { uri: 'https://api.pharesim.me', testnet: false },
    { uri: 'https://hived.emre.sh', testnet: false },
    { uri: 'https://rpc.ausbit.dev', testnet: false },
    { uri: 'https://rpc.ecency.com', testnet: false },
    { uri: 'https://techcoderx.com', testnet: false },
    { uri: 'https://hive-api.arcange.eu', testnet: false },
    {
        uri: 'https://testnet.openhive.network',
        testnet: true,
        chainId: '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e',
    },
];

export const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCPPCL9vWVHCeyTc7Q3zO-LH5YuwV9Zb8A",
    authDomain: "hivepay-c3366.firebaseapp.com",
    projectId: "hivepay-c3366",
    storageBucket: "hivepay-c3366.appspot.com",
    messagingSenderId: "975572027150",
    appId: "1:975572027150:web:796084372324d7f6df795f"
};