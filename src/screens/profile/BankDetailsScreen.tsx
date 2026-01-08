import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import ScreenContainer from '@/components/ScreenContainer';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';
import { AppDispatch, RootState } from '@/app/store';
import {
  fetchBankDetailsThunk,
  storeBankDetailsThunk,
} from '@/features/bankDetails/bankDetailsThunk';
import { clearBankMessage } from '@/features/bankDetails/bankDetailsSlice';

function BankDetailsContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, saving, error, success } = useSelector(
    (state: RootState) => state.bankDetails,
  );

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    bank_name: '',
    ifsc_code: '',
    branch_name: '',
    account_number: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchBankDetailsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  // Use your GLOBAL Toast system here
  useEffect(() => {
    if (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error });
      dispatch(clearBankMessage());
    }
    if (success) {
      Toast.show({ type: 'success', text1: 'Success', text2: success });
      dispatch(clearBankMessage());
      setEdit(false);
    }
  }, [error, success, dispatch]);

  if (loading && !edit) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isEmpty = !data || (!data.bank_name && !data.account_number);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Settlement Bank</Text>
          <Text style={styles.subtitle}>
            {isEmpty
              ? 'Link an account to receive payments.'
              : 'Your primary account for all withdrawals.'}
          </Text>
        </View>

        {isEmpty && !edit ? (
          /* --- PRE-ADDED BANK DESIGN --- */
          <Animated.View entering={FadeInDown} style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <View style={styles.circleBg}>
                <Feather name="shield" size={44} color={colors.primary} />
              </View>
              <View style={styles.plusBadge}>
                <Feather name="plus" size={14} color="#FFF" />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Secure Your Payments</Text>
            <Text style={styles.emptyDesc}>
              Link your bank details to enable automatic settlements to your
              account.
            </Text>
            <TouchableOpacity
              style={styles.addBankBtn}
              onPress={() => setEdit(true)}
            >
              <Feather name="plus-circle" size={20} color="#FFF" />
              <Text style={styles.addBankBtnText}>Add Bank Account</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            {!edit ? (
              /* --- VIEW BANK ACCOUNT --- */
              <Animated.View entering={FadeInDown} style={styles.mainContainer}>
                <View style={styles.statusBadge}>
                  <View style={styles.pulse} />
                  <Text style={styles.statusText}>Verified Account</Text>
                </View>

                <DetailRow
                  label="Bank Name"
                  value={data?.bank_name}
                  icon="home"
                />
                <Divider />
                <DetailRow
                  label="Account Number"
                  value={data?.account_number}
                  icon="credit-card"
                  isSecret
                />
                <Divider />
                <DetailRow
                  label="IFSC Code"
                  value={data?.ifsc_code}
                  icon="hash"
                />
                <Divider />
                <DetailRow
                  label="Branch"
                  value={data?.branch_name}
                  icon="map-pin"
                />

                <TouchableOpacity
                  style={styles.floatingEdit}
                  onPress={() => setEdit(true)}
                >
                  <Feather name="edit-3" size={18} color="#FFF" />
                  <Text style={styles.editBtnText}>Update Account</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              /* --- EDIT BANK ACCOUNT --- */
              <Animated.View
                entering={FadeIn.duration(400)}
                style={styles.formCard}
              >
                <CustomInput
                  label="Bank Name"
                  value={form.bank_name}
                  icon="home"
                  placeholder="e.g. State Bank of India"
                  onChangeText={(t: string) =>
                    setForm({ ...form, bank_name: t })
                  }
                />
                <CustomInput
                  label="IFSC Code"
                  value={form.ifsc_code}
                  icon="hash"
                  autoCapitalize="characters"
                  placeholder="e.g. SBIN0001234"
                  onChangeText={(t: string) =>
                    setForm({ ...form, ifsc_code: t })
                  }
                />
                <CustomInput
                  label="Account Number"
                  value={form.account_number}
                  icon="credit-card"
                  keyboardType="numeric"
                  placeholder="Enter account number"
                  onChangeText={(t: string) =>
                    setForm({ ...form, account_number: t })
                  }
                />
                <CustomInput
                  label="Branch"
                  value={form.branch_name}
                  icon="map-pin"
                  placeholder="Enter branch location"
                  onChangeText={(t: string) =>
                    setForm({ ...form, branch_name: t })
                  }
                />

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setEdit(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => dispatch(storeBankDetailsThunk(form))}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={styles.saveText}>Save Details</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Internal Sub-components
const DetailRow = ({ label, value, icon, isSecret }: any) => (
  <View style={styles.row}>
    <View style={styles.iconCircle}>
      <Feather name={icon} size={18} color={colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {isSecret && value ? `•••• •••• ${value.slice(-4)}` : value || '---'}
      </Text>
    </View>
  </View>
);

const CustomInput = ({ label, icon, ...props }: any) => (
  <View style={styles.inputBox}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputFieldContainer}>
      <Feather name={icon} size={16} color="#94A3B8" />
      <TextInput
        style={styles.input}
        placeholderTextColor="#CBD5E1"
        {...props}
      />
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

export default function BankDetailsScreen() {
  return (
    <ScreenContainer>
      <CommonHeader title="Bank Details" showBack showCart={false} showWallet={false} />
      <BankDetailsContent />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 24 },
  headerTextContainer: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 6, lineHeight: 22 },

  mainContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  statusText: { fontSize: 12, fontWeight: '700', color: '#166534' },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: { fontSize: 17, color: '#1E293B', fontWeight: '700', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#EDF2F7', marginVertical: 6 },

  floatingEdit: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 22,
    marginTop: 24,
    gap: 10,
  },
  editBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyIllustration: { marginBottom: 24 },
  circleBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },
  emptyDesc: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  addBankBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 24,
    width: '100%',
    gap: 12,
  },
  addBankBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },

  formCard: { gap: 20 },
  inputBox: { gap: 10 },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 4,
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: 12,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  actionRow: { flexDirection: 'row', gap: 15, marginTop: 15 },
  cancelBtn: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelText: { color: '#64748B', fontWeight: '800', fontSize: 16 },
  saveBtn: {
    flex: 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  saveText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});
