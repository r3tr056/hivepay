import React from "react";
import {
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from "react-native";

const TouchableText = ({
    style,
    textStyle,
    text,
    onPress,
}: {
    text: string,
    style?: ViewStyle,
    textStyle?: TextStyle,
    onPress?: () => void,
}) => {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
};

export default TouchableText;