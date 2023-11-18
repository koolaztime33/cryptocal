import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function CustomCalculatorInput({
  style,
  value,
  onChangeValue,
  unit = "$",
  delimiter = ",",
  separator = ".",
  precision = 2,
  showSoftInputOnFocus = true,
  onFocus,
  onBlur,
  onChangeText,
}) {
  const [displayValue, setDisplayValue] = useState(value);
 console.log("value",value);
  useEffect(() => {
    let rawValue = parseFloat(
      displayValue.replace(new RegExp(`[\\${separator}\\${delimiter}+]`, 'g'), '')
    );

    if (isNaN(rawValue)) {
      setDisplayValue(unit + "0.00");  // or any other default placeholder
    } else {
      if (['+', '-', '*', '/'].some((op) => displayValue.includes(op))) {
        onChangeValue(displayValue);
      } else {
        let formatted = formatDisplayValue(displayValue, unit, delimiter, separator, precision);
        setDisplayValue(formatted);
      }
    }
}, [displayValue, delimiter, separator, precision, unit]);


  const formatDisplayValue = (value, unit, delimiter, separator, precision) => {
    let rawValue = parseFloat(
      value.replace(new RegExp(`[\\${separator}\\${delimiter}+]`, 'g'), '')
    );

    const formatted = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(rawValue);

    if (delimiter && separator) {
      return unit + formatted.replace(new RegExp('\\B(?=(\\d{3})+(?!\\d))', 'g'), delimiter).replace('.', separator);
    } else {
      return unit + formatted;
    }
  };

  return (
    <TextInput
      style={[styles.input, style]}
      value={displayValue}
      onChangeText={(text) => {
        setDisplayValue(text);
        if (onChangeText) {
          onChangeText(text);
        }
      }}
      showSoftInputOnFocus={showSoftInputOnFocus}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    // Style as needed
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
  },
});
