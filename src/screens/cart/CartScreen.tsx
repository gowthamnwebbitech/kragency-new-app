import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { RootState } from '@/app/store';
import { clearCart, removeFromCart } from '@/features/cart/cartSlice';
import { postApi } from '@/api/apiMethods';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import colors from '@/theme/colors';
import Toast from 'react-native-toast-message';

interface OrderResponse {
  success: boolean;
  message: string;
  order_id: number;
}

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

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleConfirmPay = async () => {
    if (!items.length || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        cart: items.map(item => ({
          game_id: item.gameId,
          digits: item.digits,
          quantity: item.quantity,
          amount: item.price * item.quantity,
        })),
      };
      const response = (await postApi(
        '/customer/place-order',
        payload,
      )) as OrderResponse;
      if (response?.success) {
        Toast.show({
          type: 'success',
          text1: 'Order Placed',
          text2: 'Your order was placed successfully 🎉',
        });
        navigation.navigate('OrderSuccess', {
          orderId: response.order_id,
          amount: totalAmount,
        });
        dispatch(clearCart());
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: response?.message ?? 'Could not place order',
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Something went wrong. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Transaction Failed',
        text2: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= MODERN EMPTY STATE ================= */
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <View style={styles.emptyIconPulse}>
          <Icon name="ticket-percent" size={50} color={colors.primary} />
        </View>
      </View>
      <Text style={styles.emptyTitle}>No Tickets Found</Text>
      <Text style={styles.emptySubTitle}>
        Your cart is empty. Choose your lucky numbers and start playing to win
        the next jackpot!
      </Text>
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'MainTabs',
                params: {
                  screen: 'Home',
                },
              },
            ],
          })
        }
      >
        <Text style={styles.browseText}>Start Playing</Text>
        <Icon name="play-circle" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

  /* ================= RENDER SKELETON LIST ================= */
  const renderSkeletonState = () => (
    <View style={styles.listScroll}>
      {[1, 2, 3].map(key => (
        <View key={key} style={styles.ticketCard}>
          <View style={styles.cardHeader}>
            <View style={styles.gameInfo}>
              <Skeleton style={styles.skeletonIcon} />
              <View style={styles.skeletonTextGap}>
                <Skeleton style={styles.skeletonTitle} />
                <Skeleton style={styles.skeletonSub} />
              </View>
            </View>
          </View>
          <View style={styles.ViewiderWrapper}>
            <View style={styles.leftPunch} />
            <View style={styles.dashedLine} />
            <View style={styles.rightPunch} />
          </View>
          <View style={styles.cardBody}>
            <View style={styles.statRow}>
              <Skeleton style={styles.skeletonStat} />
              <Skeleton style={styles.skeletonStat} />
              <Skeleton style={styles.skeletonStat} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      <View style={styles.cardHeader}>
        <View style={styles.gameInfo}>
          <View style={styles.iconCircle}>
            <Icon name="ticket-confirmation" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.gameNameText}>{item.gameName}</Text>
            <Text style={styles.providerSubText}>{item.provider}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => dispatch(removeFromCart(item.cartId))}
          style={styles.deleteCircle}
        >
          <Icon name="close" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.ViewiderWrapper}>
        <View style={styles.leftPunch} />
        <View style={styles.dashedLine} />
        <View style={styles.rightPunch} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.statRow}>
          <View style={styles.statDetail}>
            <Text style={styles.label}>NUMBERS</Text>
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>{item.digits}</Text>
            </View>
          </View>
          <View style={styles.statDetail}>
            <Text style={styles.label}>QTY</Text>
            <Text style={styles.valueText}>{item.quantity}</Text>
          </View>
          <View style={styles.statDetail}>
            <Text style={styles.label}>TOTAL</Text>
            <Text style={styles.amountText}>₹{item.price * item.quantity}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <CommonHeader title="My Cart" showBack showCart={false} />

      {isLoading ? (
        renderSkeletonState()
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.cartId}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listScroll,
            { flexGrow: 1, paddingBottom: 120 + insets.bottom },
          ]}
          ListEmptyComponent={renderEmptyCart}
        />
      )}

      {items.length > 0 && !isLoading && (
        <View
          style={[
            styles.compactFooter,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
              <Text style={styles.totalAmount}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.payBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={handleConfirmPay}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.payText}>CONFIRM & PAY</Text>
                  <Icon name="chevron-right" size={20} color="#FFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listScroll: { padding: 16 },
  skeletonBase: { backgroundColor: '#E2E8F0', borderRadius: 4 },
  skeletonIcon: { width: 36, height: 36, borderRadius: 18 },
  skeletonTextGap: { gap: 6 },
  skeletonTitle: { width: 120, height: 14 },
  skeletonSub: { width: 80, height: 10 },
  skeletonStat: { width: 60, height: 25, borderRadius: 6 },

  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  gameInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameNameText: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  providerSubText: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  deleteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewiderWrapper: { flexDirection: 'row', alignItems: 'center', height: 20 },
  leftPunch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginLeft: -10,
  },
  rightPunch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginRight: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderStyle: 'dashed',
  },
  cardBody: { padding: 14 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statDetail: { gap: 2 },
  label: { fontSize: 9, fontWeight: '800', color: '#94A3B8' },
  numberBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  numberText: { fontSize: 13, fontWeight: '900', color: '#4F46E5' },
  valueText: { fontSize: 14, fontWeight: '800', color: '#334155' },
  amountText: { fontSize: 15, fontWeight: '900', color: '#0F172A' },

  /* EMPTY STATE STYLES */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIconPulse: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySubTitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  browseBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
    elevation: 4,
  },
  browseText: { color: '#FFF', fontSize: 16, fontWeight: '900' },

  compactFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 20,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 10, fontWeight: '900', color: '#94A3B8' },
  totalAmount: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  payBtn: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 4,
  },
  payText: { color: '#FFF', fontSize: 14, fontWeight: '900' },
});
