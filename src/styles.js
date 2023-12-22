import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: "flex-start", // Change this to start
  },
  header: {
    height: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    color: "#333",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#888",
  },

  keyboardContainer: {
    paddingHorizontal: 10,

    paddingBottom: 20,
    justifyContent: "flex-end",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    margin: 5,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
  // ...existing styles
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  flagImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  countryName: { fontSize: 16, fontWeight: "bold" },
  currencyCode: { fontSize: 14 },
  currencyName: { fontSize: 14 },
  currencySymbol: { fontSize: 14 },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    // paddingVertical: 20, // Increase vertical spacing
  },
  flagContainer: {
    width: 40, // Increase width
    height: 30, // Increase height
    marginRight: 15, // Add more spacing
  },
  flag: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  currencyCode: {
    fontSize: 18, // Increase font size
    fontWeight: "bold",
    marginRight: 5, // Add spacing between code and symbol
  },
  currencyName: {
    fontSize: 14, // Reduce font size
  },
  input: {
    fontSize: 21, // Increase font size
    fontWeight: "bold",
    color: "grey",
    width: "70%",
    textAlign: "right", // Right align the text,
  },
});

export default styles;
