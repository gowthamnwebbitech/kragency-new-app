import React, { useEffect, useRef } from 'react';
import {
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { RootState } from '@/app/store';

type WithAuthOptions = {
  redirectTo?: string;
};

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthOptions = {},
): React.FC<P> {
  const { redirectTo = 'Login' } = options;

  const AuthGuard: React.FC<P> = (props) => {
    const navigation = useNavigation<any>();
    const { token, loading } = useSelector(
      (state: RootState) => state.auth,
    );

    const redirectedRef = useRef(false);

    useEffect(() => {
      if (loading) return;

      if (!token && !redirectedRef.current) {
        redirectedRef.current = true;

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: redirectTo }],
          }),
        );
      }
    }, [token, loading, navigation]);

    if (loading || !token) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthGuard;
}
