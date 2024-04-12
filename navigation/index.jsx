import { DrawerContentScrollView, DrawerItem, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Linking } from "react-native";
import AccountDetailsScreen from '../screens/AccountScreen';
import LoginScreen from '../screens/Login';
import Receive from "../screens/Receive";
import { Scan } from '../screens/Scan';
import SecurityScreen from '../screens/SecurityScreen';
import Send from "../screens/Send";
import SignUp from '../screens/SignUp';
import Trade from "../screens/Trade";
import LinkingConfig from './LinkingConfig';

const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {
    const handleLinkClick = (url) => {
        Linking.openURL(url);
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label="Support" onPress={() => handleLinkClick('https://hivepay.com/support')} />
            <DrawerItem label="Resources" onPress={() => handleLinkClick('https://hivepay.com/resources')} />
        </DrawerContentScrollView>
    )
}

export default function DrawerNavigation() {
    return (
        <Drawer.Navigator initialRouteName='Home' drawerContent={props => <CustomDrawerContent {...props} />}>
            {/* Account, Security & Privary,TODO : Support, Resources */}
            <Drawer.Screen name="Account" component={AccountDetailsScreen} options={{
                drawerLabel: 'Account'
            }} />
            <Drawer.Screen name="Security" component={SecurityScreen} options={{
                drawerLabel: 'Security & Privary'
            }} />
        </Drawer.Navigator>
    )
}

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
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" compoent={LoginScreen} />
            <Stack.Screen name="Signup" component={SignUp} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Scan" component={Scan} />


            <Stack.Screen name="Send" component={Send} />
            <Stack.Screen name="Receive" component={Receive} />
            <Stack.Screen name="Trade" component={Trade} />

        </Stack.Navigator>
    );
}
