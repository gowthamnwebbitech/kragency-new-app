import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface Slot {
  time: string;
  status: 'closed' | 'active';
}

const SLOTS: Slot[] = [
  { time: '10:00 AM', status: 'closed' },
  { time: '11:00 AM', status: 'closed' },
  { time: '12:00 PM', status: 'closed' },
  { time: '01:00 PM', status: 'closed' },
  { time: '02:00 PM', status: 'closed' },
  { time: '03:00 PM', status: 'closed' },
  { time: '04:00 PM', status: 'active' },
  { time: '05:00 PM', status: 'active' },
  { time: '06:00 PM', status: 'active' },
  { time: '07:00 PM', status: 'active' },
  { time: '08:00 PM', status: 'active' },
];

export default function SlotGameScreen() {
  const navigation = useNavigation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // -------------------------------
  // Hooks (always top-level, same order)
  // -------------------------------
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const animatedScales = useRef(
    SLOTS.reduce((acc, slot) => {
      acc[slot.time] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  const prevSelected = useRef<string | null>(null);

  // -------------------------------
  // Effects
  // -------------------------------
  // Auto-select first active slot on mount
  useEffect(() => {
    const firstActive = SLOTS.find(slot => slot.status === 'active');
    if (firstActive) setSelectedSlot(firstActive.time);
  }, []);

  // Animate only previous & current selected slot
  useEffect(() => {
    if (prevSelected.current) {
      Animated.spring(animatedScales[prevSelected.current], {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }

    if (selectedSlot) {
      Animated.spring(animatedScales[selectedSlot], {
        toValue: 1.08,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }

    prevSelected.current = selectedSlot;
  }, [selectedSlot]);

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleSlotPress = (slot: Slot) => {
    if (!isAuthenticated) {
      navigation.navigate('Login' as never);
      return;
    }

    if (slot.status === 'active') {
      setSelectedSlot(slot.time);
    }
  };

  const renderSlot = ({ item }: { item: Slot }) => {
    const isSelected = selectedSlot === item.time;

    return (
      <TouchableOpacity
        activeOpacity={item.status === 'active' ? 0.8 : 1}
        onPress={() => handleSlotPress(item)}
        style={{ marginBottom: 14 }}
      >
        <Animated.View style={{ transform: [{ scale: animatedScales[item.time] }] }}>
          <LinearGradient
            colors={
              item.status === 'active'
                ? isSelected
                  ? ['#FF6B6B', '#FF3D71']
                  : ['#7A5BFF', '#A24DFF']
                : ['#F2F2F2', '#E0E0E0']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.slotCard,
              { width: CARD_WIDTH },
              item.status === 'closed' && styles.slotCardClosed,
              isSelected && {
                shadowColor: '#FF3D71',
                shadowOpacity: 0.4,
                shadowOffset: { width: 0, height: 6 },
                shadowRadius: 10,
                elevation: 6,
              },
            ]}
          >
            <View style={styles.leftSection}>
              <Feather
                name={item.status === 'active' ? 'unlock' : 'lock'}
                size={18}
                color={item.status === 'active' ? '#FFF' : '#AAA'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.slotTime,
                  item.status === 'closed' && { color: '#777' },
                ]}
              >
                {item.time}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                item.status === 'active'
                  ? isSelected
                    ? { backgroundColor: 'rgba(255,255,255,0.6)' }
                    : { backgroundColor: 'rgba(255,255,255,0.25)' }
                  : { backgroundColor: '#CCC' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.status === 'closed' && { color: '#555' },
                ]}
              >
                {item.status === 'active' ? 'OPEN' : 'CLOSED'}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <CommonHeader
        title="Game Slot"
        showBack
        walletAmount={isAuthenticated ? '₹2,450' : undefined}
        showCart={false}
        onBackPress={() => navigation.goBack()}
      />

      <Text style={styles.title}>3D JACKPOT</Text>

      <FlatList
        data={SLOTS}
        keyExtractor={item => item.time}
        renderItem={renderSlot}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    marginVertical: 18,
  },
  slotCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  slotCardClosed: {
    borderWidth: 1,
    borderColor: '#DDD',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  slotTime: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
});
