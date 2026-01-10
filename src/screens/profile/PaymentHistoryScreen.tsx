import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ReAnimated, { FadeInDown } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import colors from '@/theme/colors';

import { fetchPaymentHistoryThunk } from '@/features/paymentHistory/paymentHistoryThunk';
import { RootState, AppDispatch } from '@/app/store';
import { PaymentHistoryItem } from '@/features/paymentHistory/paymentHistoryTypes';

const LIMIT = 15;

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

const TransactionSkeleton = () => (
  <View style={styles.listContent}>
    <Skeleton style={{ width: 120, height: 14, marginBottom: 20, marginTop: 10, borderRadius: 4 }} />
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <View key={i} style={styles.card}>
        <Skeleton style={styles.iconWrapper} />
        <View style={styles.content}>
          <Skeleton style={{ width: '60%', height: 16, borderRadius: 4, marginBottom: 8 }} />
          <Skeleton style={{ width: '40%', height: 12, borderRadius: 4 }} />
        </View>
        <View style={styles.amountSide}>
          <Skeleton style={{ width: 60, height: 16, borderRadius: 4, marginBottom: 6 }} />
          <Skeleton style={{ width: 40, height: 10, borderRadius: 4 }} />
        </View>
      </View>
    ))}
  </View>
);

/* ================= MAIN COMPONENT ================= */
export default function PaymentHistoryScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();

  const { list, loading, pagination } = useSelector(
    (state: RootState) => state.paymentHistory,
  );

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  /* ================= LOAD DATA ================= */
  const loadData = useCallback(
    async (pageNum: number) => {
      await dispatch(fetchPaymentHistoryThunk({ page: pageNum, limit: LIMIT }));
    },
    [dispatch],
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  /* ================= REFRESH ================= */
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await loadData(1);
    setRefreshing(false);
  };

  /* ================= PAGINATION ================= */
  const handleLoadMore = () => {
    if (loading || isMoreLoading) return;
    if (!pagination || page >= pagination.last_page) return;

    const next = page + 1;
    setPage(next);
    setIsMoreLoading(true);

    dispatch(fetchPaymentHistoryThunk({ page: next, limit: LIMIT })).finally(
      () => setIsMoreLoading(false),
    );
  };

  /* ================= HELPERS ================= */
  const getTransactionUI = (item: PaymentHistoryItem) => {
    const type = item.type?.toLowerCase();
    const isDebit = type === 'debit' || type === 'withdrawal';
    const isWinning = item.description?.toLowerCase().includes('winning');

    if (isDebit) {
      return {
        icon: 'arrow-up-right',
        color: '#EF4444',
        bg: '#FEF2F2',
        sign: '-',
      };
    }
    if (isWinning) {
      return {
        icon: 'trello',
        color: '#10B981',
        bg: '#ECFDF5',
        sign: '+',
      };
    }
    return {
      icon: 'arrow-down-left',
      color: '#3B82F6',
      bg: '#EFF6FF',
      sign: '+',
    };
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const date = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { date, time };
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = ({
    item,
    index,
  }: {
    item: PaymentHistoryItem;
    index: number;
  }) => {
    const ui = getTransactionUI(item);
    const { date, time } = formatDate(item.date);
    const isDebit = ui.sign === '-';

    return (
      <ReAnimated.View
        entering={FadeInDown.delay(index * 30).springify()}
        style={styles.card}
      >
        <View style={[styles.iconWrapper, { backgroundColor: ui.bg }]}>
          <Feather name={ui.icon as any} size={18} color={ui.color} />
        </View>

        <View style={styles.content}>
          <Text style={styles.desc} numberOfLines={1}>
            {item.description || 'General Transaction'}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{date}</Text>
            <View style={styles.dotDivider} />
            <Text style={styles.metaText}>{time}</Text>
          </View>
        </View>

        <View style={styles.amountSide}>
          <Text
            style={[
              styles.amountText,
              { color: isDebit ? '#0F172A' : '#10B981' },
            ]}
          >
            {ui.sign}₹{Math.abs(Number(item.amount)).toLocaleString('en-IN')}
          </Text>
          <Text style={[styles.typeLabel, { color: ui.color }]}>
            {item.type?.toUpperCase()}
          </Text>
        </View>
      </ReAnimated.View>
    );
  };

  return (
    <ScreenContainer style={{ backgroundColor: '#FFFFFF' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <CommonHeader
        title="Payment History"
        showBack
        showCart={false}
        showWallet={false}
      />

      {loading && page === 1 ? (
        <TransactionSkeleton />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item, index) => `tx-${item.id || index}`}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(insets.bottom, 20) + 20 }
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            list.length > 0 ? <Text style={styles.sectionHeader}>Recent Activity</Text> : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isMoreLoading ? (
              <ActivityIndicator
                style={{ marginVertical: 20 }}
                color={colors.primary}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyCircle}>
                <Feather name="list" size={30} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyText}>No Transactions Yet</Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  /* SKELETON */
  skeletonBase: {
    backgroundColor: '#F1F5F9',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  desc: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  dotDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  amountSide: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
  },
  typeLabel: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
});