import NetInfo from '@react-native-community/netinfo';

export const hasInternetConnection = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();

  return Boolean(
    state.isConnected === true &&
    state.isInternetReachable === true
  );
};
