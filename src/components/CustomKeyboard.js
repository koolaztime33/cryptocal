import React,{useState} from 'react';
import { Text, View, Keyboard, TouchableOpacity } from 'react-native';
import styles from '../styles';

export const CustomKeyboard = ({ input, setInput }) => {
    const [currentValue, setCurrentValue] = useState('');
    const [lastOperation, setLastOperation] = useState(null);

    const handlePress = (val) => {
        if (val === 'AC') {
            // Clear everything
            setCurrentValue('');
            setLastOperation(null);
            setInput('');
        } else if (val === '▼') {
            Keyboard.dismiss();
        } else if (['+', '-', 'x', '÷'].includes(val)) {
            if (currentValue !== '' && lastOperation === null) {
                setCurrentValue(currentValue + val);
                setLastOperation(val);
            }
        } else if (val === '=') {
            if (lastOperation !== null) {
                computeResult();
            }
        } else {
            // Append the value
            setCurrentValue(currentValue + val);
        }
    };

    const computeResult = () => {
        let result = currentValue.replace(/x/g, '*').replace(/÷/g, '/');
        try {
            // Evaluate the result
            result = eval(result); // For simplicity, though eval() is dangerous and shouldn't be used in production
            setCurrentValue(result.toString());
            setInput(result.toString()); // Assuming this sets the result in the parent component
        } catch (error) {
            setCurrentValue('Error');
            setInput('Error');
        }
        setLastOperation(null);
    };


    const safeEval = (str) => {
        // Implement a safe evaluate function or use a library like math.js
        // This is a placeholder and should be replaced with actual safe logic
        return Function('"use strict";return (' + str + ')')();
    };

    const handleClear = () => {
        setInput('');
    };

    return (
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
    );
};
