import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('crypto-cal.db');

export const initDB = () => {
    return new Promise(async (resolve, reject) => {
        const activeRows = await AsyncStorage.getItem('activeRows')
        const activeCryptoRows = await AsyncStorage.getItem('activeCryptoRows')
        const isDarkMode = await AsyncStorage.getItem('isDarkMode')

        if (!activeRows) {
            AsyncStorage.setItem('activeRows', JSON.stringify({}))
        }
        if (!activeCryptoRows) {
            AsyncStorage.setItem('activeCryptoRows', JSON.stringify({}))
        }
        if (!isDarkMode) {
            AsyncStorage.setItem('isDarkMode', JSON.stringify(false))
        }
        resolve(true)
    });
};

export const getActiveFiat = async () => {
    return new Promise(async (resolve, reject) => {
        const value = await AsyncStorage.getItem('activeRows')
        if (value) {
            resolve(JSON.parse(value))
        } else {
            AsyncStorage.setItem('activeRows', JSON.stringify({}))
            resolve({})
        }
    });
};

export const getCryptoActiveState = async () => {
    return new Promise(async (resolve, reject) => {
        const value = await AsyncStorage.getItem('activeCryptoRows')
        if (value) {
            resolve(JSON.parse(value))
        } else {
            AsyncStorage.setItem('activeCryptoRows', JSON.stringify({}))
            resolve({})
        }
    });
};

export const insertCurrency = (id, type) => {
    return new Promise((resolve, reject) => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO acctive_curr (id, type) VALUES (?, ?);',
                    [id, type],
                    (_, result) => {
                        resolve(result);
                    },
                    (_, err) => {
                        reject(err);
                        return true; // This stops the transaction from continuing.
                    }
                );
            });
        } catch (error) {
            console.error(error);
        }
    });
};

export const deleteCurrency = (id, type) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM acctive_curr WHERE id = ? AND type = ?;',
                [id, type],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                    return true; // This stops the transaction from continuing.
                }
            );
        });
    });
};

export const getTheme = () => {
    return new Promise(async (resolve, reject) => {
        const value = await AsyncStorage.getItem('isDarkMode')
        if (value) {
            resolve(JSON.parse(value))
        } else {
            AsyncStorage.setItem('isDarkMode', JSON.stringify(false))
            resolve(false)
        }
    });
}