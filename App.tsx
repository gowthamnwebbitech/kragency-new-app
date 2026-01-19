import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { store } from '@/app/store';
import RootNavigator from '@/navigation/RootNavigator';
import IphoneToast from '@/components/IphoneToast';
import { loadAuthFromStorage } from '@/features/auth/authStorageThunk';

const toastConfig = {
  success: (props: any) => <IphoneToast {...props} type="success" />,
  error: (props: any) => <IphoneToast {...props} type="error" />,
  info: (props: any) => <IphoneToast {...props} type="info" />,
};

/* 🔐 AUTH BOOTSTRAP */
function AppBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ backgroundColor: '#FFF' }}>
        <AppBootstrap />

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
