import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

import Logo from '@/assets/logo/logo.png';
import { RootState, AppDispatch } from '@/app/store';
import { fetchWalletThunk } from '@/features/Walletheader/walletThunk';
import colors from '@/theme/colors';

interface Props {
  title?: string;
  showBack?: boolean;
  showWallet?: boolean;
  showCart?: boolean;
}

export default function CommonHeader({
  title,
  showBack = false,
  showWallet = true,
  showCart = true,
}: Props) {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  /** 1. Move ALL selectors to the very top with safe fallbacks */
  const auth = useSelector((state: RootState) => state.auth);
  const walletState = useSelector((state: RootState) => state.wallet);
  const cartState = useSelector((state: RootState) => state.cart);

  // Derived values for easier use
  const token = auth?.token;
  const isAuthenticated = !!token;
  const wallet = walletState?.data;
  
  // Prevent "Cannot read property 'items' of undefined" error
  const cartItems = cartState?.items || [];
  const cartCount = cartItems.length;

  /** 2. Shared Values for Animation */
  const springConfig = { damping: 12, stiffness: 200, mass: 0.8 };
  const walletScale = useSharedValue(1);
  const cartScale = useSharedValue(1);

  /** 3. Data Fetching Logic */
  useEffect(() => {
    if (isAuthenticated && showWallet) {
      dispatch(fetchWalletThunk());
    }
  }, [dispatch, showWallet, isAuthenticated]);

  /** 4. Wallet Animation Trigger */
  useEffect(() => {
    if (isAuthenticated && showWallet && wallet?.wallet_balance) {
      walletScale.value = withSequence(
        withSpring(1.1, springConfig),
        withSpring(1, springConfig),
      );
    }
  }, [wallet?.wallet_balance, wallet?.bonus_balance, isAuthenticated]);

  /** 5. Cart Animation Trigger */
  useEffect(() => {
    if (isAuthenticated && showCart && cartCount > 0) {
      cartScale.value = withSequence(
        withSpring(1.3, springConfig),
        withSpring(1, springConfig),
      );
    }
  }, [cartCount, isAuthenticated]);

  const walletAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: walletScale.value }],
  }));

  const cartBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  return (
    <View style={styles.headerOuter}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.container}>
        {/* ⬅️ LEFT SECTION */}
        <View style={styles.sectionLeft}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#0F172A" />
            </TouchableOpacity>
          ) : (
            <Image source={Logo} style={styles.logo} />
          )}
        </View>

        {/* 🏷 CENTER SECTION */}
        <View style={styles.sectionCenter}>
          {!!title && (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {/* 👉 RIGHT SECTION */}
        <View style={styles.sectionRight}>
          {/* 💰 WALLET PILL (Visible only if Logged In) */}
          {isAuthenticated && showWallet && wallet && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Wallet')}
            >
              <Animated.View style={[styles.walletPill, walletAnimatedStyle]}>
                <View style={styles.balanceRow}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.balanceText}>
                    {wallet.wallet_balance}
                  </Text>
                </View>
                {parseFloat(wallet.bonus_balance || '0') > 0 && (
                  <Text style={styles.bonusText}>
                    +{wallet.bonus_balance} Bonus
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          )}

          {/* 🛒 CART ICON (Visible only if Logged In) */}
          {isAuthenticated && showCart && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.7}
            >
              <View style={styles.cartBox}>
                <Feather name="shopping-bag" size={20} color="#0F172A" />
                {cartCount > 0 && (
                  <Animated.View style={[styles.badge, cartBadgeStyle]}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </Animated.View>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* 🔓 LOGIN BUTTON (Visible only if Logged Out) */}
          {!isAuthenticated && (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerOuter: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  container: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionLeft: {
    minWidth: 40,
    justifyContent: 'center',
  },
  sectionCenter: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 100,
    height: 45,
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  walletPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: {
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
  },
  balanceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
  },
  bonusText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#7C3AED',
  },
  cartBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0F172A',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  loginBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  loginText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});