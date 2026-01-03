import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';

const RESULTS = [
  { id: '1', game: 'Mega Jackpot', date: '12 Jan 2025', amount: '₹12,50,000' },
  { id: '2', game: 'Super Draw', date: '11 Jan 2025', amount: '₹8,20,000' },
  { id: '3', game: 'Daily Pick', date: '10 Jan 2025', amount: '₹1,50,000' },
  { id: '4', game: 'Lucky Win', date: '09 Jan 2025', amount: '₹3,00,000' },
  { id: '5', game: 'Fast Cash', date: '08 Jan 2025', amount: '₹95,000' },
  { id: '6', game: 'Mega Jackpot', date: '07 Jan 2025', amount: '₹7,40,000' },
  { id: '7', game: 'Super Draw', date: '06 Jan 2025', amount: '₹6,10,000' },
];

const PAGE_SIZE = 5;
const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  const filteredData = useMemo(() => {
    return RESULTS.filter(item =>
      item.game.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [debouncedSearch]);

  const visibleData = useMemo(() => {
    return filteredData.slice(0, page * PAGE_SIZE);
  }, [filteredData, page]);

  const loadMore = () => {
    if (page * PAGE_SIZE < filteredData.length) setPage(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <CommonHeader
        title="Results"
        showBack
        walletAmount="2,450"
        showCart={false}
        onBackPress={() => navigation.goBack()}
      />

      {/* CONTENT WRAPPER */}
      <View style={styles.contentWrapper}>
        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color={colors.placeholder} />
          <TextInput
            placeholder="Search game"
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* LIST HEADER */}
        <View style={styles.listHeader}>
          <Text style={styles.headerTitle}>Game Results</Text>
          <Text style={styles.headerAmount}>Winning Amount</Text>
        </View>

        {/* RESULTS LIST */}
        <FlatList
          data={visibleData}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.left}>
                <Text style={styles.gameText} numberOfLines={1}>
                  {item.game}
                </Text>
                <View style={styles.dateRow}>
                  <Feather name="calendar" size={12} color={colors.textLight} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>
              <Text style={styles.amountText}>{item.amount}</Text>
            </View>
          )}
          ListFooterComponent={
            page * PAGE_SIZE < filteredData.length ? (
              <TouchableOpacity style={styles.loadMore} onPress={loadMore}>
                <Text style={styles.loadMoreText}>Load more</Text>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No results found</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    height: 40,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  headerAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  left: { flex: 1 },
  gameText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.textLight,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  loadMore: {
    alignSelf: 'center',
    marginTop: 22,
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textLight,
    fontSize: 16,
  },
});
