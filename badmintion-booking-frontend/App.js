import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SportsBookingApp from "./screens/common/HomeScreen";
import OwnerCourt from "./screens/owner/CourtScheduleScreen";
import OwnerEditCourt from "./screens/owner/EditCourtScreen";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import * as Linking from "expo-linking";

const linking = {
  prefixes: ["badmintonapp://"],
  config: {
    screens: {
      ResetPassword: "reset_password/:token",
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
