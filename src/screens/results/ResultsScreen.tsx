import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchDrawResultsThunk } from '@/features/drawResult/drawResultThunk';
import { DrawResult } from '@/features/drawResult/drawResultTypes';

const PAGE_SIZE = 12;

export default function DrawResultsScreen() {
  const dispatch = useAppDispatch();

  const { list, loading } = useAppSelector(state => state.drawResults);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    dispatch(fetchDrawResultsThunk());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await dispatch(fetchDrawResultsThunk());
    setRefreshing(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredData = useMemo(() => {
    return list.filter(item =>
      item.providerName.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [list, debouncedSearch]);

  const visibleData = useMemo(() => {
    return filteredData.slice(0, page * PAGE_SIZE);
  }, [filteredData, page]);

  const handleLoadMore = () => {
    if (page * PAGE_SIZE < filteredData.length) {
      setPage(prev => prev + 1);
    }
  };

  const renderItem = ({ item, index }: { item: DrawResult; index: number }) => {
    const isPending = !item.drawResult;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 30).duration(400)}
        style={styles.card}
      >
        {/* LEFT: Game Info */}
        <View style={styles.cardLeft}>
          <Text style={styles.providerName} numberOfLines={1}>
            {item.providerName}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.timeBadge}>
              <Feather name="clock" size={10} color="#64748B" />
              <Text style={styles.timeText}>{item.drawTime}</Text>
            </View>
            {isPending && (
              <View style={styles.liveIndicator}>
                <View style={styles.dot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>
        </View>

        {/* RIGHT: Result Container (Perfectly Centered) */}
        <View style={styles.cardRight}>
          <Animated.View
            entering={FadeInRight.delay(index * 50)}
            style={styles.resultWrapper}
          >
            <View
              style={[
                styles.resultCircle,
                isPending ? styles.pendingCircle : styles.winCircle,
              ]}
            >
              <Text
                style={[
                  styles.resultText,
                  isPending ? styles.pendingText : styles.winText,
                ]}
              >
                {item.drawResult ?? '--'}
              </Text>
            </View>
            {!isPending && (
              <View style={styles.checkIcon}>
                <MaterialIcons name="check-circle" size={16} color="#16A34A" />
              </View>
            )}
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScreenContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <CommonHeader
        title="Draw Results"
        showBack
        showWallet={false}
        // showCart={false}
      />
      <View style={styles.container}>
        {/* SEARCH SECTION */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchInner}>
            <Feather name="search" size={18} color="#94A3B8" />
            <TextInput
              placeholder="Search game..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Feather name="x-circle" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* HEADER LABELS */}
        <View style={styles.listHeader}>
          <Text style={[styles.headerLabel, { flex: 1 }]}>Game Detail</Text>
          <Text
            style={[styles.headerLabel, { width: 70, textAlign: 'center' }]}
          >
            Result
          </Text>
        </View>

        {loading && list.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Syncing results...</Text>
          </View>
        ) : (
          <FlatList
            data={visibleData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather name="search" size={40} color="#CBD5E1" />
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  listHeader: {
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listPadding: { paddingHorizontal: 16, paddingBottom: 40 },

  /* UPDATED CARD LAYOUT */
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Slight shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 1 },
    }),
  },
  cardLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  cardRight: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  timeText: { fontSize: 10, color: '#64748B', fontWeight: '700' },

  /* STATUSES */
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F97316' },
  liveText: { fontSize: 9, fontWeight: '900', color: '#F97316' },

  /* RESULT SQUIRCLE - Fixed Alignment */
  resultWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  winCircle: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
  },
  pendingCircle: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderStyle: 'dashed',
  },
  resultText: { fontSize: 18, fontWeight: '900' },
  winText: { color: '#16A34A' },
  pendingText: { color: '#F97316' },
  checkIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    zIndex: 1,
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: {
    marginTop: 10,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
});
