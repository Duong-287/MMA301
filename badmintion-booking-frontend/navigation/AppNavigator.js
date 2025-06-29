import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/common/LoginScreen";
import HomeScreen from "../screens/common/HomeScreen";
import BookingScreen from "../screens/customer/BookingScreen";
import ProfileScreen from "../screens/common/ProfileScreen";

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
