import React from 'react';
import { Provider } from 'react-redux';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { store } from '@/app/store';
import RootNavigator from '@/navigation/RootNavigator';
import IphoneToast from '@/components/IphoneToast';

const toastConfig = {
  success: (props: any) => (
    <IphoneToast {...props} type="success" />
  ),
  error: (props: any) => (
    <IphoneToast {...props} type="error" />
  ),
  info: (props: any) => (
    <IphoneToast {...props} type="info" />
  ),
};



export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />

        {/* 🔴 THIS MUST EXIST */}
        <Toast
          config={toastConfig}
          position="top"
          topOffset={Platform.OS === 'android' ? 40 : 55}
          visibilityTime={3000}
        />
      </SafeAreaProvider>
    </Provider>
  );
}
