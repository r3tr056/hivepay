
const Wallet = require("../assets/images/wallet.png");
const Hbd = require("../assets/images/hbd.png");
const Hive = require("../assets/images/hive.png");

export const IMAGES = {
    Wallet,
    Hbd,
    Hive
};

const elevationNone = {
    shadowColor: "#000",
    shadowOffset: {
        height: 4,
        width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
};

export const SHADOWS = {
    shadow8: {
        ...elevationNone,
        elevation: 8,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            height: 0,
            width: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        elevation: 4,
    },
    elevation0: {
        ...elevationNone,
    },
};

export const SIZES = {
    p50: 50,
    p40: 40,
    p30: 30,
    p20: 20,
    p15: 15,
    p6: 6,
    base: 8,
    small: 12,
    font: 14,
    medium: 16,
    large: 18,
    extraLarge: 24,
    half: "50%",
    full: "100%",
};

export const FONTS = {
    light: "IBMPlexSansLight",
    regular: "IBMPlexSansRegular",
    medium: "IBMPlexSansMedium",
    semibold: "IBMPlexSansSemiBold",
    bold: "IBMPlexSansBold",
    monoLight: "IBMPlexMonoLight",
    monoRegular: "IBMPlexMonoRegular",
    monoMedium: "IBMPlexMonoMedium",
    monoBold: "IBMPlexMonoBold",
};

export const Opacity = {
    opacity2: "rgba(0,0,0, 0.2)",
};
