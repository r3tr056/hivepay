import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FONTS, SIZES } from "../constants/Assets";
import COLORS from "../constants/Colors";
import TouchableText from "./TouchableText";

const ModalHeaderRight = ({ text }) => {
    const navigation = useNavigation();

    return (
        <TouchableText
            text={text || "Done"}
            textStyle={{
                fontSize: SIZES.medium,
                fontFamily: FONTS.medium,
                color: COLORS.white,
            }}
            onPress={() => navigation.goBack()}
        />
    );
};

export default ModalHeaderRight;