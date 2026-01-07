import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  ScrollView, // ⬅️ Added missing ScrollView import
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Animated, { FadeInDown } from 'react-native-reanimated';

import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import colors from '@/theme/colors';

import { fetchOrderHistoryThunk } from '@/features/orderhistory/orderhistoryThunk';
import { RootState, AppDispatch } from '@/app/store';
import {
  OrderHistoryOrder,
  OrderItem,
} from '@/features/orderhistory/orderhistoryTypes';

type FilterStatus = 'ALL' | 'WON' | 'LOST' | 'PENDING';
const LIMIT = 10;

export default function OrderHistoryScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { list, loading, pagination, error } = useSelector(
    (state: RootState) => state.orderHistory,
  );

  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const loadOrders = useCallback(
    async (pageNum: number) => {
      await dispatch(fetchOrderHistoryThunk({ page: pageNum, limit: LIMIT }));
    },
    [dispatch],
  );

  useEffect(() => {
    loadOrders(1);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadOrders(1);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (loading || isMoreLoading) return;
    if (!pagination || page >= pagination.last_page) return;
    if (activeFilter !== 'ALL' || searchText) return;

    const next = page + 1;
    setPage(next);
    setIsMoreLoading(true);

    dispatch(fetchOrderHistoryThunk({ page: next, limit: LIMIT })).finally(() =>
      setIsMoreLoading(false),
    );
  };

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'ALL' && !searchText) return list;

    return list.filter(order =>
      order.items.some(item => {
        const providerMatch = item.provider
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const statusMatch =
          activeFilter === 'ALL' ||
          (activeFilter === 'WON' && item.win_status === 'won') ||
          (activeFilter === 'LOST' && item.win_status === 'lost') ||
          (activeFilter === 'PENDING' && item.win_status === null);

        return providerMatch && statusMatch;
      }),
    );
  }, [list, searchText, activeFilter]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const getStatusUI = (status: OrderItem['win_status']) => {
    if (status === 'won')
      return { label: 'WON', bg: '#DCFCE7', color: '#166534', icon: 'stars' };
    if (status === 'lost')
      return { label: 'LOST', bg: '#FEE2E2', color: '#991B1B', icon: 'cancel' };
    return {
      label: 'PENDING',
      bg: '#FEF3C7',
      color: '#92400E',
      icon: 'pending',
    };
  };

  const renderOrder = ({
    item,
    index,
  }: {
    item: OrderHistoryOrder;
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{formatDate(item.order_date)}</Text>
          </View>
          <Text style={styles.orderId}>#ORD-{item.order_id}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalValue}>₹{item.total_amount}</Text>
        </View>
      </View>

      <View style={styles.dashedContainer}>
        <View style={styles.sideNotchLeft} />
        <View style={styles.dashLine} />
        <View style={styles.sideNotchRight} />
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((bet, idx) => {
          const status = getStatusUI(bet.win_status);
          return (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemMeta}>
                <View style={styles.providerBox}>
                  <Text style={styles.providerName}>{bet.provider}</Text>
                  <Text style={styles.slotTime}>{bet.slot_time}</Text>
                </View>
                <View style={styles.digitInfo}>
                  <Text style={styles.digitType}>{bet.digit_type}</Text>
                  <Text style={styles.digitValue}>{bet.entered_digit}</Text>
                </View>
              </View>

              <View style={styles.itemAction}>
                <View
                  style={[styles.statusBadge, { backgroundColor: status.bg }]}
                >
                  <MaterialIcons
                    name={status.icon}
                    size={12}
                    color={status.color}
                  />
                  <Text style={[styles.statusLabel, { color: status.color }]}>
                    {status.label}
                  </Text>
                </View>
                {bet.win_status === 'won' ? (
                  <Text style={styles.winText}>+₹{bet.win_amount}</Text>
                ) : (
                  <Text style={styles.costText}>₹{bet.amount}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.walletInfo}>
          <Feather name="layers" size={12} color="#64748B" />
          <Text style={styles.footerText}>
            Wallet: ₹{item.opening_balance} → ₹{item.closing_balance}
          </Text>
        </View>
        {parseFloat(item.bonus_opening_balance) > 0 && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>
              Bonus Used: ₹{item.bonus_opening_balance}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <ScreenContainer style={{ backgroundColor: '#F1F5F9' }}>
      <StatusBar barStyle="dark-content" />
      <CommonHeader title="Order History" showBack />

      <View style={styles.stickyHeader}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search provider..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {(['ALL', 'WON', 'LOST', 'PENDING'] as FilterStatus[]).map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setActiveFilter(s)}
              style={[
                styles.filterChip,
                activeFilter === s && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  activeFilter === s && styles.filterLabelActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && page === 1 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => String(item.order_id)}
          renderItem={renderOrder}
          contentContainerStyle={styles.listPadding}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="file-text" size={40} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No Orders Found</Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    height: 45,
    marginLeft: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  filterScroll: { marginTop: 12, paddingLeft: 16 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: colors.primary },
  filterLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  filterLabelActive: { color: '#FFF' },
  listPadding: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  headerLeft: { gap: 4 },
  dateBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  dateText: { fontSize: 11, fontWeight: '800', color: '#475569' },
  orderId: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  headerRight: { alignItems: 'flex-end' },
  totalLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  totalValue: { fontSize: 20, fontWeight: '900', color: colors.primary },
  dashedContainer: { flexDirection: 'row', alignItems: 'center', height: 20 },
  sideNotchLeft: {
    width: 10,
    height: 20,
    backgroundColor: '#F1F5F9',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  sideNotchRight: {
    width: 10,
    height: 20,
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  itemsContainer: { padding: 16, gap: 12 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
  },
  itemMeta: { flex: 1, gap: 4 },
  providerBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  providerName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  slotTime: { fontSize: 11, color: '#64748B' },
  digitInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  digitType: { fontSize: 12, color: '#94A3B8' },
  digitValue: { fontSize: 12, color: colors.primary, fontWeight: '800' },
  itemAction: { alignItems: 'flex-end', gap: 6 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  statusLabel: { fontSize: 10, fontWeight: '900' },
  winText: { fontSize: 14, fontWeight: '900', color: '#16A34A' },
  costText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  cardFooter: {
    flexDirection: 'column', // Stack vertically
    alignItems: 'flex-start', // Align to the left
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8, // Adds spacing between the wallet and bonus rows
  },
  walletInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  footerText: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  bonusBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  bonusText: { fontSize: 10, fontWeight: '700', color: '#7C3AED' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 100, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#94A3B8' },
});
