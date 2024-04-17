import { useIsFocused } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "react-native";

const AppSatusBar = (props: any) => {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
};

export default AppSatusBar;