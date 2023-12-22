import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, Keyboard, TouchableOpacity, Modal, FlatList } from "react-native";
import { ListItem, Avatar, Text } from "react-native-elements";
import styles from "../styles";
import { CalculatorInput } from "react-native-calculator";

export const CurrencyInput = ({
  base,
  countriesData,
  value,
  symbol,
  setValue,
  rates,
  dark
}) => {
  const [childValue, setChildValue] = useState(rates);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(null);
  let ref = useRef();
  let count = useRef(0);
  console.log('====================================');
  console.log(ref);
  console.log(count);
  console.log('====================================');
  const handleClear = () => {
    setChildValue("");
  };

  const handlePress = (buttonPressed) => {
    if (buttonPressed === "=") {
      try {
        const calculatedResult = eval(childValue.replace(/x/g, '*').replace(/÷/g, '/').trim());
        setChildValue(calculatedResult.toString());
        setIsFocused(false)
        ref.current.setSelection()
      } catch (error) {
        console.log(error);
      }
    } else {
      setChildValue((prev) => {
        return prev + buttonPressed
      });
    }
  };




  function calculatePercentDifference(value1, value2) {
    // Ensure both values are numeric
    const numericValue1 = parseFloat(value1);
    const numericValue2 = parseFloat(value2);

    // Check if the conversion is successful
    if (isNaN(numericValue1) || isNaN(numericValue2)) {
      return null;
    }

    // Calculate the percentage difference 0.5 / 1 * 100
    const percentDifference = (numericValue2 / numericValue1) * 100;

    return percentDifference / 100;
  }

  useEffect(() => {
    if (rates != childValue) {
      if (calculatePercentDifference(base, childValue)) {
        try {
          setValue(calculatePercentDifference(base, childValue), symbol);
        } catch (error) {

        }
      }
    }
  }, [childValue]);

  useEffect(() => {
    if (!isFocused) {
      setChildValue(rates);
    }
  }, [rates]);

  return (
    <View style={{ backgroundColor: '#ff0000' }}>
      <Modal visible={isFocused} transparent>
        <View style={{ backgroundColor: '#fff', position: 'absolute', width: '100%', bottom: 0 }}>
          <FlatList
            numColumns={4}
            data={['AC', '+/-', '%', '', '7', '8', '9', '÷', '4', '5', '6', 'x', '1', '2', '3', '-', '00', '0', '.', '+', 'AC', '=', '▼']}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.button}
                onPress={
                  item === "AC"
                    ? handleClear
                    : item === "▼"
                      ? () => {
                        ref.current.setSelection();
                        setIsFocused(false);
                      }
                      : () => handlePress(item)
                }
              >
                <Text style={styles.text}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      <View style={[styles.currencyContainer]}>
        {countriesData.flag ? (
          <View bottomDivider style={{ backgroundColor: '#ff0000' }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: 70,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: dark ? "#333" : "#fff",
                paddingHorizontal: 10,
              }}
            >
              <Avatar source={{ uri: countriesData.flag }} />
              <View style={{ marginLeft: 5, width: "20%" }}>
                <ListItem.Content>
                  <ListItem.Title style={{ color: dark ? '#fff' : '#000' }}>
                    {countriesData.currency.code}
                  </ListItem.Title>
                  <ListItem.Subtitle style={{ color: dark ? '#fff' : '#000' }}>{countriesData.name}</ListItem.Subtitle>
                </ListItem.Content>
              </View>
              <TextInput
                ref={value => {
                  count.current = count.current + 1
                  ref.current = value
                }}
                style={[styles.input, { color: dark ? '#fff' : '#000' }]}
                value={isFocused ? childValue : parseFloat(childValue)?.toFixed(2)}
                defaultValue={isFocused ? childValue : parseFloat(childValue)?.toFixed(2)}
                onChangeText={(text) => setChildValue(text)}
                showSoftInputOnFocus={false} // Disabling the native keyboard
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
          </View>
        ) : countriesData.image ? (
          <ListItem bottomDivider>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                height: 50,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Avatar source={{ uri: countriesData.image }} />
              <View style={{ marginLeft: 5, width: "20%" }}>
                <ListItem.Content>
                  <ListItem.Title>{countriesData.symbol}</ListItem.Title>
                  <ListItem.Subtitle>{countriesData.name}</ListItem.Subtitle>
                </ListItem.Content>
              </View>
              <TextInput
                style={styles.input}
                value={parseFloat(childValue)?.toFixed(2)}
                defaultValue={parseFloat(childValue)?.toFixed(2)}
                onChangeText={(text) => setChildValue(text)}
                showSoftInputOnFocus={false} // Disabling the native keyboard
                keyboardType="numeric"

              />
            </View>
          </ListItem>
        ) : null}
      </View>
      {keyboardVisible && (
        <View style={styles.keyboardContainer}>
          {[
            ["7", "8", "9", "+"],
            ["4", "5", "6", "-"],
            ["1", "2", "3", "x"],
            ["00", "0", ".", "÷"],
            ["AC", "=", "▼"],
          ].map((row, idx) => (
            <View key={idx} style={styles.row}>
              {row.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.button}
                  onPress={
                    val === "AC"
                      ? handleClear
                      : val === "▼"
                        ? Keyboard.dismiss
                        : () => handlePress(val)
                  }
                >
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
