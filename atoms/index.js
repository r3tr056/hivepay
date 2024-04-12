import { atom } from 'recoil';
import { TOKENS } from '../constants/Dummies';

export const TradingTabState = atom({
    key: "tradingTabState",
    default: 0,
});

export const CurrentTokenState = atom({
    key: "currentTokenState",
    default: TOKENS.Bitcoin,
});
