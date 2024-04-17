import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ModalHeaderRight from '../components/ModalHeaderRight';
import TradingModalHeader from '../components/TradingModalHeader';
import { SHADOWS } from '../constants/Assets';
import Colors from '../constants/Colors';
import Home from '../screens/Home';
import ImportKeys from '../screens/ImportKeys';
import LoginScreen from '../screens/Login';
import Onboarding from '../screens/Onboarding';
import PaymentSuceess from '../screens/PaymentSuccess';
import Profile from '../screens/Profile';
import Receive from '../screens/Receive';
import { Scan } from '../screens/Scan';
import Send from '../screens/Send';
import Trade from '../screens/Trade';
import { linkingConfig } from './LinkingConfig';

export type RootTabParamsList = {
    HomeTab: undefined;
    TradeTab: undefined;
    ProfileTab: undefined;
    Exchange: undefined;
    Modal: undefined;
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Screen>;

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamsList> | undefined;
    Home: undefined;
    Login: undefined;
    Onboarding: undefined;
    Modal: undefined;
    Trade: undefined;
    Request: undefined;
    Scan: undefined;
    Send: { username: string, amount: string, memo: string };
    Receive: { amount: string, memo: string };
    ImportKeys: undefined;
    PaymentSuccess: { status: string };
}

export default function Navigation() {
    return (
        <NavigationContainer linking={linkingConfig}>
            <RootNavigator />
        </NavigationContainer>
    );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const ROUTES = {
    Onboarding: 'Onboarding',
    Login: 'Login',
    ImportKeys: 'ImportKey',
    Home: 'Home',
    Send: 'Send',
    Receive: 'Receive',
    Trade: 'Trade',
    Scan: 'Scan',
    Profile: 'Profile',
    PaymentSuccess: 'PaymentSuccess',
}

const RootNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Onboarding'} screenOptions={{ headerShown: false }} >
            <Stack.Screen name={"Root"} component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name={'Onboarding'} component={Onboarding} options={{ headerShown: false }} />
            <Stack.Screen name={'Login'} component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ImportKeys'} component={ImportKeys} options={{ headerShown: false }} />
            <Stack.Screen name={'PaymentSuccess'} component={PaymentSuceess} options={{ headerShown: false }} />
            <Stack.Group screenOptions={{ headerShown: true, presentation: 'modal', header: () => <TradingModalHeader /> }} >
                <Stack.Screen name={'Trade'} component={Trade} options={{ headerShown: false }} />
            </Stack.Group>
            <Stack.Group screenOptions={{ headerShown: true, presentation: 'modal', headerStyle: styles.headerStyle, headerTitleStyle: { color: Colors.white }, header: () => <ModalHeaderRight /> }} >
                <Stack.Screen name={'Scan'} component={Scan} />
                <Stack.Screen name={'Send'} component={Send} />
                <Stack.Screen name={'Receive'} component={Receive} />
            </Stack.Group>

        </Stack.Navigator>
    );
}

const BottomTab = createBottomTabNavigator<RootTabParamsList>();

const BottomTabNavigator = () => {
    return (
        <BottomTab.Navigator initialRouteName={'HomeTab'} screenOptions={{ tabBarActiveTintColor: Colors.tint }}>
            <BottomTab.Screen name={"HomeTab"} component={Home} options={() => ({
                title: "Home",
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
            })} />
            <BottomTab.Screen name={'TradeTab'} component={Home} options={({ navigation }) => ({
                title: "Trade",
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: () => (
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.Trade)} style={{
                        top: -20,
                        height: 70,
                        width: 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 50,
                        backgroundColor: Colors.primary,
                        ...SHADOWS.shadow8
                    }}>
                        <Ionicons name='analytics' size={20} color={Colors.secondary} style={{
                            borderWidth: 2,
                            padding: 5,
                            borderColor: Colors.secondary,
                            borderRadius: 8,
                        }}
                        />
                    </TouchableOpacity>
                ),
            })} />
            <BottomTab.Screen name={'ProfileTab'} component={Profile} options={{
                title: "Profile",
                tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
            }} />
        </BottomTab.Navigator>
    )
}


function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
}) {
    return (
        <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
    );
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: Colors.primary,
    }
})