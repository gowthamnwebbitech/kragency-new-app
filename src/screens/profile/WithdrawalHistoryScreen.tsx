import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';

// Data based on your uploaded table image
const WITHDRAW_HISTORY = [
  { id: '1', date: '2025-12-19T09:15:00', amount: 500.00, status: 'Pending' },
  { id: '2', date: '2025-12-17T11:38:00', amount: 500.00, status: 'Pending' },
  { id: '3', date: '2025-12-15T04:32:00', amount: 500.00, status: 'Approved' },
  { id: '4', date: '2025-11-29T02:32:00', amount: 50.00, status: 'Rejected' },
];

export default function WithdrawalHistoryScreen({ navigation }: any) {

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return { color: '#10B981', bg: '#ECFDF5', icon: 'check-circle' };
      case 'Rejected':
        return { color: '#EF4444', bg: '#FEF2F2', icon: 'x-circle' };
      default: // Pending
        return { color: '#F59E0B', bg: '#FFFBEB', icon: 'clock' };
    }
  };

  const renderItem = ({ item }: { item: typeof WITHDRAW_HISTORY[0] }) => {
    const statusStyle = getStatusStyles(item.status);
    const dateObj = new Date(item.date);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={14} color="#94A3B8" />
            <Text style={styles.dateText}>
              {dateObj.toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Feather name={statusStyle.icon as any} size={12} color={statusStyle.color} />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View>
            <Text style={styles.amountLabel}>Requested Amount</Text>
            <Text style={styles.amountValue}>₹{item.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <CommonHeader 
        title="Withdrawal History" 
        showBack 
        showWallet={false} 
        showCart={false} 
        onBackPress={() => navigation.goBack()} 
      />

      <FlatList
        data={WITHDRAW_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.summaryInfo}>
            <Text style={styles.totalEntries}>
              Showing {WITHDRAW_HISTORY.length} withdrawal requests
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Very light grey to make white cards pop
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryInfo: {
    marginBottom: 20,
  },
  totalEntries: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  timeContainer: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
});