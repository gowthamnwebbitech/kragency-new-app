import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { RootState } from '@/app/store';
import { GameGroup } from '@/features/playNow/playNowTypes';
import { checkWalletApi } from '@/api/playNowApi';
import { addToCart } from '@/features/cart/cartSlice';
import Toast from 'react-native-toast-message';

type BetData = {
  [gameKey: string]: { qty: number; digits: string[] };
};

const BOTTOM_BAR_HEIGHT = 85;

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
          easing: Easing.inOut(Easing.ease) 
        }),
        Animated.timing(opacity, { 
          toValue: 0.3, 
          duration: 800, 
          useNativeDriver: true, 
          easing: Easing.inOut(Easing.ease) 
        }),
      ]),
    ).start();
  }, [opacity]);
  return <Animated.View style={[styles.skeletonBase, style, { opacity }]} />;
};

const GameSkeleton = () => (
  <View style={styles.listPadding}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.flexOne}>
            <SkeletonPart style={styles.skeletonLabel} />
            <SkeletonPart style={styles.skeletonTitle} />
            <SkeletonPart style={styles.skeletonSub} />
          </View>
          <SkeletonPart style={styles.skeletonBadge} />
        </View>
        <View style={styles.compactDivider} />
        <View style={styles.cardBody}>
          <View style={styles.row}>
            {[1, 2, 3].map(j => (
              <SkeletonPart key={j} style={styles.skeletonInputBox} />
            ))}
          </View>
          <SkeletonPart style={styles.skeletonAddBtn} />
        </View>
      </View>
    ))}
  </View>
);

