import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Animated, {
  FadeInUp,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { logout } from '@/features/auth/authSlice';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import colors from '@/theme/colors';
import { RootState, AppDispatch } from '@/app/store';
import { fetchProfileThunk } from '@/features/userProfile/profileThunk';
import { clearProfileMessage } from '@/features/userProfile/profileSlice';

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, error, success } = useSelector(
    (state: RootState) => state.profile,
  );

  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error });
      dispatch(clearProfileMessage());
    }
    if (success) {
      Toast.show({ type: 'success', text1: 'Success', text2: success });
      dispatch(clearProfileMessage());
    }
  }, [error, success, dispatch]);

  const handleLogout = () => {
    dispatch(logout());

    Toast.show({
      type: 'success',
      text1: 'Logged out',
      text2: 'You have been logged out successfully',
    });

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const menuOptions = [
    { icon: 'shopping-bag', label: 'Order History', screen: 'OrderHistory' },
    { icon: 'credit-card', label: 'Payment History', screen: 'PaymentHistory' },
    {
      icon: 'arrow-up-circle',
      label: 'Withdraw Funds',
      screen: 'WithdrawScreen',
    },
    { icon: 'list', label: 'Withdraw History', screen: 'WithdrawHistory' },
    { icon: 'plus-square', label: 'Settlement Bank', screen: 'BankDetails' },
  ];

  return (
    <ScreenContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <CommonHeader title="Profile" showBack showCart={false} showWallet={false} />

      <ScrollView
        contentContainerStyle={{ paddingVertical: 35 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 👤 BRANDED HEADER (USER ICON STYLE) */}
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={styles.headerWrapper}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroGradient}
          >
            <View style={styles.profileRow}>
              {/* Profile Icon Avatar */}
              <Animated.View
                entering={ZoomIn.delay(200)}
                style={styles.avatarContainer}
              >
                <View style={styles.iconCircle}>
                  <Feather name="user" size={32} color={colors.primary} />
                </View>
                <TouchableOpacity
                  style={styles.miniEditBadge}
                  activeOpacity={0.8}
                >
                  <Feather name="camera" size={10} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {data?.name || 'Guest User'}
                </Text>
                <View style={styles.phoneBadge}>
                  <Feather
                    name="phone"
                    size={10}
                    color="rgba(255,255,255,0.7)"
                  />
                  <Text style={styles.userPhone}>
                    {data?.mobile || 'No Mobile Linked'}
                  </Text>
                </View>
              </View>

              <View style={styles.activeIndicator}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>

            {/* INTEGRATED STATS PILL */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statVal}>{data?.order_count || '0'}</Text>
                <Text style={styles.statLab}>Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>
                  ₹{data?.wallet_balance || '0'}
                </Text>
                <Text style={styles.statLab}>Wallet</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statVal}>
                  ₹{data?.bonus_balance || '0'}
                </Text>
                <Text style={styles.statLab}>Bonus</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* 🛠 MENU SECTION */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Account Management</Text>

          <View style={styles.menuCard}>
            {menuOptions.map((opt, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuOptions.length - 1 && { borderBottomWidth: 0 },
                ]}
                activeOpacity={0.6}
                onPress={() => opt.screen && navigation.navigate(opt.screen)}
              >
                <View
                  style={[
                    styles.menuIconBox,
                    { backgroundColor: `${colors.primary}08` },
                  ]}
                >
                  <Feather
                    name={opt.icon as any}
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.menuLabel}>{opt.label}</Text>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={colors.disabled}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SIGN OUT ACTION */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutAction}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.logoutIconWrapper}>
              <Feather name="log-out" size={14} color={colors.error} />
            </View>
            <Text style={styles.logoutText}>Log Out Account</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 2.0.4 (Build 2026)</Text>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  heroGradient: {
    borderRadius: 24,
    padding: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.text,
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  activeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 25,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  statLab: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
  },
  menuSection: { paddingHorizontal: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  footer: {
    marginTop: 35,
    alignItems: 'center',
  },
  logoutAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { color: colors.error, fontWeight: '800', fontSize: 15 },
  versionText: {
    fontSize: 11,
    color: colors.disabled,
    marginTop: 15,
    fontWeight: '600',
  },
});
