import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-reanimated-carousel';
import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

/* ================= DATA ================= */
const BANNERS = [
  { id: 1, image: require('@/assets/banner/banner1.jpg') },
  { id: 2, image: require('@/assets/banner/banner2.png') },
  { id: 3, image: require('@/assets/banner/banner3.png') },
];

const FEATURED = [
  {
    id: 1,
    name: 'Kerala Jackpot',
    time: 'Today • 9:30 PM',
    logo: require('@/assets/featuredgames/image1.jpg'),
  },
  {
    id: 2,
    name: 'Dear',
    time: 'Tomorrow • 6:00 PM',
    logo: require('@/assets/featuredgames/image2.jpg'),
  },
  {
    id: 3,
    name: '4D JACKPOT',
    time: 'Everyday • 8:00 PM',
    logo: require('@/assets/featuredgames/image3.jpg'),
  },
];

const TRUST = [
  { id: 1, title: 'Trusted', desc: 'Thousands of users', icon: 'shield' },
  { id: 2, title: 'Secure', desc: 'Safe payments', icon: 'lock' },
  { id: 3, title: 'Fast Payout', desc: 'Instant withdraw', icon: 'zap' },
  { id: 4, title: '24/7 Help', desc: 'Always online', icon: 'headphones' },
];

/* ================= SCREEN ================= */
export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePlayPress = (gameId: number) => {
    if (!isAuthenticated) {
      
      navigation.dispatch(
  CommonActions.navigate('Login')
);
    } else {
      navigation.navigate('SlotScreen', { gameId });
    }
  };

  return (
    <View style={styles.root}>
      {/* COMMON HEADER */}
      <CommonHeader
        walletAmount={isAuthenticated ? '₹2,450' : undefined}
        showCart={isAuthenticated}
        showLogin={!isAuthenticated}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* BANNERS */}
        <View style={styles.bannerWrapper}>
          <Carousel
            width={width}
            height={width * 0.45}
            data={BANNERS}
            autoPlay
            loop
            autoPlayInterval={4000}
            renderItem={({ item }) => (
              <Image source={item.image} style={styles.bannerImage} />
            )}
          />
        </View>

        {/* FEATURED */}
        <SectionHeader title="Featured Games" />

        {FEATURED.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20 * (index + 1), 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image source={item.logo} style={styles.featureLogo} />

            <View style={styles.featureInfo}>
              <Text style={styles.featureName}>{item.name}</Text>
              <Text style={styles.featureTime}>{item.time}</Text>
            </View>

            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => handlePlayPress(item.id)}
            >
              <Feather name="play" size={16} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* TRUST */}
        <SectionHeader title="Why Choose Us" />

        <View style={styles.trustGrid}>
          {TRUST.map(item => (
            <Animated.View
              key={item.id}
              style={[styles.trustCard, { opacity: fadeAnim }]}
            >
              <View style={styles.trustIcon}>
                <Feather name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.trustTitle}>{item.title}</Text>
              <Text style={styles.trustDesc}>{item.desc}</Text>
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

/* ================= SECTION HEADER ================= */
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionLine} />
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  bannerWrapper: { marginVertical: 16 },
  bannerImage: {
    width: width * 0.9,
    height: width * 0.45,
    alignSelf: 'center',
    borderRadius: 16,
  },
  sectionHeader: { marginHorizontal: 16, marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  sectionLine: {
    width: 32,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 6,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
  },
  featureLogo: { width: 44, height: 44, borderRadius: 10, marginRight: 12 },
  featureInfo: { flex: 1 },
  featureName: { fontSize: 15, fontWeight: '700' },
  featureTime: { fontSize: 12, marginTop: 4, color: colors.textLight },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  trustCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 2,
  },
  trustIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  trustTitle: { fontSize: 14, fontWeight: '700' },
  trustDesc: {
    fontSize: 11,
    textAlign: 'center',
    color: colors.textLight,
    marginTop: 2,
  },
});
