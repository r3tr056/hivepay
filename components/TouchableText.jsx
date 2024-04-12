import React from "react";
import {
    Text,
    TouchableOpacity
} from "react-native";

const TouchableText = ({
    style,
    textStyle,
    text,
    onPress,
}) => {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
};

export default TouchableText;