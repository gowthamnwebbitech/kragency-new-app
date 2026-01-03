import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

export default function RootNavigator() {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      {!isAuthenticated && <AuthNavigator />}
    </NavigationContainer>
  );
}
