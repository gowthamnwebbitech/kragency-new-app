import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
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


// Define the API response structure
interface OrderResponse {
  success: boolean;
  message: string;
  order_id: number;
}

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      /* -----------------------------
       * SUCCESS
       * ----------------------------- */
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

      /* -----------------------------
       * FAIL (success = false)
       * ----------------------------- */
      Toast.show({
        type: 'error',
        text1: 'Order Failed',
        text2: response?.message ?? 'Could not place order',
      });
    } catch (error: any) {
      /* -----------------------------
       * API ERROR (400 / 500)
       * ----------------------------- */
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      <View style={styles.cardHeader}>
        <View style={styles.gameInfo}>
          <View style={styles.iconCircle}>
            <Icon name="ticket-confirmation" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.gameNameText}>{item.gameName}</Text>
            <Text style={styles.providerSubText}>
              {item.provider || '3D JACKPOT'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => dispatch(removeFromCart(item.cartId))}
          style={styles.deleteCircle}
        >
          <Icon name="close" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.dividerWrapper}>
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
    <ScreenContainer style={{ backgroundColor: '#F8FAFC' }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <CommonHeader title="My Cart" showBack showCart={false} />

      <FlatList
        data={items}
        keyExtractor={item => item.cartId}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listScroll,
          { paddingBottom: 120 + insets.bottom },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="cart-off" size={60} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Cart is empty</Text>
          </View>
        }
      />

      {items.length > 0 && (
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
  dividerWrapper: { flexDirection: 'row', alignItems: 'center', height: 20 },
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
  emptyWrap: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CBD5E1',
    marginTop: 10,
  },
});
