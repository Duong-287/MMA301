import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreens";
export default function App() {
  return (
    <View style={styles.container}>
      <Text>
        {/* <HomeScreen /> */}
        <RegisterScreen />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
