

export interface User {
    username: string;
    publicKey: string;
    keys: {
        posting: string,
        active: string,
    }
}


export interface Transaction {
    id?: number;
    timestamp: Date;
    type?: TActivity;
    from?: string;
    to?: string;
    amount?: string;
    memo?: string;
    token?: TChains;
}


export interface Amount {
    amount: number;
    coin_symbol: string;
    precision: number;
}

export interface PaymentQR {
    // payee user id
    id: string;
    // payee name
    payeeName: string;
    // transaction id [optional]
    transactionID?: string;
    // amount [optional]
    amount: Amount;
    // tranasction note [optional]
    transactionNode?: string;
}

export type TokenHolding = {
    token: string;
    balance: number;
    marketPrice: string;
}

export interface Account {
    name: string;
    tokenHoldings: TokenHolding[];
    lastTransactions: Transaction[];
}

export type TChains = "Hive" | "Hive Engine";
export type TSymbol = "HBD" | "HIVE" | "HE";
export type TActivity = "swap" | "buy" | "send" | "stake" | "approve";

export interface IToken {
    id?: number;
    chain: TChains;
    symbol: TSymbol;
    icon: any;
    rate?: number;
    priceUSD: number;
    balance?: number;
    status?: "I" | "D";
    defaultSwapChain?: TChains;
}
