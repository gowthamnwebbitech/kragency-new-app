import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { RootState } from '@/app/store';
import { GameGroup } from '@/features/playNow/playNowTypes';
import { checkWalletApi } from '@/api/playNowApi';
import { addToCart } from '@/features/cart/cartSlice';

type BetData = {
  [gameKey: string]: { qty: number; digits: string[] };
};

export default function GameScreen() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  // Safe Redux selection with optional chaining and fallbacks
  const { games = [] } = useSelector((state: RootState) => state.playNow || {});
  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const cartItemsCount = cartItems.length;

  const [betData, setBetData] = useState<BetData>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: TextInput[] }>({});

  // Scaling logic
  const inputBoxSize = width * 0.11;

  const cleanLabel = useCallback((name: string) => {
    return name.replace(/[^a-zA-Z]/g, '').split('');
  }, []);

  const updateQty = useCallback((key: string, delta: number) => {
    setBetData(prev => {
      const current = prev[key] || { qty: 1, digits: [] };
      return {
        ...prev,
        [key]: { ...current, qty: Math.max(1, current.qty + delta) },
      };
    });
  }, []);

  const handleDigitChange = (
    key: string,
    digitIndex: number,
    value: string,
    labelsLength: number,
  ) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');

    if (cleanedValue.length === 1 && digitIndex < labelsLength - 1) {
      inputRefs.current[key]?.[digitIndex + 1]?.focus();
    }

    setBetData(prev => {
      const current = prev[key] || {
        qty: 1,
        digits: new Array(labelsLength).fill(''),
      };
      const newDigits = [...current.digits];
      newDigits[digitIndex] = cleanedValue;
      return { ...prev, [key]: { ...current, digits: newDigits } };
    });
  };

  const onAddPress = async (
    item: GameGroup,
    gameKey: string,
    labelsLength: number,
  ) => {
    const current = betData[gameKey];

    if (
      !current ||
      current.digits.filter(d => d !== '').length !== labelsLength
    ) {
      Alert.alert('Required', 'Please fill all number boxes.');
      return;
    }

    setLoadingKey(gameKey);
    try {
      const gameId = item.digits[0].id;
      const totalAmount = item.price * current.qty;

      const res = await checkWalletApi({
        game_id: gameId,
        quantity: current.qty,
        amount: totalAmount,
      });

      if (res.success) {
        dispatch(
          addToCart({
            cartId: Math.random().toString(36).substr(2, 9),
            gameId: gameId,
            gameName: item.digits[0].digit_master.name,
            price: item.price,
            quantity: current.qty,
            digits: current.digits.join(''),
            winAmount: item.winAmount,
          }),
        );

        setBetData(prev => ({
          ...prev,
          [gameKey]: { qty: 1, digits: new Array(labelsLength).fill('') },
        }));
        Alert.alert('Success', 'Bet added to cart!');
      } else {
        Alert.alert('Balance Issue', res.message || 'Insufficient balance');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not verify wallet. Please try again.');
    } finally {
      setLoadingKey(null);
    }
  };

  const renderGameCard = ({ item }: { item: GameGroup }) => {
    const gameInfo = item.digits[0];
    const digitMaster = gameInfo.digit_master;
    const gameKey = `${digitMaster.name}_${item.price}`;
    const labels = cleanLabel(digitMaster.name);

    const currentBet = betData[gameKey] || {
      qty: 1,
      digits: new Array(labels.length).fill(''),
    };

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.digitTitleText}>{digitMaster.name} Entry</Text>
            <Text style={styles.winPrizeText}>
              Win ₹{item.winAmount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceLabel}>PRICE</Text>
            <Text style={styles.priceVal}>₹{item.price}</Text>
          </View>
        </View>

        <View style={styles.compactDivider} />

        <View style={styles.cardBody}>
          {/* LEFT: Digit Grid */}
          <View style={styles.digitGrid}>
            {labels.map((char, idx) => (
              <View key={idx} style={styles.inputStack}>
                <Text style={styles.charHint}>{char}</Text>
                <View
                  style={[
                    styles.boxFrame,
                    { width: inputBoxSize, height: inputBoxSize + 6 },
                  ]}
                >
                  <TextInput
                    ref={el => {
                      if (!inputRefs.current[gameKey])
                        inputRefs.current[gameKey] = [];
                      if (el) inputRefs.current[gameKey][idx] = el;
                    }}
                    style={styles.textInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={currentBet.digits[idx] || ''}
                    onChangeText={v =>
                      handleDigitChange(gameKey, idx, v, labels.length)
                    }
                    placeholder="0"
                    placeholderTextColor={colors.placeholder}
                    textAlign="center"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* RIGHT: Controls */}
          <View style={styles.controlsSide}>
            <View style={styles.miniStepper}>
              <TouchableOpacity
                onPress={() => updateQty(gameKey, -1)}
                style={styles.stepBtn}
              >
                <Icon name="minus" size={14} color={colors.textLight} />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{currentBet.qty}</Text>
              <TouchableOpacity
                onPress={() => updateQty(gameKey, 1)}
                style={styles.stepBtn}
              >
                <Icon name="plus" size={14} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addBtn}
              onPress={() => onAddPress(item, gameKey, labels.length)}
              disabled={loadingKey === gameKey}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                {loadingKey === gameKey ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.addBtnText}>ADD</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <StatusBar barStyle="dark-content" />
      <CommonHeader title="Place Bet" showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          data={games}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          renderItem={renderGameCard}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      <View style={styles.bottomBar}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalCap}>ITEMS IN CART</Text>
          <Text style={styles.totalNum}>{cartItemsCount} Bets</Text>
        </View>
        <TouchableOpacity
          style={styles.cartAction}
          onPress={() => navigation.navigate('Cart')}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItemsCount}</Text>
          </View>
          <Text style={styles.cartText}>VIEW CART</Text>
          <Icon name="basket-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listPadding: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 },
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  digitTitleText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  winPrizeText: { fontSize: 18, fontWeight: '900', color: colors.text },
  priceBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  priceLabel: { fontSize: 8, fontWeight: '800', color: colors.textLight },
  priceVal: { fontSize: 14, fontWeight: '900', color: colors.primary },
  compactDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },

  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap', // Ensures responsiveness on small devices
  },
  digitGrid: { flexDirection: 'row', alignItems: 'center' },
  inputStack: { alignItems: 'center', marginRight: 6 },
  charHint: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.placeholder,
    marginBottom: 4,
  },
  boxFrame: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textInput: {
    width: '100%',
    height: '100%',
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  controlsSide: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  miniStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    marginRight: 8,
  },
  stepBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyNum: {
    paddingHorizontal: 8,
    fontWeight: '900',
    color: colors.text,
    fontSize: 14,
  },

  addBtn: { borderRadius: 10, overflow: 'hidden', margin: 'end' },
  btnGradient: { paddingHorizontal: 18, paddingVertical: 9 },
  addBtnText: { color: '#FFF', fontWeight: '900', fontSize: 12 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.card,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
    elevation: 20,
  },
  totalBlock: { flex: 1 },
  totalCap: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.5,
  },
  totalNum: { fontSize: 24, fontWeight: '900', color: colors.text },
  cartAction: {
    backgroundColor: colors.text, // Dark Navy
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartText: { color: '#FFF', fontWeight: '900', fontSize: 13, marginRight: 8 },
  badge: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -5,
    left: -5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
});
