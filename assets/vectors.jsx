import {
    Feather,
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";

const Vector = ({
    size,
    style,
    name,
    color,
    as,
    onPress,
}) => {
    const props = {
        name,
        size,
        style,
        color,
        onPress,
    };

    if (as === "feather") {
        return <Feather {...props} />;
    }
    if (as === "ionicons") {
        return <Ionicons {...props} />;
    }

    if (as === "materialCI") {
        return (
            <MaterialCommunityIcons
                name={name}
                size={size}
                color={color}
                onPress={onPress}
            />
        );
    }
    return <FontAwesome {...props} />;
};

export default Vector;