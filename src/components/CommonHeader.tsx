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

const HEADER_HEIGHT = 60;

interface Props {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;       
  showWallet?: boolean;     
  walletAmount?: string;
  cartCount?: number;       // Added cart count prop
  showLogin?: boolean;      
}

export default function CommonHeader({
  title,
  showBack = false,
  showCart = true,
  showWallet = true,
  walletAmount = '₹0',
  cartCount = 3,            // Defaulted to 0
  showLogin = false,
}: Props) {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />

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
          <View style={{ flex: 1 }} />
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
              {/* Wallet - Now Clickable & with Money Icon */}
              {showWallet && (
                <TouchableOpacity 
                  style={styles.wallet}
                  onPress={() => navigation.navigate('Wallet')} // Navigate to Wallet
                >
                  <Feather name="dollar-sign" size={14} color={colors.primary} />
                  <Text style={styles.walletText}>{walletAmount}</Text>
                </TouchableOpacity>
              )}

              {/* Cart - Now with Count Badge */}
              {showCart && (
                <TouchableOpacity
                  style={styles.iconBtn}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Cart')} // Navigate to Cart
                >
                  <Feather name="shopping-cart" size={18} color={colors.text} />
                  {cartCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                  )}
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
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 0.5,
  },
  header: {
    height: HEADER_HEIGHT,
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
  // Added Badge Styles
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
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