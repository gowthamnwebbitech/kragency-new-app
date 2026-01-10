import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';

import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import colors from '@/theme/colors';
import { AppDispatch, RootState } from '@/app/store';
import {
  fetchWalletBonusThunk,
  withdrawThunk,
} from '@/features/withdraw/withdrawThunks';
import { clearMessage } from '@/features/withdraw/withdrawSlice';
import Toast from 'react-native-toast-message';

/* ================= SKELETON COMPONENT ================= */
const Skeleton = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();
  }, [opacity]);

  return <Animated.View style={[styles.skeletonBase, style, { opacity }]} />;
};

const WithdrawSkeleton = () => (
  <ScrollView contentContainerStyle={styles.scrollPadding}>
    <Skeleton style={styles.balanceCardSkeleton} />
    <Skeleton style={styles.skeletonLabel} />
    <Skeleton style={styles.skeletonInputBox} />
    <Skeleton style={styles.skeletonInfoBox} />
    <View style={styles.chipContainer}>
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} style={styles.skeletonChip} />
      ))}
    </View>
    <Skeleton style={styles.skeletonButton} />
  </ScrollView>
);

/* ================= MAIN COMPONENT ================= */
export default function WithdrawScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const [amount, setAmount] = useState('');

  const {
    walletBalance = 0,
    bonusBalance = 0,
    minWithdraw = 500,
    withdrawLoading = false,
    error = null,
    withdrawSuccess = null,
  } = useSelector((state: RootState) => state.withdraw || {});

  const quickSelectAmounts = [minWithdraw, 1000, 2000, 5000];

  useEffect(() => {
    dispatch(fetchWalletBonusThunk());
  }, []);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
      dispatch(clearMessage());
      return;
    }

    if (withdrawSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: withdrawSuccess,
      });
      dispatch(clearMessage());
      setAmount('');
      dispatch(fetchWalletBonusThunk());
    }
  }, [error, withdrawSuccess, dispatch]);

  const handleWithdraw = () => {
    const numAmount = Number(amount);

    if (!numAmount || numAmount < minWithdraw) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: `Minimum withdrawal is ₹${minWithdraw}`,
      });
      return;
    }

    if (numAmount > walletBalance) {
      Toast.show({
        type: 'error',
        text1: 'Insufficient Balance',
        text2: 'Your wallet balance is too low',
      });
      return;
    }

    dispatch(withdrawThunk({ amount: numAmount }));
  };

  const showSkeleton = walletBalance === 0 && !withdrawSuccess;

  return (
    <ScreenContainer style={styles.whiteBg}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <CommonHeader
        title="Withdraw Funds"
        showBack
        showCart={false}
        showWallet={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {showSkeleton ? (
          <WithdrawSkeleton />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            {/* Wallet Card */}
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.balanceCard}
            >
              <View style={styles.walletRow}>
                <Feather name="credit-card" size={28} color="#FFF" />
                <Text style={styles.walletLabel}>Wallet</Text>
                <Text style={styles.walletValue}>
                  ₹{walletBalance.toFixed(2)}
                </Text>
              </View>
              <View style={styles.walletDivider} />
              <View style={styles.walletRow}>
                <Feather name="gift" size={28} color="#FFF" />
                <Text style={styles.walletLabel}>Bonus</Text>
                <Text style={styles.walletValue}>
                  ₹{bonusBalance.toFixed(2)}
                </Text>
              </View>
            </LinearGradient>

            {/* Withdraw Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Withdraw Amount</Text>
              <View style={styles.amountWrapper}>
                <Text style={styles.currency}>₹</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={colors.placeholder}
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
              <View style={styles.infoBox}>
                <Feather name="info" size={14} color={colors.textLight} />
                <Text style={styles.infoText}>
                  Minimum ₹{minWithdraw} • 1 request per 24h
                </Text>
              </View>
            </View>

            {/* Quick Select Chips */}
            <View style={styles.chipContainer}>
              {quickSelectAmounts.map(val => (
                <TouchableOpacity
                  key={val}
                  style={styles.chip}
                  onPress={() => setAmount(val.toString())}
                >
                  <Text style={styles.chipText}>+₹{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtnWrapper}
              onPress={handleWithdraw}
              disabled={withdrawLoading}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.submitBtn}
              >
                <Text style={styles.submitText}>
                  {withdrawLoading ? 'Processing...' : 'Submit Request'}
                </Text>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  /* SHARED & LAYOUT */
  whiteBg: {
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollPadding: {
    padding: 24,
  },

  /* SKELETON STYLES */
  skeletonBase: {
    backgroundColor: '#E2E8F0',
  },
  balanceCardSkeleton: {
    height: 120,
    borderRadius: 20,
    marginBottom: 30,
  },
  skeletonLabel: {
    width: 120,
    height: 16,
    marginBottom: 12,
    borderRadius: 4,
  },
  skeletonInputBox: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonInfoBox: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  skeletonChip: {
    width: 75,
    height: 35,
    borderRadius: 12,
  },
  skeletonButton: {
    width: '100%',
    height: 60,
    borderRadius: 16,
    marginTop: 20,
  },

  /* ACTIVE COMPONENT STYLES */
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  walletRow: {
    alignItems: 'center',
    flex: 1,
  },
  walletLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 6,
  },
  walletValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  walletDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 12,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  currency: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    padding: 0,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 20,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  submitBtnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 10,
    borderRadius: 16,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});