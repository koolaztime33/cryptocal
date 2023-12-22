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
  SafeAreaView,
} from "react-native";
import countriesData from "../data/currency.json";
import {
  getActiveFiat, getTheme,
} from "../data/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads";
const ITEMS_PER_PAGE = 20;
const TYPE = "fiat";
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

export const CurrencyListScreen = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
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
    // Call the async function immediately
    fetchData();
    getActiveTheme()
  }, []);

  const getActiveTheme = async () => {
    const value = await getTheme();
    setTheme(value)
  }

  const fetchData = async () => {
    setData(countriesData);
    setAllData(countriesData);
    setFilteredData(countriesData);
    loadInitialData();

    // Load active state from local storage
    try {
      const activeFiat = await getActiveFiat();
      setActiveRows(activeFiat || {});
      console.log(activeRows);
    } catch (error) {
      console.error("Failed to fetch active fiat currencies:", error);
    }
  };

  const loadInitialData = () => {
    const initialData = countriesData
    setCurrencies(initialData);
  };

  const fetchMoreData = () => {
    // if (loadingMore) return;

    // setLoadingMore(true);

    // const start = currentPage * ITEMS_PER_PAGE;
    // const end = start + ITEMS_PER_PAGE;

    // const newData = countriesData.slice(start, end);

    // setCurrencies((prevData) => [...prevData, ...newData]);
    // setCurrentPage(currentPage + 1);

    // setLoadingMore(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const results = allData.filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.currency.code.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(results);
  };

  const toggleActiveState = async (id, isActive) => {
    try {
      if (isActive) {
        AsyncStorage.setItem('activeRows', JSON.stringify({ ...activeRows, [id]: false }))
      } else {
        AsyncStorage.setItem('activeRows', JSON.stringify({ ...activeRows, [id]: true }))
      }
      fetchData()
    } catch (error) {
      console.error("Error checking active state:", error);
    }
  };

  const renderRow = ({ item }) => (
    !activeRows[item.id] && <TouchableOpacity
      activeOpacity={0.6}
      style={styles.listItem}
      onPress={() => toggleActiveState(item.id, false)}
    >
      <View style={styles.flagContainer}>
        <Image source={{ uri: item.flag }} style={styles.flag} />
      </View>
      <Text style={[styles.currencyCode, { color: !theme ? '#333' : '#fff' }]}>{item.currency.code}</Text>
      <Text style={[styles.currencyName, { color: !theme ? '#333' : '#fff' }]}>{item.name}</Text>
      <View style={styles.addButton}>
        <Text>{activeRows[item.id] ? "✅" : "+"}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRowSave = ({ item }) => {
    return activeRows[item.id] && <View>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.listItem}
        onPress={() => toggleActiveState(item.id, true)}
      >
        <View style={styles.addButton}>
          <Text> ✅</Text>
        </View>
        <View style={[styles.flagContainer, { marginLeft: 8 }]}>
          <Image source={{ uri: item.flag }} style={styles.flag} />
        </View>
        <Text style={[styles.currencyCode, { color: !theme ? '#333' : '#fff' }]}>{item.currency.code}</Text>
        <Text style={[styles.currencyName, { color: !theme ? '#333' : '#fff' }]}>{item.name}</Text>
        <View style={styles.addButton}>
          <Text>🗑️</Text>
        </View>
      </TouchableOpacity>
    </View>
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

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

  return (
    <View style={[styles.container, { backgroundColor: theme ? '#333' : '#fff' }]}>
      <SafeAreaView />
      <TextInput
        style={styles.searchBar}
        placeholder="Search Currency..."
        onChangeText={handleSearch}
        value={searchText}
      />
      <ScrollView>
        <Text style={[styles.headerText, { color: !theme ? '#333' : '#fff' }]}>รายการถูกใจ</Text>
        <View>
          <FlatList
            style={{ marginBottom: 10 }}
            data={filteredData}
            scrollEnabled={false}
            renderItem={renderRowSave}
            keyExtractor={(item) => item.id}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.5} // This determines how far from the end of the list the user must be for the "end reached" event to fire. Here, it's set to when the user is halfway through the last item.
            ListFooterComponent={renderFooter}
            initialNumToRender={ITEMS_PER_PAGE} // This ensures the initial render only handles the first set of items.
          />
        </View>
        <Text style={[styles.headerText, { color: !theme ? '#333' : '#fff' }]}>รายการ</Text>
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredData}
            scrollEnabled={false}
            renderItem={renderRow}
            keyExtractor={(item) => item.id}
            onEndReached={fetchMoreData}
            onEndReachedThreshold={0.5} // This determines how far from the end of the list the user must be for the "end reached" event to fire. Here, it's set to when the user is halfway through the last item.
            ListFooterComponent={renderFooter}
            initialNumToRender={ITEMS_PER_PAGE} // This ensures the initial render only handles the first set of items.
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
    height: 20,
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
