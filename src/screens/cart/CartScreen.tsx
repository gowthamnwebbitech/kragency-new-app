import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CommonHeader from '@/components/CommonHeader';
import colors from '@/theme/colors';

// Data consistent with your Jackpot theme
const DUMMY_CART = [
  {
    id: '1',
    date: '2026-01-03',
    provider: '3D JACKPOT',
    gameName: 'ABC-SUPER',
    quantity: 2,
    numbers: '123',
    betAmount: 22,
    type: 'Direct'
  },
  {
    id: '2',
    date: '2026-01-03',
    provider: 'LUCKY STRIKE',
    gameName: 'XYZ-MEGA',
    quantity: 5,
    numbers: '789',
    betAmount: 50,
    type: 'Box'
  }
];

export default function CartScreen({ navigation }: any) {
  const [cart, setCart] = useState(DUMMY_CART);

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.betAmount * item.quantity), 0);

  const renderItem = ({ item }: { item: typeof DUMMY_CART[0] }) => (
    <View style={styles.card}>
      {/* Brand Accent Sidebar */}
      <View style={[styles.cardAccent, { backgroundColor: colors.primary }]} />
      
      <View style={styles.cardMain}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.providerRow}>
              <Text style={[styles.providerText, { color: colors.primary }]}>{item.provider}</Text>
              <View style={styles.dot} />
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <Text style={styles.gameName}>{item.gameName}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.deleteBtn} 
            onPress={() => removeItem(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Detailed Info Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Numbers</Text>
            <Text style={styles.gridValue}>{item.numbers}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Quantity</Text>
            <Text style={styles.gridValue}>x{item.quantity}</Text>
          </View>
          <View style={[styles.gridItem, { alignItems: 'flex-end' }]}>
            <Text style={styles.gridLabel}>Subtotal</Text>
            <Text style={[styles.subtotalValue, { color: colors.primary }]}>₹{item.betAmount * item.quantity}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            <Feather name="calendar" size={12} color={colors.textLight} />
            <Text style={styles.footerText}>{item.date}</Text>
          </View>
          <Text style={styles.footerText}>Rate: ₹{item.betAmount}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <CommonHeader 
        title="Review Bets" 
       showBack
        showCart={false}
        showWallet={true}  
        walletAmount="2,450"
        onBackPress={() => navigation.goBack()}
        cartCount={cart.length} 
      />

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Feather name="shopping-cart" size={40} color={colors.disabled} />
            </View>
            <Text style={styles.emptyTitle}>Cart is Empty</Text>
            <Text style={styles.emptySub}>No active bets found in your bag.</Text>
            <TouchableOpacity 
              style={[styles.backToHome, { borderColor: colors.primary }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.backToHomeText, { color: colors.primary }]}>Go Back</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {cart.length > 0 && (
        <View style={styles.checkoutFooter}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Bets</Text>
              <Text style={styles.summaryCount}>{cart.length} Items</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryLabel}>Payable Amount</Text>
              <Text style={styles.summaryTotal}>₹{totalAmount.toLocaleString()}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.payButton, { backgroundColor: colors.success }]}
            activeOpacity={0.8}
            onPress={() => console.log("Proceed to pay")}
          >
            <Text style={styles.payButtonText}>Confirm & Place Bet</Text>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
  },
  listContent: {
    padding: 16,
    paddingBottom: 160,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    // High-quality subtle shadow
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardAccent: {
    width: 4,
  },
  cardMain: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  providerText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.disabled,
    marginHorizontal: 6,
  },
  typeText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
  },
  gameName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  deleteBtn: {
    padding: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  subtotalValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: colors.card,
    padding: 20,
    paddingBottom: 30, // Extra padding for safe area
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryTotal: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  emptySub: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 5,
  },
  backToHome: {
    marginTop: 25,
    borderWidth: 1.5,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backToHomeText: {
    fontWeight: '700',
  },
});