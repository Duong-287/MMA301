import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SportsBookingApp from "./screens/common/HomeScreen";
import OwnerCourt from "./screens/owner/CourtScheduleScreen";
import OwnerEditCourt from "./screens/owner/EditCourtScreen";
import AppNavigator from "./navigation/AppNavigator";
import OwnerDashboardScreen from "./screens/owner/OwnerDashboardScreen";
export default function App() {
  return (
    <View style={styles.container}>
      <Text>
        {/* <SportsBookingApp /> */}
        {/* <RegisterScreen /> */}
        {/* <OwnerCourt /> */}
        {/* <OwnerEditCourt /> */}
        {/* <OwnerDashboardScreen /> */}
        <AppNavigator />
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
