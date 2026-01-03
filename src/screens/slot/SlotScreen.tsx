import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useNavigation } from '@react-navigation/native';

// Professional Colors from your theme
import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 56) / 2;

interface Slot {
  time: string;
  status: 'closed' | 'active';
}

const SLOTS: Slot[] = [
  { time: '10:00 AM', status: 'closed' },
  { time: '11:00 AM', status: 'closed' },
  { time: '12:00 PM', status: 'closed' },
  { time: '01:00 PM', status: 'closed' },
  { time: '02:00 PM', status: 'active' },
  { time: '03:00 PM', status: 'active' },
  { time: '04:00 PM', status: 'active' },
  { time: '05:00 PM', status: 'active' },
  { time: '06:00 PM', status: 'active' },
  { time: '07:00 PM', status: 'active' },
];

export default function SlotGameScreen() {
  const navigation = useNavigation();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const animatedScales = useRef(
    SLOTS.reduce((acc, slot) => {
      acc[slot.time] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  useEffect(() => {
    const firstActive = SLOTS.find(slot => slot.status === 'active');
    if (firstActive) setSelectedSlot(firstActive.time);
  }, []);

  const handleSlotPress = (slot: Slot) => {
    if (!isAuthenticated) {
      navigation.navigate('Login' as never);
      return;
    }
    if (slot.status === 'active') {
      Animated.sequence([
        Animated.timing(animatedScales[slot.time], { toValue: 0.96, duration: 100, useNativeDriver: true }),
        Animated.spring(animatedScales[slot.time], { toValue: 1, friction: 4, useNativeDriver: true })
      ]).start();
      setSelectedSlot(slot.time);
    }
  };

  const renderSlot = ({ item }: { item: Slot }) => {
    const isSelected = selectedSlot === item.time;
    const isActive = item.status === 'active';

    return (
      <TouchableOpacity
        activeOpacity={isActive ? 0.8 : 1}
        onPress={() => handleSlotPress(item)}
        style={styles.cardWrapper}
      >
        <Animated.View style={{ transform: [{ scale: animatedScales[item.time] }] }}>
          <View style={[
            styles.slotCard,
            { backgroundColor: colors.card },
            isActive && styles.activeCardShadow,
            isSelected && { borderColor: colors.primary, borderWidth: 2 },
            !isActive && styles.lockedCard
          ]}>
            
            <View style={[
                styles.statusPill, 
                { backgroundColor: isActive ? (isSelected ? colors.primary : colors.secondary + '15') : '#E2E8F0' }
            ]}>
              <Feather 
                name={isActive ? "play" : "lock"} 
                size={10} 
                color={isActive ? (isSelected ? '#FFF' : colors.primary) : '#94A3B8'} 
              />
              <Text style={[
                styles.statusText, 
                { color: isActive ? (isSelected ? '#FFF' : colors.primary) : '#64748B' }
              ]}>
                {isActive ? 'ACTIVE' : 'CLOSED'}
              </Text>
            </View>

            <Text style={[styles.slotTime, { color: isSelected ? colors.primary : colors.text }]}>
              {item.time}
            </Text>

            <Text style={styles.entryText}>{isActive ? 'ENTRY OPEN' : 'ENDED'}</Text>
          </View>
        </Animated.View>
        
        {isSelected && (
            <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                <Feather name="check" size={12} color="#FFF" />
            </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <CommonHeader
        title="Gaming Hub"
        showBack
        walletAmount={isAuthenticated ? '2,450' : 'Login'}
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={SLOTS}
        keyExtractor={item => item.time}
        renderItem={renderSlot}
        numColumns={2}
        ListHeaderComponent={() => (
            <View style={styles.headerArea}>
                {/* Game Name Label */}
                <View style={styles.gameBadge}>
                    <Text style={styles.gameBadgeText}>3D JACKPOT</Text>
                </View>
                
                <View style={styles.scheduleTextContainer}>
                    <Text style={[styles.headerSub, { color: colors.textLight }]}>TODAY'S SCHEDULE</Text>
                    <Text style={[styles.headerMain, { color: colors.text }]}>Choose a Slot</Text>
                </View>
            </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedSlot && (
        <View style={styles.bottomBar}>
            <LinearGradient
                colors={[colors.primary, '#BE123C']}
                style={styles.playBtnGradient}
            >
                <TouchableOpacity style={styles.playBtnTouch}>
                    <Text style={styles.playBtnText}>JOIN {selectedSlot} SLOT</Text>
                    <Feather name="chevron-right" size={20} color="#FFF" />
                </TouchableOpacity>
            </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerArea: {
    paddingHorizontal: 4,
    marginBottom: 20,
    marginTop: 15,
    alignItems: 'flex-start',
  },
  gameBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
    marginBottom: 12,
  },
  gameBadgeText: {
    color: '#E11D48',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scheduleTextContainer: {
    marginLeft: 4,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  headerMain: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: 16,
    marginBottom: 16,
  },
  slotCard: {
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  lockedCard: {
    opacity: 0.5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#E11D48',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 4,
  },
  slotTime: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  entryText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  playBtnGradient: {
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },
  playBtnTouch: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
    letterSpacing: 0.5,
  }
});