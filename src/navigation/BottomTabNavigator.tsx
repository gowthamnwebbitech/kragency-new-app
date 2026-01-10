import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { Platform, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '@/screens/home/DashboardScreen';
import ResultsScreen from '@/screens/results/ResultsScreen';
import CartScreen from '@/screens/cart/CartScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import { RootState } from '@/app/store';
import colors from '@/theme/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  /**
   * RESPONSIVE HEIGHT CALCULATION
   * insets.bottom is > 0 on gesture-based phones (iPhone 13+, Pixel 6+ with gestures)
   * insets.bottom is 0 on phones with physical/on-screen buttons.
   */
  const TAB_BAR_HEIGHT = Platform.select({
    ios: 60 + insets.bottom,
    android: insets.bottom > 0 ? 70 + insets.bottom : 70, 
  });

  const requireAuth = (screenName: string) => ({ preventDefault }: any) => {
    if (!isAuthenticated) {
      preventDefault();
      navigation.navigate('Login');
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#FFF',
          height: TAB_BAR_HEIGHT,
          // Bottom padding ensures content is above the 'pill' or gesture zone
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          /* Premium Shadow */
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
            },
            android: {
              elevation: 10,
            },
          }),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
          // Extra bottom margin for Android buttons to look centered
          marginBottom: Platform.OS === 'android' && insets.bottom === 0 ? 4 : 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        listeners={{ tabPress: requireAuth('Results') }}
        options={{
          tabBarLabel: 'Results',
          tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        listeners={{ tabPress: requireAuth('Cart') }}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <Feather name="shopping-cart" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={{ tabPress: requireAuth('Profile') }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}