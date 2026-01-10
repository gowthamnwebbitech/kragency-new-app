import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import Reanimated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import ScreenContainer from '@/components/ScreenContainer';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';
import { AppDispatch, RootState } from '@/app/store';
import {
  fetchBankDetailsThunk,
  storeBankDetailsThunk,
} from '@/features/bankDetails/bankDetailsThunk';
import { clearBankMessage } from '@/features/bankDetails/bankDetailsSlice';

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

/* ================= SUB-COMPONENTS ================= */
const DetailRow = ({ label, value, icon, isSecret }: any) => (
  <View style={styles.detailRow}>
    <View style={styles.iconCircle}>
      <Feather name={icon} size={18} color={colors.primary} />
    </View>
    <View style={styles.flex1}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>
        {isSecret && value ? `•••• •••• ${value.slice(-4)}` : value || '---'}
      </Text>
    </View>
  </View>
);

const CustomInput = ({ label, icon, error, ...props }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, error && styles.inputError]}>
      <Feather name={icon} size={16} color={error ? '#EF4444' : '#94A3B8'} />
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#CBD5E1"
        {...props}
      />
    </View>
    {error && (
      <Reanimated.Text
        entering={FadeInDown.duration(200)}
        style={styles.errorText}
      >
        {error}
      </Reanimated.Text>
    )}
  </View>
);

/* ================= MAIN SCREEN ================= */
export default function BankDetailsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, saving, error, success } = useSelector(
    (state: RootState) => state.bankDetails,
  );

  const [edit, setEdit] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
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
    if (data) {
      setForm({
        bank_name: data.bank_name || '',
        ifsc_code: data.ifsc_code || '',
        branch_name: data.branch_name || '',
        account_number: data.account_number || '',
        notes: data.notes || '',
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: error });
      dispatch(clearBankMessage());
    }
    if (success) {
      Toast.show({ type: 'success', text1: 'Success', text2: success });
      dispatch(clearBankMessage());
      setEdit(false);
      setFormErrors({});
    }
  }, [error, success, dispatch]);

  const validate = () => {
    let errors: any = {};
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!form.bank_name?.trim()) errors.bank_name = 'Bank name is required';
    if (!form.account_number?.trim())
      errors.account_number = 'Account number is required';
    if (!form.ifsc_code?.trim()) {
      errors.ifsc_code = 'IFSC code is required';
    } else if (!ifscRegex.test(form.ifsc_code.toUpperCase())) {
      errors.ifsc_code = 'Invalid IFSC format';
    }
    if (!form.branch_name?.trim())
      errors.branch_name = 'Branch location is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validate()) dispatch(storeBankDetailsThunk(form));
  };

  const isEmpty = !data || (!data.bank_name && !data.account_number);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.title}>Settlement Bank</Text>
      <Text style={styles.subtitle}>
        {isEmpty
          ? 'Link an account to receive payments.'
          : 'Your primary account for all withdrawals.'}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (isEmpty && !edit) {
      return (
        <Reanimated.View entering={FadeInDown} style={styles.emptyContainer}>
          <View style={styles.illustration}>
            <View style={styles.shieldCircle}>
              <Feather name="shield" size={44} color={colors.primary} />
            </View>
            <View style={styles.plusBadge}>
              <Feather name="plus" size={14} color="#FFF" />
            </View>
          </View>
          <Text style={styles.emptyTitle}>Secure Your Payments</Text>
          <Text style={styles.emptyDesc}>
            Link your bank details to enable automatic settlements to your account.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setEdit(true)}
          >
            <Feather name="plus-circle" size={20} color="#FFF" />
            <Text style={styles.primaryBtnText}>Add Bank Account</Text>
          </TouchableOpacity>
        </Reanimated.View>
      );
    }

    if (!edit) {
      return (
        <Reanimated.View entering={FadeInDown} style={styles.card}>
          <View style={styles.verifiedBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.verifiedText}>Verified Account</Text>
          </View>
          <DetailRow label="Bank Name" value={data?.bank_name} icon="home" />
          <View style={styles.divider} />
          <DetailRow
            label="Account Number"
            value={data?.account_number}
            icon="credit-card"
            isSecret
          />
          <View style={styles.divider} />
          <DetailRow label="IFSC Code" value={data?.ifsc_code} icon="hash" />
          <View style={styles.divider} />
          <DetailRow label="Branch" value={data?.branch_name} icon="map-pin" />
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => setEdit(true)}
          >
            <Feather name="edit-3" size={18} color="#FFF" />
            <Text style={styles.updateBtnText}>Update Account</Text>
          </TouchableOpacity>
        </Reanimated.View>
      );
    }

    return (
      <Reanimated.View
        entering={FadeIn.duration(400)}
        style={styles.formContainer}
      >
        <CustomInput
          label="Bank Name"
          value={form.bank_name}
          icon="home"
          placeholder="e.g. State Bank of India"
          error={formErrors.bank_name}
          onChangeText={(t: string) => setForm({ ...form, bank_name: t })}
        />
        <CustomInput
          label="IFSC Code"
          value={form.ifsc_code}
          icon="hash"
          autoCapitalize="characters"
          placeholder="e.g. SBIN0001234"
          error={formErrors.ifsc_code}
          onChangeText={(t: string) =>
            setForm({ ...form, ifsc_code: t.toUpperCase() })
          }
        />
        <CustomInput
          label="Account Number"
          value={form.account_number}
          icon="credit-card"
          keyboardType="numeric"
          placeholder="Enter account number"
          error={formErrors.account_number}
          onChangeText={(t: string) => setForm({ ...form, account_number: t })}
        />
        <CustomInput
          label="Branch"
          value={form.branch_name}
          icon="map-pin"
          placeholder="Enter branch location"
          error={formErrors.branch_name}
          onChangeText={(t: string) => setForm({ ...form, branch_name: t })}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setEdit(false);
              setFormErrors({});
            }}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Details</Text>
            )}
          </TouchableOpacity>
        </View>
      </Reanimated.View>
    );
  };

  return (
    <ScreenContainer style={styles.mainContainer}>
      <CommonHeader
        title="Bank Details"
        showBack
        showCart={false}
        showWallet={false}
      />
      {loading && !edit ? (
        <View style={styles.padding24}>
          <Skeleton style={styles.skelTitle} />
          <Skeleton style={styles.skelSubtitle} />
          <View style={styles.skelCard}>
            <Skeleton style={styles.skelBadge} />
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.skelRow}>
                <Skeleton style={styles.skelIcon} />
                <View>
                  <Skeleton style={styles.skelLabel} />
                  <Skeleton style={styles.skelValue} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <KeyboardAwareFlatList
          data={[{ id: 'content' }]}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.padding24}
          ListHeaderComponent={renderHeader}
          renderItem={renderContent}
          showsVerticalScrollIndicator={false}
          /* --- KEYBOARD FIXES --- */
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraHeight={160} // Increase distance between keyboard and input
          extraScrollHeight={Platform.OS === 'ios' ? 50 : 120} // Space at bottom
          keyboardOpeningTime={0} // Respond immediately
          keyboardShouldPersistTaps="handled"
        />
      )}
    </ScreenContainer>
  );
}

