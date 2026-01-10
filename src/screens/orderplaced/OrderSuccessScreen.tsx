import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  FadeInUp,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderSuccessScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { orderId, amount } = route.params || { orderId: '---', amount: 0 };

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTabs');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <Animated.View
          entering={ZoomIn.duration(600)}
          style={styles.iconContainer}
        >
          <LinearGradient colors={['#22C55E', '#16A34A']} style={styles.circle}>
            <Icon name="check-bold" size={44} color="#FFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.headerText}>
          <Text style={styles.title}>Order Successful</Text>
          <Text style={styles.subtitle}>Your transaction was completed</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.receipt}
        >
          <View style={styles.row}>
            <Text style={styles.label}>AMOUNT PAID</Text>
            <Text style={styles.amountText}>
              ₹{amount.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.dashedDivider} />
          <View style={styles.row}>
            <Text style={styles.label}>ORDER ID</Text>
            <Text style={styles.refText}>#{orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>STATUS</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>SUCCESS</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.primaryBtnText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <Text style={styles.secondaryBtnText}>View My Bets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 28 },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  headerText: { alignItems: 'center', marginVertical: 30 },
  title: { fontSize: 26, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B' },
  receipt: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: { fontSize: 10, color: '#94A3B8', fontWeight: '800' },
  amountText: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  refText: { fontSize: 14, fontWeight: '700', color: '#334155' },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { color: '#16A34A', fontSize: 10, fontWeight: '900' },
  footer: { paddingHorizontal: 28, gap: 12, marginBottom: 10 },
  primaryBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: { color: '#64748B', fontSize: 14, fontWeight: '700' },
});
