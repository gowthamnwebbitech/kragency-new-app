import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';

export default function WithdrawScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const walletBalance = 769.00;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER: Hiding wallet and cart for focus */}
      <CommonHeader 
        title="Withdraw Funds" 
        showBack 
        showWallet={false} 
        showCart={false} 
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          
          {/* CREATIVE BALANCE CARD */}
          <LinearGradient
            colors={[colors.primary, colors.secondary || '#4F46E5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View>
              <Text style={styles.cardLabel}>Available Balance</Text>
              <Text style={styles.cardBalance}>₹{walletBalance.toFixed(2)}</Text>
            </View>
            <View style={styles.cardCircle} />
          </LinearGradient>

          {/* INPUT SECTION */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Withdraw Amount</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#CBD5E1"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>

            <View style={styles.infoBox}>
              <Feather name="info" size={14} color="#64748B" />
              <Text style={styles.infoText}>
                Min withdrawal: <Text style={styles.boldText}>₹500</Text> • 1 request per 24h
              </Text>
            </View>
          </View>

          {/* QUICK SELECT CHIPS */}
          <View style={styles.chipContainer}>
            {[500, 1000, 2000, 5000].map((val) => (
              <TouchableOpacity 
                key={val} 
                style={styles.chip}
                onPress={() => setAmount(val.toString())}
              >
                <Text style={styles.chipText}>+₹{val}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flex: 1 }} />

          {/* SUBMIT BUTTON */}
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => console.log('Withdraw:', amount)}
            style={styles.submitBtnWrapper}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary || '#4F46E5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <Text style={styles.submitText}>Submit Request</Text>
              <Feather name="arrow-right" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 30,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  cardCircle: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: '400',
    color: '#1E293B',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 40,
    fontWeight: '800',
    color: '#0F172A',
    padding: 0,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  boldText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  submitBtnWrapper: {
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});