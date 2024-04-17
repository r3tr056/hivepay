import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { convertTokenToDollars } from '../components/WalletTokens';
import { Account, TokenHolding, Transaction } from '../types';
import { getClient, getSSCClient } from './hiveClient';
import { getTransactionHistory } from './hive_wallet';
import { TrieNode, UserAccount } from './search';

const client = getClient();
const ssClient = getSSCClient();


// Define the shape of your AuthContext
interface AccountContextType {
    account: Account | null;
    updateLastTransactions: (transactions: Transaction[]) => void,
    getTransactions: (username: string) => Promise<Transaction[]>;
    getSettings: () => Promise<void>;
}

// Create a context with initial values
const AccountContext = createContext<AccountContextType>({
    account: {
        name: '',
        lastTransactions: [],
        tokenHoldings: [],
    },
    updateLastTransactions: () => { },
    getTransactions: async (username: string) => [],
    getSettings: async () => { },
});

// Create a provider component to wrap your app with
export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [account, setAccount] = useState<Account | null>(null);
    let trieRoot: TrieNode | null = null;

    useEffect(() => {
        // fetch data from API
        async function fetchInitialData() {
            try {
                // fetch transactions
                const transactionsResponse = await fetch('https://api.example.com/transactions');
                const transactionsData = await transactionsResponse.json();
                updateLastTransactions(transactionsData);

            } catch (error) {
                console.error(error);
            }
        }

        fetchInitialData();
    }, []);

    const updateLastTransactions = (transactionsData: Transaction[]) => {

    }

    const getTokenHoldings = async (username: string): Promise<TokenHolding[]> => {
        try {
            const account = await client.database.getAccounts([username]);
            if (!account || account.length == 0) {
                throw new Error('Account not found');
            }

            const tokenHoldings: TokenHolding[] = [];
            const hiveBalance = account[0].balance;
            const hbdBalance = account[0].hbd_balance;
            const hiveMarketPrice = await convertTokenToDollars(1, 'HIVE');
            const hbdMarketPrice = await convertTokenToDollars(1, 'HBD');

            tokenHoldings.push(
                { token: 'HIVE', balance: parseFloat(hiveBalance.toString()), marketPrice: hiveMarketPrice },
                { token: 'HBD', balance: parseFloat(hbdBalance.toString()), marketPrice: hbdMarketPrice }
            );

            // fetch smart contracts from the hive engine
            const tokens = await ssClient.find('tokens', 'balances', { account: username });
            for (const token of tokens) {
                // get the market price of the tokens
                const tokenMarketPrice = await convertTokenToDollars(1, token.symbol);
                tokenHoldings.push({ token: token.symbol, balance: parseFloat(token.balance), marketPrice: tokenMarketPrice });
            }

            return tokenHoldings;
        } catch (error) {
            console.log('Error fetching account info : ', error);
            return [];
        }
    }

    const getTransactions = async (username: string): Promise<Transaction[]> => {
        try {
            const cachedTransactions = await AsyncStorage.getItem(`${username}_transaction_history`);
            let cachedTransactionsHistory: Transaction[] = [];
            // parse the cached transactions if they exist
            if (cachedTransactions) {
                cachedTransactionsHistory = JSON.parse(cachedTransactions)
            }

            // fetch the latest transaction history from the blockchain
            const latestTransactionHistory = await getTransactionHistory(username);
            // merge the cached transaction history with the latest transaction history
            const mergedTransactionHistory = [...cachedTransactionsHistory, ...latestTransactionHistory].filter((transaction, index, self) => {
                index === self.findIndex(t => t.timestamp === transaction.timestamp && t.type == transaction.type);
            })

            // Store the merged transaction history in AsyncStorage
            await AsyncStorage.setItem(`${username}_transaction_history`, JSON.stringify(mergedTransactionHistory));

            return mergedTransactionHistory
        } catch (error) {
            console.error('Error fetching transaction history', error)
            throw error;
        }
    }

    const getCreatedAccounts = async (creator: string, platformID: string): Promise<UserAccount[]> => {
        try {
            const cachedAcounts = await AsyncStorage.getItem(`${creator}_${platformID}_accounts`)
            let cachedUserAccounts: UserAccount[] = [];
            if (cachedAcounts) {
                cachedUserAccounts = JSON.parse(cachedAcounts);
            }

            const accounts = await client.database.getAccounts([creator]);
            const filteredAccounts = accounts.filter((account) => {
                try {
                    const jsonMetadata = JSON.parse(account.json_metadata);
                    return jsonMetadata.creator === creator && jsonMetadata.platformID === platformID;
                } catch (error) {
                    console.error('Error parsing JSON metadata for account: ', account.name, error);
                    return false;
                }
            });
            const userAccounts = filteredAccounts.map(account => { return { username: account.name } as UserAccount });
            // Store the fetched account names in AsyncStorage
            await AsyncStorage.setItem(`${creator}_${platformID}_accounts`, JSON.stringify(userAccounts));

            if (cachedUserAccounts.length == 0) {
                return userAccounts;
            } else {
                const mergedAccounts = [...userAccounts, ...cachedUserAccounts];
                const uniqueAccounts = Array.from(new Set(mergedAccounts.map(account => account.username))).map(username => mergedAccounts.find(account => account.username === username)) as UserAccount[];

                return uniqueAccounts;
            }
        } catch (error) {
            console.error('Error fetching created accounts : ', error);
            throw error;
        }
    }

    const getSettings = async () => {
    }

    return (
        <AccountContext.Provider value={{ account, getTransactions, getSettings, updateLastTransactions }}>
            {children}
        </AccountContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAccount = () => useContext(AccountContext);
