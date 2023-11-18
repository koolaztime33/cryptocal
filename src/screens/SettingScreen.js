import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Button, Alert, Appearance } from 'react-native';
 
export const SettingScreen = () => {
  const systemColorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => {
      // Cleanup
      subscription.remove();
    };
  }, []);

  const toggleSwitch = () => {
    setIsDarkMode(previousState => !previousState);
  };

  const clearAllData = async () => {
    // try {
    //     await AsyncStorage.clear();
    //     Alert.alert('Success', 'Data cleared from AsyncStorage.');
    // } catch (error) {
    //     Alert.alert('Error', 'Error clearing data from AsyncStorage.');
    // }
  };

  const confirmClearData = () => {
    // Alert.alert(
    //   "Clear AsyncStorage",
    //   "Are you sure you want to clear all data?",
    //   [
    //     { text: "Cancel", style: "cancel" },
    //     { text: "Yes", onPress: clearAllData }
    //   ]
    // );
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>

      {/* Add Clear All Data Button */}
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Clear All Data</Text>
        <Button title="Clear" onPress={confirmClearData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  settingText: {
    fontSize: 18,
  },
});
