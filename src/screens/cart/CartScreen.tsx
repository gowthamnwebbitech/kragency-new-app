import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '@/app/store';
import { removeFromCart, clearCart } from '@/features/cart/cartSlice';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import colors from '@/theme/colors';

export default function CartScreen() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => dispatch(clearCart()) },
    ]);
  };

  const handleDelete = (cartId: string) => {
    Alert.alert('Remove Bet', 'Remove this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeFromCart(cartId)) },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.ticketCard}>
      {/* Top Section */}
      <View style={styles.cardHeader}>
        <View style={styles.gameInfo}>
          <View style={styles.iconCircle}>
            <Icon name="ticket-confirmation" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.gameNameText}>{item.gameName}</Text>
            <Text style={styles.providerSubText}>{item.provider || '3D JACKPOT'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.cartId)} style={styles.deleteCircle}>
          <Icon name="trash-can-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Ticket Divider Line */}
      <View style={styles.dividerWrapper}>
        <View style={styles.leftPunch} />
        <View style={styles.dashedLine} />
        <View style={styles.rightPunch} />
      </View>

      {/* Bottom Section */}
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
            <Text style={styles.label}>AMOUNT</Text>
            <Text style={styles.amountText}>₹{item.price * item.quantity}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer style={{ backgroundColor: '#F1F5F9' }}>
      <StatusBar barStyle="dark-content" />
      <CommonHeader title="My Cart" showBack showCart={false} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.cartId}
        renderItem={renderItem}
        contentContainerStyle={styles.listScroll}
        ListHeaderComponent={items.length > 0 ? (
          <View style={styles.listHeader}>
             <Text style={styles.summaryCount}>{items.length} ACTIVE BETS</Text>
             <TouchableOpacity onPress={handleClearCart}>
                <Text style={styles.clearAllText}>Clear All Items</Text>
             </TouchableOpacity>
          </View>
        ) : null}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Icon name="cart-variant" size={70} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Add some lucky numbers to start!</Text>
          </View>
        }
      />

      {items.length > 0 && (
        <View style={styles.compactFooter}>
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.totalLabel}>TOTAL PAYABLE</Text>
              <Text style={styles.totalAmount}>₹{totalAmount.toLocaleString()}</Text>
            </View>
            <TouchableOpacity style={styles.payBtn} activeOpacity={0.8}>
              <Text style={styles.payText}>CONFIRM & PAY</Text>
              <Icon name="chevron-right" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listScroll: { padding: 16, paddingBottom: 120 },
  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16,
    paddingHorizontal: 4
  },
  summaryCount: { fontSize: 11, fontWeight: '900', color: '#64748B', letterSpacing: 1 },
  clearAllText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },

  /* BEST TICKET CARD DESIGN */
  ticketCard: {
    backgroundColor: '#FFF',
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 1 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  gameInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FFF1F2', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  gameNameText: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  providerSubText: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  deleteCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center'
  },

  /* Ticket Divider Styling */
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    overflow: 'hidden'
  },
  leftPunch: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#F1F5F9', marginLeft: -10 },
  rightPunch: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#F1F5F9', marginRight: -10 },
  dashedLine: { 
    flex: 1, 
    height: 1, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderStyle: 'dashed', 
    marginHorizontal: 5 
  },

  cardBody: { padding: 16, paddingTop: 10 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statDetail: { gap: 4 },
  label: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  numberBadge: { 
    backgroundColor: '#EEF2FF', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  numberText: { fontSize: 14, fontWeight: '900', color: '#4F46E5' },
  valueText: { fontSize: 15, fontWeight: '800', color: '#334155' },
  amountText: { fontSize: 16, fontWeight: '900', color: '#1E293B' },

  /* COMPACT FOOTER */
  compactFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: 10, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.5 },
  totalAmount: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  payBtn: {
    backgroundColor: '#16A34A', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  payText: { color: '#FFF', fontSize: 14, fontWeight: '900' },

  emptyWrap: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#64748B', marginTop: 16 },
  emptySub: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
});