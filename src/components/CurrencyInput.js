import React, { useState } from 'react';
import { View, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { ListItem, Avatar, Text } from 'react-native-elements';
import styles from '../styles';
export const CurrencyInput = ({ countriesData, value, setValue,rates }) => {
    const [childValue, setChildValue] = useState(value);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [lastOperation, setLastOperation] = useState(null);

    const handleFocus = () => {
        setKeyboardVisible(true);
    };

    const handleBlur = () => {
        setKeyboardVisible(false);
    };
    const handleValueChange = newValue => {
        // Ensure that we update the parent's state with the new value
        if (!['+', '-', 'x', '÷'].includes(newValue.slice(-1))) {
            setValue(countriesData.id, newValue);
        }
        setChildValue(newValue);

        // If we're changing the amount, convert and update the values for all other currencies
        if (!isNaN(newValue)) {
            // You would get the base currency and the target currency keys from props or state
            const newConvertedValue = convertCurrency(
                newValue,
                countriesData.currencyCode, // This should be the base currency code
                targetCurrencyCode, // You will need to pass this as a prop or manage it as a state
            );
            setValue(targetCurrencyCode, newConvertedValue.toString());
        }
    };
    const handlePress = (val) => {
        if (val === 'AC') {
            // Clear everything
            setChildValue('');
            setLastOperation(null);
        } else if (val === '▼') {
            Keyboard.dismiss();
        } else if (['+', '-', 'x', '÷'].includes(val)) {
            if (childValue !== '' && lastOperation === null) {
                setChildValue(childValue + val);
                setLastOperation(val);
            }
        } else if (val === '=') {
            if (lastOperation !== null) {
                computeResult();
            }
        } else {
            // Append the value
            setChildValue(childValue + val);
        }
    };
    const handleClear = () => {
        setChildValue(''); // Clear the child value
        setLastOperation(null); // Reset the last operation
        setValue(countriesData.id, ''); // Update parent's state
    };
    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    const computeResult = () => {
        let result = childValue.replace(/x/g, '*').replace(/÷/g, '/');

        // Check for division by zero
        if (/\/0(?![.0-9])/.test(result)) {
            setChildValue('Error: Division by zero');
            return;
        }

        try {
            result = eval(result); // Ideally, replace with a safer evaluation method
            // Define the number of decimals for rounding
            const decimals = 2; // for example, 2 decimal places
            result = round(result, decimals);

            setChildValue(result.toString());
            setValue(countriesData.id, result.toString());
        } catch (error) {
            setChildValue('Error');
        }

        setLastOperation(null);
    };
    const convertCurrency = (amount, baseCurrency, targetCurrency) => {
        if (!amount || !baseCurrency || !targetCurrency || !rateData) return 0;
//  console.log(amount, baseCurrency, targetCurrency, rateData)
        // Assuming rateData has a structure where you can access rates like rateData[baseCurrency]
        const baseRate = rateData[baseCurrency]?.value || 1; // Fallback to 1 if not found
        const targetRate = rateData[targetCurrency]?.value || 0; // Fallback to 0 if not found

        // Convert the base amount to USD, then to the target currency
        const amountInUSD = amount / baseRate;
        const convertedAmount = amountInUSD * targetRate;

        return convertedAmount;
    };
    return (
        <View>
            <View style={styles.currencyContainer}>
                {countriesData.flag ? (
                    <ListItem bottomDivider>
                        <Avatar source={{ uri: countriesData.flag }} />
                        <ListItem.Content>
                            <ListItem.Title>{countriesData.currency.symbol}</ListItem.Title>
                            <ListItem.Subtitle>{countriesData.name}</ListItem.Subtitle>
                        </ListItem.Content>
                        <TextInput
                            style={styles.input}
                            value={childValue}
                            onChangeText={text => handleValueChange(text)}
                            showSoftInputOnFocus={false} // Disabling the native keyboard
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </ListItem>
                ) : countriesData.image ? (
                    <ListItem bottomDivider>
                        <Avatar source={{ uri: countriesData.image }} />
                        <ListItem.Content>
                            <ListItem.Title>{countriesData.symbol}</ListItem.Title>
                            <ListItem.Subtitle>{countriesData.name}</ListItem.Subtitle>
                        </ListItem.Content>
                        <TextInput
                            style={styles.input}
                            value={childValue}
                            onChangeText={text => handleValueChange(text)}
                            showSoftInputOnFocus={false} // Disabling the native keyboard
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </ListItem>
                ) : null}


            </View>
            {keyboardVisible && (
                <View style={styles.keyboardContainer}>
                    {[
                        ['7', '8', '9', '+'],
                        ['4', '5', '6', '-'],
                        ['1', '2', '3', 'x'],
                        ['00', '0', '.', '÷'],
                        ['AC', '=', '▼']
                    ].map((row, idx) => (
                        <View key={idx} style={styles.row}>
                            {row.map(val => (
                                <TouchableOpacity
                                    key={val}
                                    style={styles.button}
                                    onPress={
                                        val === 'AC' ? handleClear :
                                            val === '▼' ? Keyboard.dismiss :
                                                () => handlePress(val)
                                    }>
                                    <Text style={styles.text}>{val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}; 