import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';


// Types
type FilterStatus = 'ALL' | 'WON' | 'PENDING';

interface Order {
  id: number;
  orderDate: string;
  provider: string;
  time: string;
  digit: string;
  enteredDigit: string | number;
  quantity: number;
  price: number;
  winningStatus: number;
}

const ORDERS: Order[] = [
  { id: 1, orderDate: '2025-12-19T08:56:00', provider: '4D JACKPOT', time: '10:00 AM', digit: 'A', enteredDigit: 1, quantity: 1, price: 11, winningStatus: 0 },
  { id: 3, orderDate: '2025-12-19T08:56:00', provider: '4D JACKPOT', time: '10:00 AM', digit: 'A', enteredDigit: 1, quantity: 2, price: 22, winningStatus: 1 },
  { id: 21, orderDate: '2025-12-03T07:10:00', provider: 'KERALA', time: '03:00 PM', digit: 'BC', enteredDigit: 15, quantity: 1, price: 12, winningStatus: 0 },
  { id: 26, orderDate: '2025-12-01T07:10:00', provider: 'KERALA', time: '03:00 PM', digit: 'BC', enteredDigit: 34, quantity: 1, price: 12, winningStatus: 1 },
];

export default function OrderHistoryScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');

  // Logic: Filter orders based on Search AND Status Tab
  const filteredOrders = ORDERS.filter(order => {
    const matchesSearch = order.provider.toLowerCase().includes(searchText.toLowerCase());
    const isWon = order.winningStatus > 0;

    if (activeFilter === 'WON') return matchesSearch && isWon;
    if (activeFilter === 'PENDING') return matchesSearch && !isWon;
    return matchesSearch;
  });

  const renderOrder = ({ item }: { item: Order }) => {
    const isWon = item.winningStatus > 0;

    return (
      <View style={styles.cardContainer}>
        {/* Visual Status Indicator */}
        <View style={[styles.statusAccent, { backgroundColor: isWon ? '#10B981' : '#FBBF24' }]} />
        
        <View style={styles.cardInner}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.providerName}>{item.provider}</Text>
              <Text style={styles.orderIdText}>ID: #{item.id}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <Text style={styles.priceAmount}>{item.price.toFixed(0)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Feather name="calendar" size={12} color={colors.textLight} />
              <Text style={styles.detailValue}>
                {new Date(item.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="clock" size={12} color={colors.textLight} />
              <Text style={styles.detailValue}>{item.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="layers" size={12} color={colors.textLight} />
              <Text style={styles.detailValue}>
                {item.digit}: <Text style={{ fontWeight: '900', color: colors.text }}>{item.enteredDigit}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
             <View style={[styles.badge, { backgroundColor: isWon ? '#ECFDF5' : '#FFFBEB' }]}>
                <View style={[styles.dot, { backgroundColor: isWon ? '#10B981' : '#FBBF24' }]} />
                <Text style={[styles.badgeText, { color: isWon ? '#059669' : '#D97706' }]}>
                  {isWon ? 'Winning Result' : 'Pending Result'}
                </Text>
             </View>
             
             <TouchableOpacity 
                activeOpacity={0.7}
                style={styles.reorderBtn}
                onPress={() => console.log('Reorder clicked')}
             >
                <Feather name="repeat" size={14} color={colors.primary} />
                <Text style={styles.reorderText}>Play Again</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <CommonHeader
        title="My Play History"
        showBack
         showCart={false}
         showWallet={false}  
        walletAmount="2,450"
        onBackPress={() => navigation.goBack()}
      />

      {/* Header Controls */}
      <View style={styles.headerControls}>
        <View style={styles.searchWrapper}>
          <Feather name="search" size={18} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search game or provider..."
            placeholderTextColor={colors.placeholder}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        {/* Filters */}
        <View style={styles.filterRow}>
          {(['ALL', 'WON', 'PENDING'] as FilterStatus[]).map((status) => (
            <TouchableOpacity 
              key={status}
              onPress={() => setActiveFilter(status)}
              style={[
                styles.filterBtn, 
                activeFilter === status && styles.filterBtnActive
              ]}
            >
              <Text style={[
                styles.filterText, 
                activeFilter === status && styles.filterTextActive
              ]}>
                {status === 'ALL' ? 'All History' : status.charAt(0) + status.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Feather name="clipboard" size={40} color={colors.disabled} />
            </View>
            <Text style={styles.emptyTitle}>No Records Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search term</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  headerControls: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 15,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 15, 
    color: colors.text,
    fontWeight: '500' 
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: colors.textLight 
  },
  filterTextActive: { 
    color: '#FFFFFF' 
  },
  listContent: { 
    padding: 20,
    paddingBottom: 40 
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 1,
      },
    }),
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statusAccent: {
    width: 5,
    height: '100%',
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderIdText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 2,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFF1F2',
  },
  reorderText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});