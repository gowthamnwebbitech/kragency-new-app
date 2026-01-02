import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import SlotScreen from '@/screens/slot/SlotScreen';
import LoginScreen from '@/screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
     
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      <Stack.Screen name="SlotScreen" component={SlotScreen} />

      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
