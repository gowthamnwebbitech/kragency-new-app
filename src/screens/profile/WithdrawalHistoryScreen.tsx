import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';

import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import colors from '@/theme/colors';
import { AppDispatch, RootState } from '@/app/store';
import { fetchWithdrawHistoryThunk } from '@/features/withdrawHistory/withdrawHistoryThunk';

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

const WithdrawHistorySkeleton = () => (
  <View style={styles.listContent}>
    {[1, 2, 3, 4, 5].map((i) => (
      <View key={i} style={styles.card}>
        <View style={styles.cardHeader}>
          <Skeleton style={styles.skeletonDate} />
          <Skeleton style={styles.skeletonBadge} />
        </View>
        <View style={styles.cardBody}>
          <View>
            <Skeleton style={styles.skeletonLabel} />
            <Skeleton style={styles.skeletonAmount} />
          </View>
          <Skeleton style={styles.skeletonTime} />
        </View>
      </View>
    ))}
  </View>
);

/* ================= MAIN COMPONENT ================= */
export default function WithdrawalHistoryScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();

  const {
    list = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.withdrawHistory);

  /* 🔁 INITIAL LOAD */
  useEffect(() => {
    dispatch(fetchWithdrawHistoryThunk());
  }, [dispatch]);

  /* 🔄 PULL TO REFRESH */
  const onRefresh = useCallback(() => {
    dispatch(fetchWithdrawHistoryThunk());
  }, [dispatch]);

  const getStatusUI = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          label: 'Approved',
          color: colors.success,
          bg: '#ECFDF5',
          icon: 'check-circle',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: colors.error,
          bg: '#FEF2F2',
          icon: 'x-circle',
        };
      default:
        return {
          label: 'Pending',
          color: colors.resultPending,
          bg: '#FFFBEB',
          icon: 'clock',
        };
    }
  };

  const renderItem = ({ item }: any) => {
    const statusUI = getStatusUI(item?.status);
    const dateObj = item?.date ? new Date(item.date.replace(' ', 'T')) : null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={14} color={colors.textLight} />
            <Text style={styles.dateText}>
              {dateObj
                ? dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '--'}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusUI.bg }]}>
            <Feather
              name={statusUI.icon as any}
              size={12}
              color={statusUI.color}
            />
            <Text style={[styles.statusText, { color: statusUI.color }]}>
              {statusUI.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View>
            <Text style={styles.amountLabel}>Requested Amount</Text>
            <Text style={styles.amountValue}>
              ₹{Number(item?.amount ?? 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.timeBox}>
            <Text style={styles.timeText}>
              {dateObj
                ? dateObj.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer style={styles.whiteBg}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <CommonHeader
        title="Withdrawal History"
        showBack
        showCart={false}
        showWallet={false}
      />

      {/* ❌ ERROR */}
      {!loading && error && <Text style={styles.errorText}>{error}</Text>}

      {/* 📄 LIST OR SKELETON */}
      {loading && list.length === 0 ? (
        <WithdrawHistorySkeleton />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            !loading && !error ? (
              <Text style={styles.emptyText}>No withdrawal history found</Text>
            ) : null
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  whiteBg: {
    backgroundColor: '#FFFFFF',
  },
  /* SKELETON STYLES */
  skeletonBase: {
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  skeletonDate: {
    width: 100,
    height: 14,
  },
  skeletonBadge: {
    width: 80,
    height: 22,
    borderRadius: 8,
  },
  skeletonLabel: {
    width: 110,
    height: 12,
    marginBottom: 6,
  },
  skeletonAmount: {
    width: 90,
    height: 24,
  },
  skeletonTime: {
    width: 50,
    height: 18,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },

  /* ACTUAL UI STYLES */
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textLight,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.error,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: colors.text || '#1E293B',
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
  },
  amountLabel: {
    fontSize: 12,
    color: colors.textLight || '#64748B',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text || '#1E293B',
  },
  timeBox: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight || '#64748B',
  },
});