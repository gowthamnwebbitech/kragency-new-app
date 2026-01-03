import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';

// Move InputField outside
const InputField = ({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputWrapper}>
      <View style={styles.iconBox}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={label.includes('IFSC') ? 'characters' : 'words'}
      />
    </View>
  </View>
);

export default function BankDetailsScreen({ navigation }: any) {
  const [bankData, setBankData] = useState({
    bankName: '',
    ifsc: '',
    branch: '',
    accountNumber: '',
    notes: '',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <CommonHeader
        title="Edit Bank Details"
        showBack
        showWallet={false}
        showCart={false}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECURE INFO BOX */}
          <View style={styles.securityBanner}>
            <Feather name="shield" size={20} color="#10B981" />
            <View style={{ flex: 1 }}>
              <Text style={styles.securityTitle}>Secure Encryption</Text>
              <Text style={styles.securitySub}>
                Your bank details are encrypted and stored securely for payouts
                only.
              </Text>
            </View>
          </View>

          {/* FORM FIELDS */}
          <View style={styles.form}>
            <InputField
              label="Bank Name"
              icon="home"
              placeholder="e.g. HDFC Bank"
              value={bankData.bankName}
              onChangeText={(txt: string) =>
                setBankData({ ...bankData, bankName: txt })
              }
            />

            <InputField
              label="IFSC Code"
              icon="hash"
              placeholder="HDFC0001234"
              value={bankData.ifsc}
              onChangeText={(txt: string) =>
                setBankData({ ...bankData, ifsc: txt })
              }
            />

            <InputField
              label="Branch Name"
              icon="map-pin"
              placeholder="e.g. Downtown Branch"
              value={bankData.branch}
              onChangeText={(txt: string) =>
                setBankData({ ...bankData, branch: txt })
              }
            />

            <InputField
              label="Account Number"
              icon="credit-card"
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              value={bankData.accountNumber}
              onChangeText={(txt: string) =>
                setBankData({ ...bankData, accountNumber: txt })
              }
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.inputWrapper, styles.textArea]}
                placeholder="Additional instructions..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={bankData.notes}
                onChangeText={(txt: string) =>
                  setBankData({ ...bankData, notes: txt })
                }
              />
            </View>
          </View>

          {/* UPDATE BUTTON */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => console.log('Update Bank:', bankData)}
            style={styles.btnWrapper}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary || '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <Text style={styles.submitText}>Update Details</Text>
              <Feather name="save" size={18} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 25,
  },
  securityTitle: { fontSize: 14, fontWeight: '800', color: '#065F46' },
  securitySub: { fontSize: 12, color: '#047857', marginTop: 2, lineHeight: 16 },
  form: { gap: 20 },
  inputContainer: { width: '100%' },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  iconBox: { width: 32, alignItems: 'center' },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  btnWrapper: {
    marginTop: 40,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
