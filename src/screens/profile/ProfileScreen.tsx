import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CommonHeader from '@/components/CommonHeader';
import LinearGradient from 'react-native-linear-gradient';
import colors from '@/theme/colors';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
  const options = [
    { icon: 'repeat', label: 'Order History' },
    { icon: 'credit-card', label: 'Payment History' },
    { icon: 'dollar-sign', label: 'Withdraw' },
    { icon: 'repeat', label: 'Withdraw History' },
    { icon: 'home', label: 'Add Bank Details' },
    { icon: 'log-out', label: 'Logout', color: colors.primary },
  ];

  return (
    <View style={styles.container}>
      {/* COMMON HEADER */}
      <CommonHeader
        title="Profile"
        showBack
        walletAmount="₹2,450"
        onBackPress={() => navigation.goBack()}
        showCart={false}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================== COMPACT PROFILE CARD ================== */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={require('@/assets/logo/logo.png')}
              style={styles.avatar}
            />
          </View>

          {/* Name and Info */}
          <View style={styles.userInfo}>
            <Text style={styles.name}>Gowtham N</Text>
            <Text style={styles.userId}>KR1248</Text>
            <Text style={styles.phone}>+91 7358046008</Text>
          </View>

          {/* Stats Inline */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>₹2,450</Text>
              <Text style={styles.statLabel}>Wallet</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Banks</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ================== OPTIONS ================== */}
        {options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              opt.label === 'Logout' ? { backgroundColor: '#FDEDED' } : {},
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name={opt.icon as any}
              size={22}
              color={opt.color ? opt.color : colors.primary}
              style={{ width: 28 }}
            />
            <Text
              style={[
                styles.optionText,
                opt.label === 'Logout' ? { color: colors.primary } : {},
              ]}
            >
              {opt.label}
            </Text>
            {opt.label !== 'Logout' && (
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textLight}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  profileCard: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarWrapper: {
    borderWidth: 3,
    borderColor: colors.card,
    borderRadius: 45,
    padding: 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    tintColor: '#FFF', // Make logo white
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: width * 0.055,
    fontWeight: '800',
    color: '#FFF',
  },
  userId: {
    fontSize: width * 0.036,
    fontWeight: '600',
    color: '#FFF',
    opacity: 0.85,
    marginTop: 2,
  },
  phone: {
    fontSize: width * 0.034,
    color: '#FFF',
    opacity: 0.85,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  statValue: {
    color: '#FFF',
    fontSize: width * 0.038,
    fontWeight: '700',
  },
  statLabel: {
    color: '#FFF',
    fontSize: width * 0.028,
    opacity: 0.9,
    marginTop: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: colors.card,
  },
  optionText: {
    fontSize: width * 0.043,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 14,
  },
});
