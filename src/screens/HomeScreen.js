import React, { useState, useEffect } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  ScrollView,
} from "react-native";
import { initDB, getActiveFiat, getCryptoActiveState, getTheme } from "../data/db";
import countriesData from "../data/currency.json";
import { CurrencyInput } from "../components/CurrencyInput";
import { fetchCryptoDataFromCoinGecko } from "../components/CryptoData";
import styles from "../styles";
import { AdEventType, BannerAd, InterstitialAd, TestIds, BannerAdSize } from "react-native-google-mobile-ads";

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const adUnitBannerId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});


export const HomeScreen = () => {
  const isFocused = useIsFocused();
  const [inputs, setInputs] = useState("");
  const [activeCurrencies, setActiveCurrencies] = useState({}); // for storing the active currency data
  const [listHome, setListHome] = useState([]); // for storing the active currency data
  const [listCurrency, setListCurrency] = useState([]);
  const [listPrevCurrency, setPrevListCurrency] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);
  const [prevCryptoData, setPrevCryptoData] = useState([]);
  const [activeCryptos, setActiveCryptos] = useState({});
  const [theme, setTheme] = React.useState(false);

  useEffect(() => {
    getActiveTheme()
  }, [])

  const getActiveTheme = async () => {
    const value = await getTheme();
    setTheme(value)
  }

  useEffect(() => {
    initDB();
    getCurrency();
    if (isFocused) {
      if (loaded) {
        try {
          interstitial.show()
        } catch (error) {
          // when not loaded
        }
      }
      (async () => {
        try {
          const activeFiatFromSQLite = await getActiveFiat();
          const CryptoActiveState = await getCryptoActiveState(); // Implement this function
          const activeCryptoSymbols = Object.keys(CryptoActiveState).filter(
            (crypto) => CryptoActiveState[crypto]
          );
          const dataFromCoinGecko = await fetchCryptoDataFromCoinGecko(
            activeCryptoSymbols
          );
          setCryptoData(
            dataFromCoinGecko.map((item) => {
              return {
                ...item,
                current_price: (1 / item.current_price).toString(),
              };
            })
          );
          setPrevCryptoData(
            dataFromCoinGecko.map((item) => {
              return {
                ...item,
                current_price: (1 / item.current_price).toString(),
              };
            })
          );
          setActiveCurrencies(activeFiatFromSQLite);
          setActiveCryptos(CryptoActiveState);
        } catch (error) {
          console.error("Failed to fetch active data from SQLite:", error);
        }
      })();
    }
  }, [isFocused]);

  const getCurrency = async () => {
    if (listCurrency.length == 0) {
      const currencyData = await fetch(
        "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=5e0aba36695f4eccaf0c441420ed5cbd"
      );
      const currencyDataJson = await currencyData.json();
      const currencyRates = currencyDataJson.rates;
      const currencyList = Object.keys(currencyRates).map((key) => {
        return {
          currency: key,
          rate: currencyRates[key],
        };
      });
      setListCurrency(currencyList);
      setPrevListCurrency(currencyList);
    }
  };

  useEffect(() => {
    getActiveData();
  }, [activeCurrencies, activeCryptos]);

  // This function will merge the symbol and current_price from cryptoDataList into rateData.
  const mergeCryptoDataIntoRates = (cryptoDataList, item, listCurrency) => {
    if (
      listCurrency.find((currency) => currency.currency === item.currency?.code)
    ) {
      return listCurrency.find(
        (currency) => currency.currency === item.currency?.code
      ).rate;
    }
    if (cryptoDataList.find((items) => items.symbol == item.symbol)) {
      return cryptoDataList
        .find((items) => items.symbol == item.symbol)
        .current_price?.toString();
    }
    return "0";
  };

  const checlSymbol = (cryptoDataList, item, listCurrency) => {
    if (
      listCurrency.find((currency) => currency.currency === item.currency?.code)
    ) {
      return listCurrency.find(
        (currency) => currency.currency === item.currency?.code
      ).currency;
    }
    if (cryptoDataList.find((items) => items.symbol == item.symbol)) {
      return cryptoDataList.find((items) => items.symbol == item.symbol).symbol;
    }
    return "usd";
  };

  const getActiveData = () => {
    const fiatData = Object.entries(activeCurrencies)
      .filter(([, isActive]) => isActive)
      .map(([id]) => countriesData.find((c) => c.id === parseInt(id)))
      .filter(Boolean);
    const cryptoDataList = Object.entries(activeCryptos)
      .filter(([, isActive]) => isActive)
      .map(([id]) => cryptoData.find((c) => c.id === id))
      .filter(Boolean);
    setListHome([...fiatData, ...cryptoDataList]);
  };

  const handleInputChange = (discount, symbol) => {
    const currencyList = listCurrency.map((item) => {
      const prevData = listPrevCurrency.find(
        (currency) => currency.currency === item.currency
      );
      const results = prevData.rate * discount;
      // console.log(results);
      return {
        ...item,
        rate: results.toString(),
      };
    });
    setCryptoData((val) => {
      const newData = val.map((item) => {
        if (item.symbol === symbol) return item;

        const prevData = prevCryptoData.find((crypto) => crypto.id === item.id);
        const results = prevData.current_price * discount;
        return {
          ...item,
          current_price: results,
        };
      });
      return newData;
    });

    setListCurrency(currencyList);
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
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: theme ? '#333' : '#fff' }}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme ? '#333' : '#fff' }]}>
          <View style={styles.content}>
            <FlatList
              refreshing={isRefreshing}
              data={listHome}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <CurrencyInput
                    base={mergeCryptoDataIntoRates(
                      prevCryptoData,
                      item,
                      listPrevCurrency
                    )}
                    dark={theme}
                    countriesData={item}
                    value={inputs ? inputs.toString() : "0"}
                    setValue={handleInputChange}
                    symbol={checlSymbol(prevCryptoData, item, listPrevCurrency)}
                    rates={mergeCryptoDataIntoRates(
                      cryptoData,
                      item,
                      listCurrency
                    )}
                  />
                );
              }}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 0 }}>
        <BannerAd unitId={adUnitBannerId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    </View>
  );
};
