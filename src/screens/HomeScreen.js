import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, FlatList, TouchableWithoutFeedback, SafeAreaView, Keyboard } from 'react-native';
import { initDB, getActiveFiat, getCryptoActiveState } from '../data/db';
import countriesData from '../data/currency.json';
import { CurrencyInput } from '../components/CurrencyInput';
import { fetchCryptoDataFromCoinGecko } from '../components/CryptoData';
import styles from '../styles';
export const HomeScreen = () => {
    const isFocused = useIsFocused();
    const [inputs, setInputs] = useState({});
    const [activeCurrencies, setActiveCurrencies] = useState({}); // for storing the active currency data
    const [rateData, setRateData] = useState({}); // for storing the active currency data

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [cryptoData, setCryptoData] = useState([]);
    const [activeCryptos, setActiveCryptos] = useState({});
    useEffect(() => {
        initDB(); 
        if (isFocused) {
            // handleRefresh();

            (async () => {
                try {
                    const activeFiatFromSQLite = await getActiveFiat();
                    const CryptoActiveState = await getCryptoActiveState(); // Implement this function

                    const activeCryptoSymbols = Object.keys(CryptoActiveState).filter(crypto => CryptoActiveState[crypto]);

                    const dataFromCoinGecko = await fetchCryptoDataFromCoinGecko(activeCryptoSymbols);
                  
                    setCryptoData(dataFromCoinGecko);
                    setActiveCurrencies(activeFiatFromSQLite);
                    setActiveCryptos(CryptoActiveState);

                } catch (error) {
                    console.error("Failed to fetch active data from SQLite:", error);
                }
            })();
        }
    }, [isFocused]);
  // useEffect(() => {
        // const newRateData = mergeCryptoDataIntoRates(cryptoData, rateData);
        // setRateData(newRateData);
      // }, [cryptoData, rateData]);
    
    // This function will merge the symbol and current_price from cryptoDataList into rateData.
    const mergeCryptoDataIntoRates = (cryptoDataList, rateData) => {
        // Create a new rateData structure to not mutate the original one
        let updatedRateData = { ...rateData };
        // Loop over the cryptoDataList
        cryptoDataList.forEach(crypto => {
            // We assume that the currency code in rateData matches the crypto symbol converted to uppercase.
            let currencyCode = crypto.symbol.toUpperCase();

            // Check if the currency code exists in the rateData
            if (updatedRateData.data[currencyCode]) {
                // Merge the symbol and current_price into the rateData
                updatedRateData.data[currencyCode] = {
                    ...updatedRateData.data[currencyCode], // Keep the original rate data
                    symbol: crypto.symbol, // Add the symbol from cryptoDataList
                    current_price: crypto.current_price // Add the current_price from cryptoDataList
                };
            }
        });

        return updatedRateData;
    };

    const getActiveData = () => {
        const fiatData = Object.entries(activeCurrencies)
            .filter(([, isActive]) => isActive)
            .map(([id]) => countriesData.find(c => c.id === parseInt(id)))
            .filter(Boolean);
        const cryptoDataList = Object.entries(activeCryptos)
            .filter(([, isActive]) => isActive)
            .map(([id]) => cryptoData.find(c => c.id === id))
            .filter(Boolean);
        // const newRateData = mergeCryptoDataIntoRates(cryptoDataList, rateData);
        // setRateData(newRateData);
        return [...fiatData, ...cryptoDataList];
    };



    // const handleRefresh = () => {
    //     setIsRefreshing(true);

    //     getActiveData()
    //     setIsRefreshing(false);

    // };
    const handleInputChange = (inputKey, newValue) => {
        // Assuming inputKey is the currency code for which newValue is being set
        const baseValue = parseFloat(newValue) || 0;
        // Update the state with the new value for the inputKey
        setInputs(prevValues => ({
            ...prevValues,
            [inputKey]: baseValue.toString(),
        }));

        // Now, convert and update values for all other currencies
        const newValues = {};
        Object.keys(inputs).forEach((currencyKey) => {
            if (currencyKey !== inputKey) {
                const convertedValue = convertCurrency(baseValue, inputKey, currencyKey);
                newValues[currencyKey] = convertedValue.toString();
            }
        });

        // Update the inputs state with values for all currencies
        setInputs(prevValues => ({
            ...prevValues,
            ...newValues
        }));
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Crypto Calculator</Text>
                </View>
                <View style={styles.content}>
                    <FlatList
                        refreshing={isRefreshing} 
                        data={getActiveData()}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <CurrencyInput
                                countriesData={item}
                                value={inputs ? inputs.toString() : '0'}
                                setValue={handleInputChange}
                                rates={rateData}
                            />
                        )}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};