/* ================= STYLESHEET ================= */
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  mainContainer: { backgroundColor: '#FFFFFF' },
  padding24: { padding: 24 },

  headerSection: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 6, lineHeight: 22 },

  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  verifiedBadge: {
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
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 8,
  },
  verifiedText: { fontSize: 12, fontWeight: '700', color: '#166534' },
  divider: { height: 1, backgroundColor: '#EDF2F7', marginVertical: 6 },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 17,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 2,
  },

  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  illustration: { marginBottom: 24 },
  shieldCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: `${colors.primary}15`,
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
  primaryBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 24,
    width: '100%',
    gap: 12,
  },
  primaryBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },

  formContainer: { paddingBottom: 40 },
  inputContainer: { gap: 8, marginBottom: 15 },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  inputError: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: 12,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
    marginTop: -4,
  },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 15 },
  cancelBtn: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: { color: '#64748B', fontWeight: '800', fontSize: 16 },
  saveBtn: {
    flex: 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  updateBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 22,
    marginTop: 24,
    gap: 10,
  },
  updateBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  skeletonBase: { backgroundColor: '#E2E8F0', borderRadius: 8 },
  skelTitle: { width: '60%', height: 32, marginBottom: 10 },
  skelSubtitle: { width: '85%', height: 16, marginBottom: 32 },
  skelCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  skelBadge: { width: 120, height: 28, borderRadius: 100, marginBottom: 24 },
  skelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  skelIcon: { width: 44, height: 44, borderRadius: 14, marginRight: 16 },
  skelLabel: { width: 80, height: 12, marginBottom: 6 },
  skelValue: { width: 150, height: 18 },
});