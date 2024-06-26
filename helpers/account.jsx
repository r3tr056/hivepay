import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

import axios from "axios";
import { createContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { useAuth } from './auth';
import { USERS_COLLECTION } from './config';

export const AccountContext = createContext();

const AccountContext = ({ children }) => {
    const [balance, setBalance] = useState();
    const [transactions, setTransactions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [listData, setListData] = useState([]);
    const [settings, setSettings] = useState({});

    const { user: { username, userId } } = useAuth();

    useEffect(() => {
        const transactionsRef = database().ref('transactions');
        const handleNewTransaction = (shapshot) => {
            const newTx = { incomming: true, ...snapshot.val() };
            setTransactions(prevTransactions => [...prevTransactions, newTx]);
        }

        transactionsRef.orderByChild('to').equalTo(username).on('child_added', handleNewTransaction);

        return () => {
            transactionsRef.off('child_added', handleNewTransaction);
        }
    }, [username]);

    useEffect(() => {
        const notificationsRef = database().ref('notifications');
        const handleNewNotifications = (snapshot) => {
            const newNotif = snapshot.val();
            setNotifications(prevNotifications => [...prevNotifications, newNotif]);
        }

        notificationsRef.orderByChild('to').equalTo(username).on('child_added', handleNewNotifications);

        return () => {
            notificationsRef.off('child_added', handleNewNotifications);
        }
    }, [username]);


    // Function to save user settings under the user document
    const saveUserSettings = async (userUid, settingsData) => {
        try {
            await firestore().collection('users').doc(userUid).set({ settings: settingsData }, { merge: true });
            console.log('User settings saved successfully');
        } catch (error) {
            console.error('Error saving user settings:', error);
            throw error;
        }
    };

    // Function to fetch user settings from the user document
    const fetchUserSettings = async (userUid) => {
        try {
            const userDoc = await firestore().collection(USERS_COLLECTION).doc(userUid).get();
            if (userDoc.exists) {
                return userDoc.data().settings || {};
            } else {
                console.log('User document does not exists');
                return null;
            }
        } catch (error) {
            console.error('Error fetching user settings', error);
            throw error;
        }
    }

    // Function to update user settings under the user document
    const updateUserSettings = async (userUid, updatedSettings) => {
        try {
            await firestore().collection('users').doc(userUid).set({ settings: updatedSettings }, { merge: true });
            console.log('User settings updated successfully');
        } catch (error) {
            console.error('Error updating user settings:', error);
            throw error;
        }
    };

    const getWatchList = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@listdata_key');
            setListData(jsonValue != null ? JSON.parse(jsonValue) : []);
        } catch (error) {
            console.error(error);
        }
    };

    const getUSDBalance = async () => {
        return balance.usd_balance;
    }

    const pushNewTransaction = async ({ to, from, type }) => {
        try {
            var transaction = {
                id: v4(),
                type: type,
                amount: amount,
                token: token,
                date: new Date(),
            }
            await database().ref('transactions').push(transaction);
            console.log('Transaction saved successfully');
        } catch (error) {
            console.error('Error saving transaction : ', error);
            throw error;
        }
    }

    const getTransactions = async () => {
        return transactions;
    }


    const getStoreCoinId = async (coinId) => {
        try {
            const newListData = [...listData, coinId];
            const jsonValue = JSON.stringify(newListData);
            await AsyncStorage.setItem("@listdata_key", jsonValue);
            setListData(newListData);
        } catch (error) {
            console.log(error);
        }
    }

    const removeStoreCoinId = async (coinId) => {
        try {
            const newListData = listData.filter(
                (coinIdValue) => coinIdValue !== coinId
            );

            const jsonValue = JSON.stringify(newListData);
            await AsyncStorage.setItem("@listData_key", jsonValue);
            setListData(newListData);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getWatchList();
    }, []);

    return (
        <AccountContext.Provider value={{ listData, getStoreCoinId, removeStoreCoinId, getTransactions, getUSDBalance, transactions }}>
            {children}
        </AccountContext.Provider>
    )
}

export const getCoinRequest = async (coinId) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        return response.data
    } catch (error) {
        console.log(error);
    }
};


export const getMarketChart = async (coinId) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const getMarketData = async () => {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getWatchListData = async (updatedCoinId) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${updatedCoinId}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
