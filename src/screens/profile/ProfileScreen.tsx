import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CommonHeader from '@/components/CommonHeader';
import LinearGradient from 'react-native-linear-gradient';
import colors from '@/theme/colors';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { RootState } from '@/app/store';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          Toast.show({
            type: 'success',
            text1: 'Logged Out',
            text2: 'Redirecting to login...',
          });
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const options = [
    { icon: 'shopping-bag', label: 'Order History', screen: 'OrderHistory' },
    { icon: 'credit-card', label: 'Payment History', screen: 'PaymentHistory' },
    { icon: 'arrow-up-circle', label: 'Withdraw', screen: 'WithdrawScreen' },
    { icon: 'list', label: 'Withdraw History', screen: 'WithdrawHistory' },
    { icon: 'plus-square', label: 'Add Bank Details', screen: 'BankDetails' },
    { icon: 'log-out', label: 'Logout', color: colors.primary, isLogout: true },
  ];

  return (
    <View style={styles.container}>
      <CommonHeader
        title="Account"
        showBack
        walletAmount="₹2,450"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================== COMPACT HERO CARD ================== */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <Image
              source={require('@/assets/logo/logo.png')}
              style={styles.compactAvatar}
            />
            <View style={styles.heroText}>
              <Text style={styles.name}>{user?.name || 'Gowtham N'}</Text>
              <View style={styles.idBadge}>
                <Text style={styles.userId}>ID: {user?.id || 'KR1248'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Feather name="edit-3" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.compactStats}>
            {[
              { label: 'Orders', val: '12' },
              { label: 'Wallet', val: '₹2.4k' },
              { label: 'Banks', val: '05' },
            ].map((stat, i) => (
              <View key={i} style={styles.miniStat}>
                <Text style={styles.statVal}>{stat.val}</Text>
                <Text style={styles.statLab}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ================== COMPACT MENU ================== */}
        <View style={styles.menuContainer}>
          {options.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, opt.isLogout && styles.logoutItem]}
              activeOpacity={0.7}
              onPress={() => {
                if (opt.isLogout) {
                  handleLogout();
                } else if (opt.screen) {
                  navigation.navigate(opt.screen);
                }
              }}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: opt.isLogout ? '#FFF1F2' : '#F8FAFC' },
                ]}
              >
                <Feather
                  name={opt.icon as any}
                  size={18}
                  color={opt.color || colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.menuText,
                  opt.isLogout && { color: colors.primary },
                ]}
              >
                {opt.label}
              </Text>
              {!opt.isLogout && (
                <Feather name="chevron-right" size={18} color="#CBD5E1" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1, paddingHorizontal: 20 },

  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 15,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: { elevation: 8 },
    }),
  },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  compactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  heroText: { marginLeft: 15, flex: 1 },
  name: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  idBadge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  userId: { fontSize: 11, fontWeight: '700', color: '#FFF', opacity: 0.9 },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  compactStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 12,
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  statVal: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  statLab: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.7,
    textTransform: 'uppercase',
  },

  menuContainer: { backgroundColor: '#FFF' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
  },
});
