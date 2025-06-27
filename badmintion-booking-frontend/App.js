import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./screens/common/HomeScreen";
import ProfileScreen from "./screens/common/ProfileScreen";
import BookingScreen from "./screens/customer/BookingScreen";
import LoginScreen from "./screens/common/LoginScreen";

// import RegisterScreen from "./screens/common/RegisterScreens";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.container}>
          {/* <HomeScreen /> */}
          {/* <ProfileScreen /> */}
          <BookingScreen />
          {/* <LoginScreen /> */}
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
