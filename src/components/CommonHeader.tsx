import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import colors from '@/theme/colors';

const HEADER_HEIGHT = 76;

interface Props {
  title?: string;
  showBack?: boolean;
  showCart?: boolean; // control cart visibility
  walletAmount?: string;
  showLogin?: boolean; // show login button if not authenticated
}

export default function CommonHeader({
  title,
  showBack = false,
  showCart = true,
  walletAmount = '₹0',
  showLogin = false,
}: Props) {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <View style={styles.header}>
        {/* LEFT: Back Button or Logo */}
        {showBack ? (
          <TouchableOpacity
            onPress={() =>
              navigation.canGoBack() ? navigation.goBack() : null
            }
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <Image
            source={require('@/assets/logo/logo.png')}
            style={styles.logo}
          />
        )}

        {/* CENTER: Title */}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <View style={{ flex: 1 }} /> // occupy space if no title
        )}

        {/* RIGHT: Wallet + Cart or Login */}
        <View style={styles.right}>
          {showLogin ? (
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Wallet */}
              <View style={styles.wallet}>
                <Feather name="credit-card" size={14} color={colors.primary} />
                <Text style={styles.walletText}>{walletAmount}</Text>
              </View>

              {/* Cart */}
              {showCart && (
                <TouchableOpacity
                  style={styles.iconBtn}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Cart')}
                >
                  <Feather name="shopping-cart" size={18} color={colors.text} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    shadowColor: '#000',
    paddingTop: 10,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 102,
    height: 72,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wallet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 3,
  },
  walletText: {
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 13,
    color: colors.text,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  loginBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginText: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 14,
  },
});