/* ================= MAIN SCREEN ================= */
export default function GameScreen() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { games = [], loading } = useSelector((state: RootState) => state.playNow || {});
  const { items: cartItems, totalAmount: currentCartTotal } = useSelector((state: RootState) => state.cart);
  const cartItemsCount = cartItems.length;

  const [betData, setBetData] = useState<BetData>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false); // ✅ Loader for View Cart
  const inputRefs = useRef<{ [key: string]: TextInput[] }>({});

  const inputBoxSize = width * 0.11;
  const bottomBarTotalHeight = BOTTOM_BAR_HEIGHT + insets.bottom;

  const cleanLabel = useCallback((name: string) => {
    return name.replace(/[^a-zA-Z]/g, '').split('');
  }, []);

  const updateQty = useCallback((key: string, delta: number) => {
    setBetData(prev => {
      const current = prev[key] || { qty: 1, digits: [] };
      return { ...prev, [key]: { ...current, qty: Math.max(1, current.qty + delta) } };
    });
  }, []);

  const handleDigitChange = (key: string, digitIndex: number, value: string, labelsLength: number) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');

    setBetData(prev => {
      const current = prev[key] || { qty: 1, digits: new Array(labelsLength).fill('') };
      const newDigits = [...current.digits];
      newDigits[digitIndex] = cleanedValue;
      return { ...prev, [key]: { ...current, digits: newDigits } };
    });

    if (cleanedValue.length === 1 && digitIndex < labelsLength - 1) {
      inputRefs.current[key]?.[digitIndex + 1]?.focus();
    } else if (cleanedValue.length === 0 && digitIndex > 0) {
      inputRefs.current[key]?.[digitIndex - 1]?.focus();
    }
  };

  const onAddPress = async (item: GameGroup, gameKey: string, labelsLength: number) => {
    const current = betData[gameKey];
    
    // ✅ VALIDATION: Check if data exists and all digits are filled
    if (!current || current.digits.filter(d => d !== '').length !== labelsLength) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Please fill all number boxes.' });
      return;
    }

    if (loadingKey === gameKey) return;

    setLoadingKey(gameKey); 
    try {
      const gameInfo = item.digits[0];
      const finalPayload = {
        cart: cartItems.map(cartItem => ({
          type: cartItem.digits.length.toString(),
          game_id: cartItem.gameId.toString(),
          game_label: cartItem.gameName,
          digits: cartItem.digits,
          quantity: cartItem.quantity.toString(),
          amount: cartItem.price.toString(),
          is_box: 'false',
          total: (cartItem.price * cartItem.quantity).toString(),
        })),
        newItem: {
          type: labelsLength.toString(),
          game_id: gameInfo.id.toString(),
          game_label: gameInfo.digit_master.name,
          digits: current.digits.join(''),
          quantity: current.qty.toString(),
          amount: item.price.toString(),
          is_box: 'false',
          total: (item.price * current.qty).toString(),
        },
      };

      const res = await checkWalletApi(finalPayload as any);
      if (res?.success) {
        dispatch(addToCart({
          cartId: Math.random().toString(36).substr(2, 9),
          gameId: gameInfo.id,
          gameName: gameInfo.digit_master.name,
          price: item.price,
          quantity: current.qty,
          digits: current.digits.join(''),
          winAmount: item.winAmount,
          provider: item.betting_provider_name,
        }));
        setBetData(prev => ({ ...prev, [gameKey]: { qty: 1, digits: new Array(labelsLength).fill('') } }));
        inputRefs.current[gameKey]?.forEach(ref => ref?.blur());
        Toast.show({ type: 'success', text1: 'Added to Cart', text2: `Bet added successfully` });
        return;
      }
      Toast.show({ type: 'error', text1: 'Balance Issue', text2: res?.message ?? 'Insufficient balance' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err?.response?.data?.message || 'Request failed' });
    } finally {
      setLoadingKey(null);
    }
  };

  const handleViewCart = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigation.navigate('Cart');
    // Reset loader after a delay to ensure it doesn't stay stuck if navigation is fast
    setTimeout(() => setIsNavigating(false), 1000);
  };

  const renderGameCard = ({ item }: { item: GameGroup }) => {
    const gameInfo = item.digits[0];
    const digitMaster = gameInfo.digit_master;
    const gameKey = `${digitMaster.name}_${item.price}`;
    const labels = cleanLabel(digitMaster.name);
    const currentBet = betData[gameKey] || { qty: 1, digits: new Array(labels.length).fill('') };
    const isLoading = loadingKey === gameKey;

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.flexOne}>
            <Text style={styles.providerLabel}>{item.betting_provider_name}</Text>
            <Text style={styles.digitTitleText}>{digitMaster.name} Entry</Text>
            <Text style={styles.winPrizeText}>Win ₹{item.winAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceLabel}>PRICE</Text>
            <Text style={styles.priceVal}>₹{item.price}</Text>
          </View>
        </View>
        <View style={styles.compactDivider} />
        <View style={styles.cardBody}>
          <View style={styles.digitGrid}>
            {labels.map((char, idx) => (
              <View key={idx} style={styles.inputStack}>
                <Text style={styles.charHint}>{char}</Text>
                <View style={[styles.boxFrame, { width: inputBoxSize, height: inputBoxSize + 8 }]}>
                  <TextInput
                    ref={el => {
                      if (!inputRefs.current[gameKey]) inputRefs.current[gameKey] = [];
                      if (el) inputRefs.current[gameKey][idx] = el;
                    }}
                    style={styles.textInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={currentBet.digits[idx] || ''}
                    onChangeText={v => handleDigitChange(gameKey, idx, v, labels.length)}
                    placeholder="0"
                    placeholderTextColor="#CBD5E1"
                    textAlign="center"
                    editable={!isLoading}
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.controlsSide}>
            <View style={styles.miniStepper}>
              <TouchableOpacity onPress={() => updateQty(gameKey, -1)} style={styles.stepBtn} disabled={isLoading}>
                <Icon name="minus" size={14} color={colors.textLight} />
              </TouchableOpacity>
              <Text style={styles.qtyNum}>{currentBet.qty}</Text>
              <TouchableOpacity onPress={() => updateQty(gameKey, 1)} style={styles.stepBtn} disabled={isLoading}>
                <Icon name="plus" size={14} color={colors.textLight} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.addBtn} 
              onPress={() => onAddPress(item, gameKey, labels.length)} 
              disabled={isLoading}
            >
              <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.btnGradient}>
                {isLoading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.addBtnText}>ADD</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer style={styles.mainBg}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <CommonHeader title="Place Bet" showBack />
      
      <View style={[styles.flexOne, { marginBottom: bottomBarTotalHeight }]}>
        {loading ? (
          <GameSkeleton />
        ) : (
          <KeyboardAwareFlatList
            data={games}
            keyExtractor={(item, index) => `${item.betting_provider_name}-${index}`}
            renderItem={renderGameCard}
            enableOnAndroid={true}
            extraScrollHeight={Platform.select({ ios: 120, android: 160 })}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listPadding}
          />
        )}
      </View>

      <View style={[styles.bottomBar, { height: bottomBarTotalHeight, paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalCap}>TOTAL PRICE</Text>
          <Text style={styles.totalNum}>₹{currentCartTotal.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity 
          style={styles.cartAction} 
          onPress={handleViewCart} 
          disabled={isNavigating}
        >
          <View style={styles.badge}><Text style={styles.badgeText}>{cartItemsCount}</Text></View>
          {isNavigating ? (
             <ActivityIndicator size="small" color="#FFF" style={styles.cartLoader} />
          ) : (
            <>
              <Text style={styles.cartText}>VIEW CART</Text>
              <Icon name="basket-outline" size={22} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  row: { flexDirection: 'row' },
  mainBg: { backgroundColor: '#F8FAFC' },
  skeletonBase: { backgroundColor: '#E2E8F0', borderRadius: 4 },
  skeletonLabel: { width: 60, height: 10, marginBottom: 6 },
  skeletonTitle: { width: 120, height: 18, marginBottom: 6 },
  skeletonSub: { width: 80, height: 14 },
  skeletonBadge: { width: 50, height: 40, borderRadius: 10 },
  skeletonInputBox: { width: 45, height: 50, borderRadius: 12, marginRight: 8 },
  skeletonAddBtn: { width: 100, height: 40, borderRadius: 10 },
  listPadding: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },
  cardContainer: { backgroundColor: '#FFF', borderRadius: 20, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  providerLabel: { fontSize: 11, fontWeight: '900', color: colors.primary, textTransform: 'uppercase' },
  digitTitleText: { fontSize: 10, fontWeight: '800', color: colors.textLight, textTransform: 'uppercase' },
  winPrizeText: { fontSize: 18, fontWeight: '900', color: colors.text },
  priceBadge: { backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#EDF2F7' },
  priceLabel: { fontSize: 8, fontWeight: '800', color: colors.textLight },
  priceVal: { fontSize: 14, fontWeight: '900', color: colors.primary },
  compactDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' },
  digitGrid: { flexDirection: 'row', alignItems: 'center' },
  inputStack: { alignItems: 'center', marginRight: 6 },
  charHint: { fontSize: 10, fontWeight: '900', color: colors.placeholder, marginBottom: 4 },
  boxFrame: { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  textInput: { width: '100%', height: '100%', fontSize: 18, fontWeight: '900', color: colors.text, textAlign: 'center' },
  controlsSide: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  miniStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 2, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  stepBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  qtyNum: { paddingHorizontal: 8, fontWeight: '900', color: colors.text, fontSize: 14 },
  addBtn: { borderRadius: 10, overflow: 'hidden', minWidth: 80 },
  btnGradient: { paddingHorizontal: 18, paddingVertical: 9, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  totalBlock: { flex: 1 },
  totalCap: { fontSize: 9, fontWeight: '800', color: colors.textLight },
  totalNum: { fontSize: 24, fontWeight: '900', color: colors.text },
  cartAction: { backgroundColor: '#0F172A', paddingHorizontal: 16, height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', minWidth: 120, justifyContent: 'center' },
  cartText: { color: '#FFF', fontWeight: '900', fontSize: 13, marginRight: 8 },
  cartLoader: { paddingHorizontal: 20 },
  badge: { backgroundColor: colors.primary, width: 20, height: 20, borderRadius: 10, position: 'absolute', top: -5, left: -5, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', zIndex: 10 },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
});