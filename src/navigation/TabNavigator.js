import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDollarSign, faCog, faHome, faBitcoinSign } from '@fortawesome/free-solid-svg-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingScreen } from '../screens/SettingScreen';
import { CurrencyListScreen } from '../screens/CurrencyListScreen';
import { CryptoListScreen } from '../screens/CryptoListScreen';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = faHome;
                    } else if (route.name === 'Currency') {
                        iconName = faDollarSign;
                    }
                    else if (route.name === 'CryptoListScreen') {
                        iconName = faBitcoinSign;

                    }
                    else if (route.name === 'Setting') {
                        iconName = faCog;
                    }

                    // Return icon component
                    return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: [
                    {
                        "display": "flex"
                    },
                    null
                ]
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Currency" component={CurrencyListScreen} />
            <Tab.Screen name="CryptoListScreen" component={CryptoListScreen} />
            <Tab.Screen name="Setting" component={SettingScreen} />
        </Tab.Navigator>
    );
};
