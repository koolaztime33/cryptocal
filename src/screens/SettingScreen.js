import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Button,
  Alert,
  Appearance,
  Linking,
} from "react-native";
import { getTheme } from "../data/db";
import RNRestart from "react-native-restart";

export const SettingScreen = () => {
  // 'light' or 'dark'
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    getActiveTheme();
  }, []);

  const getActiveTheme = async () => {
    const value = await getTheme();
    setIsDarkMode(value);
  };

  const toggleSwitch = async () => {
    await AsyncStorage.setItem("isDarkMode", JSON.stringify(!isDarkMode));
    getActiveTheme();
    RNRestart.Restart();
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("Success", "Data cleared from AsyncStorage.");
    } catch (error) {
      Alert.alert("Error", "Error clearing data from AsyncStorage.");
    }
  };

  const confirmClearData = () => {
    Alert.alert(
      "Clear AsyncStorage",
      "Are you sure you want to clear all data?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: clearAllData },
      ]
    );
  };

  const confirmopen = () => {
    Linking.openURL("0xairdropfarmer.com/policy");
  };


  const confirmPrivacy = () => {
    Linking.openURL("0xairdropfarmer.com/policy");
  };


  const confirmDisclaimer = () => {
    Linking.openURL("0xairdropfarmer.com/policy");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#333" : "#fff" },
      ]}
    >
      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, { color: !isDarkMode ? "#333" : "#fff" }]}
        >
          Dark Mode
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#000" }}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isDarkMode}
        />
      </View>

      {/* Add Clear All Data Button */}
      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, { color: !isDarkMode ? "#333" : "#fff" }]}
        >
          Clear All Data
        </Text>
        <Button title="Clear" onPress={confirmClearData} />
      </View>

      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, { color: !isDarkMode ? "#333" : "#fff" }]}
        >
          Privacy policy
        </Text>
        <Button title="open" onPress={confirmopen} />
      </View>

      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, { color: !isDarkMode ? "#333" : "#fff" }]}
        >
          Term and conditions
        </Text>
        <Button title="open" onPress={confirmPrivacy} />
      </View>

      <View style={styles.settingRow}>
        <Text
          style={[styles.settingText, { color: !isDarkMode ? "#333" : "#fff" }]}
        >
          Disclaimer
        </Text>
        <Button title="open" onPress={confirmDisclaimer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  settingText: {
    fontSize: 18,
  },
});
