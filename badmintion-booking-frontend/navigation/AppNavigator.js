import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/common/LoginScreen";
import HomeScreen from "../screens/common/HomeScreen";
import BookingScreen from "../screens/customer/BookingScreen";
import ProfileScreen from "../screens/common/ProfileScreen";
import AccountScreen from "../screens/common/AccountScreen";
import AdminDashboard from "../screens/admin/AdminDashboardScreen";
import AdminWalletScreen from "../screens/admin/AdminWalletScreen";
import VerifyOtpScreen from "../screens/common/VerifyOtpScreen";
import OwnerDashboardScreen from "../screens/owner/OwnerDashboardScreen";
import EditCourtScreen from "../screens/owner/EditCourtScreen";
import ManageCourtsScreen from "../screens/owner/ManageCourtsScreen";
import OwnerWalletScreen from "../screens/owner/OwnerWalletScreen";
import CourtScheduleScreen from "../screens/owner/CourtScheduleScreen";
import CourtDetailScreen from "../screens/common/CountDetailScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="AdminWallet" component={AdminWalletScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="OwnerHome" component={OwnerDashboardScreen} />
    <Stack.Screen name="EditCourt" component={EditCourtScreen} />
    <Stack.Screen name="ManageCourts" component={ManageCourtsScreen} />
    <Stack.Screen name="OwnerWallet" component={OwnerWalletScreen} />
    <Stack.Screen name="CourtSchedule" component={CourtScheduleScreen} />
    <Stack.Screen name="CourtDetail" component={CourtDetailScreen} />
    <Stack.Screen name="Account" component={AccountScreen} /> 
    <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
