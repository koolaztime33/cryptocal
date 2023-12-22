import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDollarSign, faCog, faHome, faBitcoinSign } from '@fortawesome/free-solid-svg-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingScreen } from '../screens/SettingScreen';
import { CurrencyListScreen } from '../screens/CurrencyListScreen';
import { CryptoListScreen } from '../screens/CryptoListScreen';
import { getTheme } from '../data/db';
import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const [theme, setTheme] = React.useState(false);

  useEffect(() => {
    getActiveTheme();
  }, []);

    const getActiveTheme = async () => {
        const value = await getTheme();
        setTheme(value)
    }



    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

          if (route.name === "Home") {
            iconName = faHome;
          } else if (route.name === "Currency") {
            iconName = faDollarSign;
          } else if (route.name === "CryptoListScreen") {
            iconName = faBitcoinSign;
          } else if (route.name === "Setting") {
            iconName = faCog;
          }
          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: [
          {
            display: "flex",
            backgroundColor: theme ? "#333" : "#fff",
          },
          null,
        ],
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Currency" component={CurrencyListScreen} />
      <Tab.Screen name="CryptoListScreen" component={CryptoListScreen} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  );
};
