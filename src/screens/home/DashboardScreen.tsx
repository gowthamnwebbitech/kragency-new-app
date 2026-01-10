import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { RootState, AppDispatch } from '@/app/store';
import { fetchHomeGames } from '@/features/home/homeThunk';

const { width } = Dimensions.get('window');
// Calculate width for 2 columns with 16px padding and 12px gap
const GRID_CARD_WIDTH = (width - (16 * 2) - 12) / 2;

const TRUST = [
  { id: 1, title: 'Trusted', desc: 'Thousands of users', icon: 'shield' },
  { id: 2, title: 'Secure', desc: 'Safe payments', icon: 'lock' },
  { id: 3, title: 'Fast Payout', desc: 'Instant withdraw', icon: 'zap' },
  { id: 4, title: '24/7 Help', desc: 'Always online', icon: 'headphones' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { banners, featuredGames, loading } = useSelector(
    (state: RootState) => state.home,
  );

  useEffect(() => {
    dispatch(fetchHomeGames());
  }, [dispatch]);

  /* ================= ANIMATIONS ================= */
  const featuredAnimations = useMemo(
    () =>
      featuredGames?.map(() => ({
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.9),
      })) ?? [],
    [featuredGames],
  );

  const trustAnimations = useMemo(
    () => TRUST.map(() => ({ opacity: new Animated.Value(0) })),
    [],
  );

  useEffect(() => {
    if (featuredGames?.length) {
      const featuredAnims = featuredAnimations.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.spring(anim.scale, {
            toValue: 1,
            friction: 8,
            tension: 40,
            delay: index * 100,
            useNativeDriver: true,
          }),
        ]),
      );

      const trustAnims = trustAnimations.map((anim, index) =>
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }),
      );

      Animated.stagger(100, [...featuredAnims, ...trustAnims]).start();
    }
  }, [featuredGames]);

  const handlePlayPress = (providerId: number) => {
    if (!isAuthenticated) {
      navigation.dispatch(CommonActions.navigate('Login'));
    } else {
      navigation.navigate('SlotScreen', { providerId });
    }
  };

  return (
    <ScreenContainer>
      <CommonHeader
        showCart={isAuthenticated}
        showWallet={isAuthenticated}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* 🎞 Banner Section */}
          {banners?.length > 0 && (
            <View style={styles.bannerWrapper}>
              <Carousel
                width={width}
                height={width * 0.48}
                data={banners}
                autoPlay
                loop
                autoPlayInterval={4000}
                renderItem={({ item }) => (
                  <TouchableOpacity activeOpacity={0.9} style={styles.bannerBtn}>
                    <Image source={{ uri: item.image }} style={styles.bannerImage} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <SectionHeader title="Featured Games" showViewAll />
          
          <View style={styles.featuredGrid}>
            {featuredGames?.map((item, index) => {
              const anim = featuredAnimations[index];
              if (!anim) return null;

              return (
                <Animated.View
                  key={item.id}
                  style={[
                    styles.gridCard,
                    {
                      opacity: anim.opacity,
                      transform: [{ scale: anim.scale }],
                    },
                  ]}
                >
                  <TouchableOpacity 
                    activeOpacity={0.8} 
                    onPress={() => handlePlayPress(item.providerId)}
                  >
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.logo }} style={styles.cardImage} />
                      <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <View style={styles.cardInfo}>
                        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cardTime}>{item?.time ?? 'Closing soon'}</Text>
                      </View>
                      <View style={styles.miniPlayBtn}>
                         <Feather name="play" size={12} color="#FFF" fill="#FFF" />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* 🛡 Trust Section */}
          <SectionHeader title="Why Choose Us" />
          <View style={styles.trustGrid}>
            {TRUST.map((item, index) => (
              <Animated.View
                key={item.id}
                style={[
                  styles.trustCard,
                  { opacity: trustAnimations[index].opacity },
                ]}
              >
                <View style={styles.trustIcon}>
                  <Feather name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.trustTitle}>{item.title}</Text>
                <Text style={styles.trustDesc}>{item.desc}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.ScrollView>
      )}
    </ScreenContainer>
  );
}

const SectionHeader = ({ title, showViewAll }: { title: string, showViewAll?: boolean }) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
    {showViewAll && (
      <TouchableOpacity>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 40 },
  
  // Banner
  bannerWrapper: { marginTop: 16 },
  bannerBtn: { paddingHorizontal: 16 },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },

  // Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  sectionLine: {
    width: 24,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 4,
  },
  viewAllText: { fontSize: 13, fontWeight: '700', color: colors.primary },

  // Featured Grid (1 Row, 2 Cards)
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  gridCard: {
    width: GRID_CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    // Premium Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: GRID_CARD_WIDTH * 0.85,
    position: 'relative',
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  liveText: { color: '#FFF', fontSize: 9, fontWeight: '900' },

  cardFooter: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1, marginRight: 8 },
  cardName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  cardTime: { fontSize: 10, color: '#64748B', marginTop: 2 },
  miniPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Trust Grid
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  trustCard: {
    width: GRID_CARD_WIDTH, // Reusing card width for consistency
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  trustTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  trustDesc: {
    fontSize: 10,
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 14,
  },
});