import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');
const MAX_WIDTH = 420; // 👈 iOS notification max width

interface Props {
  text1?: string;
  text2?: string;
  type?: 'success' | 'error' | 'info';
}

export default function IphoneToast({ text1, text2, type }: Props) {
  const icon =
    type === 'success'
      ? 'check-circle'
      : type === 'error'
      ? 'x-circle'
      : 'info';

  return (
    <View style={styles.container}>
      <View style={styles.toast}>
        <Feather name={icon} size={22} color="#007AFF" />
        <View style={styles.textBox}>
          <Text style={styles.title} numberOfLines={1}>
            {text1 ?? 'Notification'}
          </Text>

          {!!text2 && (
            <Text style={styles.message} numberOfLines={2}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center', // ✅ center banner
    paddingHorizontal: 12,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },

  toast: {
    width: '100%',
    maxWidth: MAX_WIDTH, // ✅ max width like iOS
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,

    // iOS shadow
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    }),

    // Android shadow
    ...(Platform.OS === 'android' && {
      elevation: 14,
    }),
  },

  textBox: {
    marginLeft: 14,
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    letterSpacing: -0.2, // ✅ iOS typography
  },

  message: {
    marginTop: 4,
    fontSize: 13.5,
    lineHeight: 18,
    color: '#555',
  },
});
