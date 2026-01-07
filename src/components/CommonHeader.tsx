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

interface Props {
  title?: string;
  showBack?: boolean;
  cartCount?: number;
  showWallet?: boolean;
  showCart?: boolean;
}

export default function CommonHeader({
  title,
  showBack = false,
  cartCount = 0,
  showWallet = true,
  showCart = true,
}: Props) {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { data: wallet } = useSelector((state: RootState) => state.wallet);

  const springConfig = { damping: 12, stiffness: 200, mass: 0.8 };
  const walletScale = useSharedValue(1);
  const cartScale = useSharedValue(1);

  useEffect(() => {
    if (showWallet) {
      dispatch(fetchWalletThunk());
    }
  }, [dispatch, showWallet]);

  useEffect(() => {
    if (showWallet && wallet?.wallet_balance) {
      walletScale.value = withSequence(
        withSpring(1.1, springConfig),
        withSpring(1, springConfig),
      );
    }
  }, [wallet?.wallet_balance, wallet?.bonus_balance]);

  useEffect(() => {
    if (showCart && cartCount > 0) {
      cartScale.value = withSequence(
        withSpring(1.3, springConfig),
        withSpring(1, springConfig),
      );
    }
  }, [cartCount]);

  const walletAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: walletScale.value }],
  }));

  const cartBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  // Determine if we show anything on the right to handle layout padding
  const showRightContent = showWallet || showCart;

  return (
    <View style={styles.headerOuter}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.container}>
        
        {/* LEFT SECTION: Fixed width to keep title centered, or auto if just back */}
        <View style={styles.sectionLeft}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backTouch}
            >
              <Feather name="arrow-left" size={24} color="#0F172A" />
            </TouchableOpacity>
          ) : (
            <Image source={Logo} style={styles.logo} />
          )}
        </View>

        {/* CENTER SECTION: Expands to fill space */}
        <View style={styles.sectionCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* RIGHT SECTION: Content-driven width */}
        <View style={styles.sectionRight}>
          {showWallet && wallet && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Wallet')}
            >
              <Animated.View style={[styles.walletPill, walletAnimatedStyle]}>
                <View style={styles.balanceRow}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <Text style={styles.balanceText}>{wallet.wallet_balance}</Text>
                </View>
                {parseFloat(wallet.bonus_balance) > 0 && (
                  <Text style={styles.bonusText}>
                    +{wallet.bonus_balance} Bonus
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          )}

          {showCart && (
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
          
          {/* Spacer if right is totally empty to keep title from hitting the edge */}
          {!showRightContent && <View style={{ width: 10 }} />}
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
    zIndex: 10,
  },
  container: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sectionLeft: {
    // Left side stays consistent
    minWidth: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sectionCenter: {
    // This fills all available space between Left and Right
    flex: 1, 
    paddingHorizontal: 10,
    alignItems: 'flex-start', // Title aligns left for a modern look when icons are hidden
  },
  sectionRight: {
    // Right side only takes space if items are visible
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  logo: { width: 100, height: 45, resizeMode: 'cover' },
  backTouch: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'flex-start' 
  },
  headerTitle: {
    fontSize: 17, // Slightly larger for better readability
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  walletPill: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: {
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
    marginRight: 1,
  },
  balanceText: { fontSize: 13, fontWeight: '900', color: '#1E293B' },
  bonusText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#7C3AED',
    marginTop: -2,
    textTransform: 'uppercase',
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
});