import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

import HomeScreen from '@/screens/home/DashboardScreen';
import ResultsScreen from '@/screens/results/ResultsScreen';
import CartScreen from '@/screens/cart/CartScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import { RootState } from '@/app/store';
import colors from '@/theme/colors';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) => <Feather name={name} size={size} color={color} />;

export default function BottomTabNavigator({ navigation }: any) {
  /** 🔐 AUTH STATE */
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = !!token;

  /** 🔐 AUTH GUARD */
  const requireAuth =
    (screenName: string) =>
    ({ preventDefault }: any) => {
      if (!isAuthenticated) {
        preventDefault();
        navigation.navigate('Login');
      }
    };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 70,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 4 : 6,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        listeners={{
          tabPress: requireAuth('Results'),
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="bar-chart-2" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        listeners={{
          tabPress: requireAuth('Cart'),
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={{
          tabPress: requireAuth('Profile'),
        }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
