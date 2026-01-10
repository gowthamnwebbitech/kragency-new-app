import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import SlotScreen from '@/screens/slot/SlotScreen';
import OrderHistoryScreen from '@/screens/profile/orderhistory';
import PaymentHistoryScreen from '@/screens/profile/PaymentHistoryScreen';
import WithdrawScreen from '@/screens/profile/WithdrawScreen';
import WithdrawalHistoryScreen from '@/screens/profile/WithdrawalHistoryScreen';
import BankDetailsScreen from '@/screens/profile/BankDetailsScreen';
import CartScreen from '@/screens/cart/CartScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import GameScreen from '@/screens/slot/GameScreen';
import OrderSuccessScreen from '@/screens/orderplaced/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="SlotScreen" component={SlotScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen
        name="WithdrawHistory"
        component={WithdrawalHistoryScreen}
      />
      <Stack.Screen name="GameScreen" component={GameScreen} />
      <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
}
