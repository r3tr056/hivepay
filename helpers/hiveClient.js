import { Client } from '@hiveio/dhive';
import * as hiveuri from 'hive-uri';

const CLIENT_OPTIONS = {
    timeout: 3000,
    failOverThreshold: 15,
    consoleOnFailover: true,
}

const EXPIRE_TIME = 1000 * 60;

export const DEFAULT_CHAIN_ID = 'beeab0de00000000000000000000000000000000000000000000000000000000';
let testnet = false;

export const setRpc = async (rpcObj) => {
    let rpc = typeof rpcObj === 'string' ? rpcObj : rpcObj.uri;
    testnet = typeof rpcObj === 'string' ? false : rpcObj.testnet || false;
    client = new Client(rpc);
    hiveTx.config.node = rpc;
    if (typeof rpcObj !== 'string') {
        client.chainId = Buffer.from(rpcObj.chainId || DEFAULT_CHAIN_ID);
        client.chainId.set(Buffer.from(rpcObj.chainId || DEFAULT_CHAIN_ID));
        hiveTx.config.chain_id = rpcObj.chainId || DEFAULT_CHAIN_ID;
    }
};

const DEFAULT_SERVER = [
    'https://rpc.ecency.com',
    'https://api.hive.blog',
    'https://api.deathwing.me',
];

const DEFAULT_TESTNET = [
    'https://testnet.openhive.network',
]

export const TESTNET_CHAIN_ID = '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e';

const client = new Client(DEFAULT_TESTNET, CLIENT_OPTIONS);

const handler = {
    get(target, prop) {
        if (prop === 'updateClient') {
            return address => {
                rawClient = new Client(address, CLIENT_OPTIONS);
            };
        }

        return rawClient[prop];
    },
};

export const getClient = () => client;

export async function resolveTransaction(parsed, signer) {
    const props = await client.database.getDynamicGlobalProperties();

    // resolve the decoded tx and params to a signable tx
    const { tx } = hiveuri.resolveTransaction(parsed.tx, parsed.params, {
        ref_block_num: props.head_block_number & 0xFFFF,
        ref_block_prefix: Buffer.from(props.head_block_id, 'hex').readUInt32LE(4),
        expiration: new Date(Date.now() + EXPIRE_TIME).toISOString().slice(0, -5),
        signers: [signer],
        preferred_signer: signer,
    });

    tx.ref_block_num = parseInt(tx.ref_block_num, 10);
    tx.ref_block_prefix = parseInt(tx.ref_block_prefix, 10);

    return tx;
}

export default client;