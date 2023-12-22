import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  getCryptoActiveState, getTheme,
} from "../data/db"; // adjust the path accordingly

import { getMarketData } from "../data/CryptoData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads";
const TYPE = "crypto";
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});


export const CryptoListScreen = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [activeRows, setActiveRows] = useState({});
  const [theme, setTheme] = React.useState(false);
  const isFocused = useIsFocused()

  useEffect(() => {
    if (loaded) {
      try {
        interstitial.show()
      } catch (error) {
        // when not loaded
      }
    }

  }, [isFocused])

  useEffect(() => {
    fetchCoinGeckoData();
    fetchData();
    getActiveTheme()
  }, []);

  const getActiveTheme = async () => {
    const value = await getTheme();
    setTheme(value)
  }

  const fetchData = async () => {
    try {
      const activeRowsFromSQLite = await getCryptoActiveState();
      setActiveRows(activeRowsFromSQLite);
    } catch (error) {
      console.error("Failed to fetch active rows from SQLite:", error);
    }
  }

  const fetchCoinGeckoData = async () => {
    setLoading(true);
    try {
      const data = await getMarketData();
      setCryptos(data);
    } catch (error) {
      console.error("Error fetching CoinGecko data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    // Filter based on search text
    const results = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(text.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(text.toLowerCase())
    );
    setCryptos(results);
  };

  const toggleActiveState = async (id, isActive) => {
    try {
      if (isActive) {
        AsyncStorage.setItem('activeCryptoRows', JSON.stringify({ ...activeRows, [id]: false }))
      } else {
        AsyncStorage.setItem('activeCryptoRows', JSON.stringify({ ...activeRows, [id]: true }))
      }
      fetchData()
    } catch (error) {
      console.error("Error checking active state:", error);
    }
  };

  const renderRow = ({ item }) => (
    !activeRows[item.id] && <TouchableOpacity
      style={styles.listItem}
      onPress={() => toggleActiveState(item.id, false)}
    >
      <View style={styles.flagContainer}>
        <Image source={{ uri: item.image }} style={styles.flag} />
      </View>
      <Text style={[styles.currencyCode, { color: !theme ? '#333' : '#fff' }]}>{item.symbol.toUpperCase()}</Text>
      <Text style={[styles.currencyName, { color: !theme ? '#333' : '#fff' }]}>{item.name}</Text>
      <View style={styles.addButton}>
        <Text>{activeRows[item.id] ? "✅" : "+"}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRowSave = ({ item }) => (
    activeRows[item.id] && <TouchableOpacity
      style={styles.listItem}
      onPress={() => toggleActiveState(item.id, true)}
    >
      <View style={styles.addButton}>
        <Text> ✅</Text>
      </View>
      <View style={[styles.flagContainer, { marginLeft: 10 }]}>
        <Image source={{ uri: item.image }} style={styles.flag} />
      </View>
      <Text style={[styles.currencyCode, { color: !theme ? '#333' : '#fff' }]}>{item.symbol.toUpperCase()}</Text>
      <Text style={[styles.currencyName, { color: !theme ? '#333' : '#fff' }]}>{item.name}</Text>
      <View style={styles.addButton}>
        <Text>🗑️</Text>
      </View>
    </TouchableOpacity>
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    interstitial.addAdEventListener(AdEventType.ERROR, (val) => {
      console.log('====================================');
      console.log(val);
      console.log('====================================');
    });

    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <View style={[styles.container, { backgroundColor: theme ? '#333' : '#fff' }]}>
      <SafeAreaView />
      <TextInput
        style={styles.searchBar}
        placeholder="Search Cryptocurrency..."
        onChangeText={handleSearch}
        value={searchText}
      />
      <ScrollView>
        <Text style={[styles.headerText, { color: !theme ? '#333' : '#fff' }]}>รายการถูกใจ</Text>
        <View>
          <FlatList
            style={{ marginBottom: 10 }}
            data={cryptos}
            scrollEnabled={false}
            renderItem={renderRowSave}
            keyExtractor={(item) => item.id}
          />
        </View>
        <Text style={[styles.headerText, { color: !theme ? '#333' : '#fff' }]}>รายการ</Text>
        <View style={{ flex: 1 }}>
          <FlatList
            data={cryptos}
            scrollEnabled={false}
            renderItem={renderRow}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  flagContainer: {
    width: 30,
    height: 30,
  },
  flag: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  currencyName: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  addButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 8,
    margin: 10,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
    borderRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
