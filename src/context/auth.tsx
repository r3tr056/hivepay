import { PrivateKey } from '@hiveio/dhive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState } from 'react';
import { importKeyChainQRCode } from '../helpers/authUtils';
import { getFromKeychain, saveOnKeychain } from '../helpers/keychain';
import { User } from '../types';


interface AuthContextType {
    user: User | null;
    signUp: (username: string, password: string) => Promise<void>;
    importKeys: (data: any) => Promise<boolean>;
    getReceiveQRCode: (amount: string, memo: string) => string;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signUp: async (username: string, password: string) => { },
    importKeys: async (data: any) => false,
    getReceiveQRCode: (amount: string, memo: string) => '',
    signIn: async () => { },
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [qrData, setQRData] = useState<any>(null);

    const signOut = async (): Promise<void> => {
        setUser(null);
    }

    const getReceiveQRCode = (amount: string, memo: string) => {
        const qrObj = {
            recp_uname: user?.username,
            recp_amount: amount,
            memo: memo
        }
        const qrStr = JSON.stringify(qrObj);
        const qrCodeAction = `hivepay://account=${qrStr}`;
        return qrCodeAction
    }


    const importKeys = async (qrdata: any): Promise<boolean> => {
        try {
            const { username, keys: { posting, active } } = await importKeyChainQRCode(qrdata);
            if (username && posting && active) {
                const keysString = JSON.stringify({ posting, active });
                const publicKey = PrivateKey.fromString(active.toString()).createPublic().toString();
                // save the user, hence login
                setUser({ username, publicKey, keys: { active, posting } });
                saveOnKeychain('privKey', keysString);
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Failed to import Keys : ${error}`);
        }
    }

    async function signIn(): Promise<void> {
        try {
            const savedUsername = await AsyncStorage.getItem('username');
            const storedPrivateKey = await getFromKeychain('privKey');
            const { active, posting } = JSON.parse(storedPrivateKey!);
            const publicKey = PrivateKey.fromString(active.toString()).createPublic().toString();
            if (savedUsername && active && posting) {
                // save the user hence login
                setUser({ username: savedUsername, publicKey, keys: { active, posting } });
                return;
            } else {
                throw new Error('No User Credential Saved on Device');
            }
        } catch (error) {
            throw new Error(`Error logging in : ${error}`);
        }
    }

    const signUp = async (): Promise<void> => {
        // TODO : Not now
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, signUp, importKeys, getReceiveQRCode }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);






