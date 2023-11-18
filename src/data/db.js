import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('crypto-cal.db');

export const initDB = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS acctive_curr (id TEXT PRIMARY KEY NOT NULL, type TEXT NOT NULL);',
                [],
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
export const checkIsActive = (id, type) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM acctive_curr WHERE id = ? AND type = ?;',
                [id, type],
                (_, resultSet) => {
                    if (resultSet.rows._array.length > 0) {
                        resolve(true);  // The currency is active
                    } else {
                        resolve(false);  // The currency is not active
                    }
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
};

export const getActiveFiat = async () => {

    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM acctive_curr WHERE type='fiat'", [], (_, results) => {

                if (results && results.rows.length > 0) {
                    let rows = results.rows._array;
                    let newState = {};
                    rows.forEach(row => {
                        newState[row.id] = true;
                    });
                    resolve(newState);
                } else {
                    resolve({}); // Return an empty object if no results found
                }
            }, (transaction, error) => {
                reject(error); // Handle potential errors from the SQL query
            });
        });
    });
};
export const getCryptoActiveState = async () => {

    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM acctive_curr WHERE type='crypto'", [], (_, results) => {

                if (results && results.rows.length > 0) {
                    let rows = results.rows._array;
                    let newState = {};
                    rows.forEach(row => {
                        newState[row.id] = true;
                    });
                    resolve(newState);
                } else {
                    resolve({}); // Return an empty object if no results found
                }
            }, (transaction, error) => {
                reject(error); // Handle potential errors from the SQL query
            });
        });
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
