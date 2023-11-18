import React, { useState, useEffect } from 'react';
import { FlatList, View, TextInput, TouchableOpacity, ActivityIndicator, Text, Image, StyleSheet } from 'react-native';
import countriesData from '../data/currency.json';
import { initDB, insertCurrency, deleteCurrency, getActiveFiat, checkIsActive } from '../data/db';
const ITEMS_PER_PAGE = 20;
const TYPE = 'fiat';



export const CurrencyListScreen = () => {
    const [currencies, setCurrencies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [data, setData] = useState([]);
    const [activeRows, setActiveRows] = useState({});

    useEffect(() => {
        // Define an async function within the useEffect
        const fetchData = async () => {
            // For the sake of demonstration, let's use a placeholder data
            initDB();
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
    
        // Call the async function immediately
        fetchData();
    }, []);
    
    const loadInitialData = () => {
        // Loading initial data from countriesData
        const initialData = countriesData.slice(0, ITEMS_PER_PAGE);
        setCurrencies(initialData);
    };
    const fetchMoreData = () => {
        if (loadingMore) return;

        setLoadingMore(true);

        // Calculate start and end index for slice
        const start = currentPage * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        // Fetch next set of data from countriesData
        const newData = countriesData.slice(start, end);

        setCurrencies(prevData => [...prevData, ...newData]);
        setCurrentPage(currentPage + 1);

        setLoadingMore(false);
    };


    const handleSearch = text => {
        setSearchText(text);
        // Filter allData based on search text
        const results = allData.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase()) ||
            item.currency.code.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(results);
    };

    const toggleActiveState = async (id, type) => {
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
        <TouchableOpacity activeOpacity={0.6} style={styles.listItem} onPress={() => toggleActiveState(item.id, TYPE)}>
            <View style={styles.flagContainer}>
                <Image source={{ uri: item.flag }} style={styles.flag} />
            </View>
            <Text style={styles.currencyCode}>{item.currency.code}</Text>
            <Text style={styles.currencyName}>{item.name}</Text>
            <View style={styles.addButton}>
                <Text>{activeRows[item.id] ? '✅' : '+'}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;

        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search Currency..."
                onChangeText={handleSearch}
                value={searchText}
            />
            <FlatList
                data={filteredData}
                renderItem={renderRow}
                keyExtractor={item => item.id}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.5} // This determines how far from the end of the list the user must be for the "end reached" event to fire. Here, it's set to when the user is halfway through the last item.
                ListFooterComponent={renderFooter}
                initialNumToRender={ITEMS_PER_PAGE} // This ensures the initial render only handles the first set of items.
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
        height: 20,
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
