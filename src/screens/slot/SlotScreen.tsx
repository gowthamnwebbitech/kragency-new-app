import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ActivityIndicator,
  Platform,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { RootState, AppDispatch } from '@/app/store';
import { fetchSlots, fetchGames } from '@/features/playNow/playNowThunk';
import { clearGames } from '@/features/playNow/playNowSlice';
import { SlotUI } from '@/features/playNow/playNowTypes';

const { width } = Dimensions.get('window');
const SPACING = 12;
const CARD_WIDTH = (width - 40 - SPACING) / 2;

/* ================= SKELETON COMPONENT ================= */
const SkeletonPart = ({ style }: { style: any }) => {
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

const SlotSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <SkeletonPart style={styles.skeletonHeader} />
    <View style={styles.skeletonGrid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonCardTop}>
            <SkeletonPart style={styles.skeletonCircle} />
            <SkeletonPart style={styles.skeletonSmallBar} />
          </View>
          <SkeletonPart style={styles.skeletonIcon} />
          <SkeletonPart style={styles.skeletonTimeBar} />
        </View>
      ))}
    </View>
  </View>
);

/* ================= MAIN SCREEN ================= */
export default function SlotGameScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();

  const providerId: number = route.params?.providerId;
  const { slots, slotsLoading } = useSelector((state: RootState) => state.playNow);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Added Loading State
  const slideUp = useRef(new Animated.Value(150)).current;

  const slotsSafe = Array.isArray(slots) ? slots : [];

  useEffect(() => {
    if (providerId) dispatch(fetchSlots(providerId));
  }, [providerId, dispatch]);

  useEffect(() => {
    const firstActive = slotsSafe.find((s) => s.status === 'active');
    if (firstActive) setSelectedSlotId(firstActive.slot_time_id);
  }, [slotsSafe]);

  useEffect(() => {
    Animated.spring(slideUp, {
      toValue: selectedSlotId ? 0 : 150,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [selectedSlotId, slideUp]);

  const handleSlotPress = (slot: SlotUI) => {
    if (!isAuthenticated) return navigation.navigate('Login');
    if (slot.status !== 'active') return;
    setSelectedSlotId(slot.slot_time_id);
  };

  const handleContinue = async () => {
    if (!selectedSlotId || isSubmitting) return;
    
    setIsSubmitting(true); // ✅ Start loading
    try {
      dispatch(clearGames());
      await dispatch(fetchGames({ providerId, slotTimeId: selectedSlotId })).unwrap();
      navigation.navigate('GameScreen');
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setIsSubmitting(false); // ✅ Stop loading
    }
  };

  const renderSlot = ({ item }: { item: SlotUI }) => {
    const isSelected = selectedSlotId === item.slot_time_id;
    const isActive = item.status === 'active';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleSlotPress(item)}
        style={[styles.card, isSelected && styles.selectedCard, !isActive && styles.lockedCard]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.indicator, isActive ? styles.online : styles.offline]} />
          <Text style={[styles.statusText, isSelected && styles.whiteText]}>
            {isActive ? 'AVAILABLE' : 'LOCKED'}
          </Text>
        </View>

        <Icon
          name={isActive ? 'zap' : 'lock'}
          size={22}
          color={isSelected ? '#FFF' : isActive ? colors.primary : '#94A3B8'}
          style={styles.icon}
        />

        <Text style={[styles.timeText, isSelected && styles.whiteText]}>{item.slot_time}</Text>

        {isSelected && (
          <View style={styles.checkBadge}>
            <Icon name="check" size={10} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <CommonHeader title="Schedule" showBack  />

      {slotsLoading ? (
        <SlotSkeleton />
      ) : (
        <FlatList
          data={slotsSafe}
          keyExtractor={(item) => item.slot_time_id.toString()}
          renderItem={renderSlot}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 130 + insets.bottom },
          ]}
          ListHeaderComponent={
            <View style={styles.headingContainer}>
              <Text style={styles.headerTitle}>Select Your Schedule</Text>
              <Text style={styles.headerSubtitle}>Choose an active slot to begin your session</Text>
            </View>
          }
        />
      )}

      <Animated.View
        style={[
          styles.fabWrapper,
          {
            transform: [{ translateY: slideUp }],
            bottom: 20 + insets.bottom,
          },
        ]}
      >
        <TouchableOpacity 
          onPress={handleContinue} 
          activeOpacity={0.8} 
          disabled={isSubmitting} // ✅ Disable while loading
        >
          <LinearGradient
            colors={[colors.primary, '#9F1239']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fab}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.fabText}>Play Now</Text>
                <Icon name="arrow-right" size={18} color="#FFF" style={styles.fabIcon} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  /* SHARED BACKGROUND */
  mainContainer: { backgroundColor: '#F8FAFC' },

  /* SKELETON */
  skeletonContainer: { padding: 20 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  skeletonBase: { backgroundColor: '#E2E8F0', borderRadius: 4 },
  skeletonHeader: { width: '60%', height: 28, marginBottom: 25, borderRadius: 8 },
  skeletonCard: { width: CARD_WIDTH, height: 130, backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: SPACING, alignItems: 'center' },
  skeletonCardTop: { flexDirection: 'row', alignSelf: 'flex-start', marginBottom: 12 },
  skeletonCircle: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  skeletonSmallBar: { width: 60, height: 8, borderRadius: 4 },
  skeletonIcon: { width: 24, height: 24, borderRadius: 12, marginVertical: 12 },
  skeletonTimeBar: { width: '80%', height: 16, borderRadius: 4 },

  /* LIST LAYOUT */
  listContent: { padding: 20 },
  columnWrapper: { justifyContent: 'space-between' },
  headingContainer: { marginBottom: 25 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: '500' },

  /* CARDS */
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: SPACING,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 },
    }),
  },
  selectedCard: { 
    backgroundColor: colors.primary, 
    borderColor: colors.primary, 
    elevation: 8, 
    shadowColor: colors.primary, 
    shadowOpacity: 0.3, 
    shadowRadius: 12 
  },
  lockedCard: { opacity: 0.6, backgroundColor: '#F1F5F9', borderStyle: 'dashed' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 12 },
  indicator: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  online: { backgroundColor: '#10B981' },
  offline: { backgroundColor: '#94A3B8' },
  statusText: { fontSize: 9, fontWeight: '700', color: '#64748B', letterSpacing: 0.5 },
  icon: { marginBottom: 8 },
  timeText: { fontSize: 16, fontWeight: '800', color: '#334155' },
  whiteText: { color: '#FFF' },
  checkBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FFF', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowOpacity: 0.1 },

  /* FAB */
  fabWrapper: { position: 'absolute', left: 20, right: 20 },
  fab: {
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  fabText: { color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
  fabIcon: { marginLeft: 8 },
});