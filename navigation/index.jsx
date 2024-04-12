import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import Vector from "../assets/vectors";
import ModalHeaderRight from "../components/ModalHeaderRight";
import TradingModalHeader from '../components/TradingModalHeader';
import Colors, { COLOR_SCHEME } from "../constants/Colors";
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Receive from "../screens/Receive";
import Send from "../screens/Send";
import Trade from "../screens/Trade";
import styles from '../styles';
import LinkingConfig from './LinkingConfig';

export default function Navigation({ colorScheme }) {

    return (
        <NavigationContainer
            linking={LinkingConfig}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
            <Stack.Group screenOptions={{ presentation: 'modal', headerShown: true, header: () => <TradingModalHeader />, }}>
                <Stack.Screen name="Trade" component={Trade} />
            </Stack.Group>
            <Stack.Group
                screenOptions={{
                    presentation: 'modal',
                    headerShown: true,
                    headerRight: () => <ModalHeaderRight />,
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: { color: Colors.white },
                }}>
                <Stack.Screen name="Send" component={Send} />
                <Stack.Screen name="Receive" component={Receive} />
            </Stack.Group>

        </Stack.Navigator>
    );
}

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const colorScheme = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                tabBarActiveTintColor: COLOR_SCHEME[colorScheme].tint,
            }}
        >
            <BottomTab.Screen
                name="HomeTab"
                component={Home}
                options={() => ({
                    title: "Home",
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                })}
            />
            <BottomTab.Screen
                name="TradeTab"
                component={Home}
                options={({ navigation }) => ({
                    title: "Trade",
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Trade")}
                            style={{
                                top: -20,
                                height: 70,
                                width: 70,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 50,
                                backgroundColor: Colors.primary,
                                ...SHADOWS.shadow8,
                            }}
                        >
                            <Vector
                                name="exchange"
                                size={20}
                                color={Colors.secondary}
                                style={{
                                    borderWidth: 2,
                                    padding: 5,
                                    borderColor: Colors.secondary,
                                    borderRadius: 8,
                                }}
                            />
                        </TouchableOpacity>
                    ),
                })}
            />
            <BottomTab.Screen name="ProfileTab" component={Profile} options={{
                title: "Profile",
                tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />
            }}
            />
        </BottomTab.Navigator>
    );
};

function TabBarIcon(props) {
    return (
        <Vector as="feather" size={30} style={{ marginBottom: -3 }} {...props} />
    )
}