import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/theme/colors';

const { width, height } = Dimensions.get('window');

interface ErrorProps {
  error?: string | null;
  onRetry: () => void;
  isRetrying?: boolean;
  fullScreen?: boolean;
}

const CommonErrorState: React.FC<ErrorProps> = ({
  error,
  onRetry,
  isRetrying = false,
  fullScreen = true,
}) => {
  const getErrorInfo = () => {
    const err = (error || '').toLowerCase();

    if (
      err.includes('network') ||
      err.includes('internet') ||
      err.includes('timeout') ||
      err.includes('failed to fetch') ||
      err.includes('unreachable')
    ) {
      return {
        icon: 'wifi-off',
        title: 'No Internet Connection',
        message:
          'Your mobile network is available, but internet access is not working. Please check your data or Wi-Fi.',
      };
    }

    if (
      err.includes('401') ||
      err.includes('unauthorized') ||
      err.includes('session')
    ) {
      return {
        icon: 'lock',
        title: 'Session Expired',
        message: 'Please log in again to continue.',
      };
    }

    return {
      icon: 'alert-circle',
      title: 'Something Went Wrong',
      message:
        error || 'An unexpected error occurred. Please try again later.',
    };
  };

  const info = getErrorInfo();
  const Container = fullScreen ? SafeAreaView : View;

  return (
    <Container style={[styles.wrapper, fullScreen && styles.fullScreen]}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        <Animated.View entering={ZoomIn.delay(150)} style={styles.iconCircle}>
          <Feather
            name={info.icon as any}
            size={42}
            color={colors.primary}
          />
        </Animated.View>

        <Text style={styles.title}>{info.title}</Text>
        <Text style={styles.message}>{info.message}</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isRetrying}
          onPress={onRetry}
          style={[styles.button, isRetrying && styles.disabled]}
        >
          {isRetrying ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.buttonText}> Connecting...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>
              {info.icon === 'lock' ? 'Go to Login' : 'Try Again'}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Container>
  );
};

export default CommonErrorState;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    minHeight: height,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    width: width * 0.7,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  disabled: {
    opacity: 0.6,
    elevation: 0,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
