import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";

const AppSatusBar = (props) => {
    const isFocused = useIsFocused();
    return isFocused ? <StatusBar {...props} /> : null;
};

export default AppSatusBar;