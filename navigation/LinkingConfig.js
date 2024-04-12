import * as Linking from "expo-linking";


const linking = {
    prefixes: [Linking.makeUrl("/")],
    config: {
        screens: {
            Root: {
                screens: {
                    HomeTab: {
                        screens: {
                            Home: "home",
                            Send: "send",
                        },
                    },
                    TradeTab: {
                        screens: {
                            Trade: "trade",
                            Exchange: "exchange",
                        },
                    },
                    ProfileTab: {
                        screens: {
                            Profile: "profile",
                        },
                    },
                },
            },
            Onboarding: "Onboarding",
            Modal: "modal",
        },
    },
};

export default linking;