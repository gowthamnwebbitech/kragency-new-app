import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';

const { width } = Dimensions.get('window');

// Data matches your input precisely
const TRANSACTIONS = [
  { id: '1', date: '2025-12-18T15:19:00', desc: 'wee deposit credited to your wallet via UPI', amount: 1000.00, type: 'deposit' },
  { id: '2', date: '2025-12-18T15:04:00', desc: 'Check status for the manual verification', amount: 500.00, type: 'deposit' },
  { id: '3', date: '2025-12-15T04:33:00', desc: 'Withdraw approved by admin. Amount sent to registered bank.', amount: 500.00, type: 'withdrawal' },
  { id: '4', date: '2025-12-06T22:10:00', desc: 'Winning for order item #2524. Congratulations on your win!', amount: 50.00, type: 'winning' },
  { id: '5', date: '2025-12-02T22:11:00', desc: 'Winning for order item #373. Congrats!', amount: 50.00, type: 'winning' },
  { id: '6', date: '2025-11-30T22:12:00', desc: 'Winning for order item #196', amount: 50.00, type: 'winning' },
  { id: '7', date: '2025-11-28T22:10:00', desc: 'Winning for order item #96. Great job!', amount: 50.00, type: 'winning' },
  { id: '8', date: '2025-11-28T17:38:00', desc: 'Manual Credit added by support team for account correction', amount: 550.00, type: 'deposit' },
];

export default function PaymentHistoryScreen({ navigation }: any) {
  
  const getIconData = (type: string) => {
    switch (type) {
      case 'winning': 
        return { name: 'award', color: '#10B981', bg: '#F0FDF4' };
      case 'withdrawal': 
        return { name: 'external-link', color: '#64748B', bg: '#F8FAFC' };
      default: 
        return { name: 'plus-circle', color: colors.primary, bg: '#FFF1F2' };
    }
  };

  const renderItem = ({ item }: { item: typeof TRANSACTIONS[0] }) => {
    const iconData = getIconData(item.type);
    const dateObj = new Date(item.date);
    const isNegative = item.type === 'withdrawal';
    
    return (
      <View style={styles.transactionCard}>
        {/* Left Icon Area */}
        <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
          <Feather name={iconData.name as any} size={18} color={iconData.color} />
        </View>

        {/* Middle Content Area (Two Lines Supported) */}
        <View style={styles.textContainer}>
          <Text style={styles.description} numberOfLines={2}>
            {item.desc}
          </Text>
          <Text style={styles.dateText}>
            {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Right Amount Area */}
        <View style={styles.amountContainer}>
          <Text style={[
            styles.amountValue, 
            { color: isNegative ? '#0F172A' : '#10B981' }
          ]}>
            {isNegative ? '-' : '+'}₹{item.amount.toFixed(0)}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: iconData.bg }]}>
             <Text style={[styles.statusLabel, { color: iconData.color }]}>{item.type}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <CommonHeader
        title="Transaction History"
        showBack
        showCart={false}
        showWallet={false}  
        walletAmount="2,450"
        onBackPress={() => navigation.goBack()}
      />

      {/* Hero Balance Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroLabel}>Total Balance</Text>
        <Text style={styles.heroAmount}>2,450.00</Text>
        <View style={styles.verifiedBadge}>
           <Feather name="shield" size={10} color="#10B981" />
           <Text style={styles.verifiedText}>Secured Wallet</Text>
        </View>
      </View>

      <FlatList
        data={TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.listHeader}>Recent Statements</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 8,
    borderBottomColor: '#F8FAFC',
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 25,
    marginBottom: 15,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Important for 2-line alignment
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  description: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 20, // Better readability for 2 lines
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  statusPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});