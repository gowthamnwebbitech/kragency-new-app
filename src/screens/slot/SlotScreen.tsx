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

export default function SlotGameScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets(); // 🛡️ Important for bottom padding

  const providerId: number = route.params?.providerId;
  const { slots, slotsLoading } = useSelector(
    (state: RootState) => state.playNow,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const slideUp = useRef(new Animated.Value(100)).current;

  const slotsSafe = Array.isArray(slots) ? slots : [];

  useEffect(() => {
    if (providerId) dispatch(fetchSlots(providerId));
  }, [providerId, dispatch]);

  useEffect(() => {
    const firstActive = slotsSafe.find(s => s.status === 'active');
    if (firstActive) setSelectedSlotId(firstActive.slot_time_id);
  }, [slotsSafe]);

  useEffect(() => {
    Animated.spring(slideUp, {
      toValue: selectedSlotId ? 0 : 150, // Hide deeper if nothing selected
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
    if (!selectedSlotId) return;
    dispatch(clearGames());
    await dispatch(
      fetchGames({ providerId, slotTimeId: selectedSlotId }),
    ).unwrap();
    navigation.navigate('GameScreen');
  };

  const renderSlot = ({ item }: { item: SlotUI }) => {
    const isSelected = selectedSlotId === item.slot_time_id;
    const isActive = item.status === 'active';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleSlotPress(item)}
        style={[
          styles.card,
          isSelected && styles.selectedCard,
          !isActive && styles.lockedCard,
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.indicator,
              isActive ? styles.online : styles.offline,
            ]}
          />
          <Text style={[styles.statusText, isSelected && { color: '#FFF' }]}>
            {isActive ? 'AVAILABLE' : 'LOCKED'}
          </Text>
        </View>

        <Icon
          name={isActive ? 'zap' : 'lock'}
          size={22}
          color={isSelected ? '#FFF' : isActive ? colors.primary : '#94A3B8'}
          style={styles.icon}
        />

        <Text style={[styles.timeText, isSelected && styles.whiteText]}>
          {item.slot_time}
        </Text>

        {isSelected && (
          <View style={styles.checkBadge}>
            <Icon name="check" size={10} color={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer style={{ backgroundColor: '#FFFFFF' }}>
      {/* ⚪ Solid White Status Bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      
      <CommonHeader title="Gaming Hub" showBack />

      {slotsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={slotsSafe}
          keyExtractor={item => item.slot_time_id.toString()}
          renderItem={renderSlot}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={[
            styles.listContainer,
            // 💡 FIX: Bottom padding clears the FAB + Home Indicator
            { paddingBottom: 130 + insets.bottom } 
          ]}
          ListHeaderComponent={
            <Text style={styles.headerTitle}>Select Your Schedule</Text>
          }
        />
      )}

      {/* 🔘 Confirm Selection FAB */}
      <Animated.View
        style={[
          styles.fabWrapper, 
          { 
            transform: [{ translateY: slideUp }],
            bottom: 20 + insets.bottom // Moves up on gesture-based phones
          }
        ]}
      >
        <TouchableOpacity onPress={handleContinue} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, '#9F1239']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fab}
          >
            <Text style={styles.fabText}>CONFIRM SELECTION</Text>
            <Icon
              name="arrow-right"
              size={18}
              color="#FFF"
              style={{ marginLeft: 8 }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { 
    padding: 20,
    backgroundColor: '#F8FAFC' // Keep content area light grey
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
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
    // Soft Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  lockedCard: {
    opacity: 0.6,
    backgroundColor: '#F1F5F9',
    borderStyle: 'dashed',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  online: { backgroundColor: '#10B981' },
  offline: { backgroundColor: '#94A3B8' },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  icon: { marginBottom: 8 },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#334155',
  },
  whiteText: { color: '#FFF' },
  checkBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFF',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.1,
  },
  fabWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  fab: {
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  fabText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
});