import { LinkingOptions } from "@react-navigation/native";

export const linkingConfig: LinkingOptions<{}> = {
    prefixes: ['yourapp://'], // Change 'yourapp' to your actual app scheme

    config: {
        screens: {
            Root: {
                screens: {
                    HomeTab: {
                        screens: {
                            Home: 'home',
                        },
                    },
                    TradeTab: {
                        screens: {
                            Trade: 'trade',
                        },
                    },
                    ProfileTab: {
                        screens: {
                            Profile: 'profile',
                        },
                    },
                },
            },
            Modal: 'modal',
            Exchange: 'exchange',
            Onboarding: 'onboarding',
            Login: 'login',
            ImportKeys: 'importkeys',
            Home: 'home',
            Send: 'send',
            Receive: 'receive',
            Trade: 'trade',
            Scan: 'scan',
            Profile: 'profile',
            PaymentSuccess: 'paymentSuccess',
        },
    },
};