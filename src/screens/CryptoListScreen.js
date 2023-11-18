import React, { useState, useEffect } from 'react';
import {
    FlatList, View, TextInput, TouchableOpacity, ActivityIndicator, Text, Image, StyleSheet,
} from 'react-native';
import { initDB, insertCurrency,checkIsActive, getCryptoActiveState, deleteCurrency } from '../data/db'; // adjust the path accordingly

import { getMarketData } from '../data/CryptoData';
const TYPE = 'crypto';
export const CryptoListScreen = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [activeRows, setActiveRows] = useState({});

    useEffect(() => {
        initDB()
        fetchCoinGeckoData();

        // Fetch active state from SQLite
        (async () => {
            try {
                const activeRowsFromSQLite = await getCryptoActiveState();
                setActiveRows(activeRowsFromSQLite);
            } catch (error) {
                console.error("Failed to fetch active rows from SQLite:", error);
            }
        })();
    }, []);


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

    const handleSearch = text => {
        setSearchText(text);
        // Filter based on search text
        const results = cryptos.filter(crypto =>
            crypto.name.toLowerCase().includes(text.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(text.toLowerCase())
        );
        setCryptos(results);
    };

    const toggleActiveState = async (id, type) => {
        console.log("toggleActiveState", id, type);
        try {
            const isActive = await checkIsActive(id, type);

            if (isActive) {
                deleteCurrency(id, type).then(() => {
                    setActiveRows(prevState => ({ ...prevState, [id]: false }));
                }).catch(err => {
                    console.error("Error deleting currency:", err);
                });
            } else {
                insertCurrency(id, type).then(() => {
                    // Handle successful insert
                    setActiveRows(prevState => ({ ...prevState, [id]: true }));
                }).catch(err => {
                    console.error("Error inserting currency:", err);
                });
            }
        } catch (error) {
            console.error("Error checking active state:", error);
        }
    };


    const renderRow = ({ item }) => (
        <TouchableOpacity style={styles.listItem} onPress={() => toggleActiveState(item.id, TYPE)}>
            <View style={styles.flagContainer}>
                <Image source={{ uri: item.image }} style={styles.flag} />
            </View>
            <Text style={styles.currencyCode}>{item.symbol.toUpperCase()}</Text>
            <Text style={styles.currencyName}>{item.name}</Text>
            <View style={styles.addButton}>
                <Text>{activeRows[item.id] ? '✅' : '+'}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search Cryptocurrency..."
                onChangeText={handleSearch}
                value={searchText}
            />
            <FlatList
                data={cryptos}
                renderItem={renderRow}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    flagContainer: {
        width: 30,
        height: 30,
    },
    flag: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    footer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: "#CED0CE"
    },
    currencyCode: {
        fontSize: 18,
        fontWeight: 'bold',
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 8,
        margin: 10,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        borderRadius: 5,
    },
}); 
