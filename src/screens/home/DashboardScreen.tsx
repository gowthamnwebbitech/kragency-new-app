import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  RefreshControl,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import colors from '@/theme/colors';
import CommonHeader from '@/components/CommonHeader';
import ScreenContainer from '@/components/ScreenContainer';
import { RootState, AppDispatch } from '@/app/store';
import { fetchHomeGames } from '@/features/home/homeThunk';

const { width } = Dimensions.get('window');
const GRID_CARD_WIDTH = (width - 16 * 2 - 12) / 2;

const TRUST = [
  { id: 1, title: 'Trusted', desc: 'Thousands of users', icon: 'shield' },
  { id: 2, title: 'Secure', desc: 'Safe payments', icon: 'lock' },
  { id: 3, title: 'Fast Payout', desc: 'Instant withdraw', icon: 'zap' },
  { id: 4, title: '24/7 Help', desc: 'Always online', icon: 'headphones' },
];

/* ================= COMPONENT: SKELETON ================= */
const Skeleton = ({ style }: { style: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();
  }, [opacity]);
  return <Animated.View style={[styles.skeletonBase, style, { opacity }]} />;
};

/* ================= COMPONENT: NO INTERNET DESIGN ================= */
const NoInternetView = ({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.centerContainer}>
    <View style={styles.illustrationWrapper}>
      <View style={styles.iconCircle}>
        <Feather name="wifi-off" size={50} color={colors.primary} />
      </View>
      <View style={styles.offlineDot} />
    </View>
    <Text style={styles.errorTitle}>Connection Lost</Text>
    <Text style={styles.errorDesc}>
      Your internet seems to be offline. Please check your WiFi or mobile data.
    </Text>
    <TouchableOpacity
      style={styles.primaryBtn}
      onPress={onRetry}
      activeOpacity={0.8}
    >
      <Feather
        name="rotate-cw"
        size={18}
        color="#FFF"
        style={{ marginRight: 10 }}
      />
      <Text style={styles.primaryBtnText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

/* ================= COMPONENT: NO DATA DESIGN ================= */
const NoDataView = () => (
  <View style={styles.centerContainer}>
    <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
      <Feather name="folder-minus" size={45} color="#94A3B8" />
    </View>
    <Text style={styles.errorTitle}>No Games Found</Text>
    <Text style={styles.errorDesc}>
      We couldn't find any games in this category right now.
    </Text>
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { banners, featuredGames, loading } = useSelector(
    (state: RootState) => state.home,
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const loadData = useCallback(() => {
    if (isConnected !== false) {
      dispatch(fetchHomeGames());
    }
  }, [dispatch, isConnected]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePlayPress = (providerId: number) => {
    if (!isAuthenticated) {
      navigation.dispatch(CommonActions.navigate('Login'));
    } else {
      navigation.navigate('SlotScreen', { providerId });
    }
  };

  const featuredAnimations = useMemo(
    () =>
      featuredGames?.map(() => ({
        opacity: new Animated.Value(0),
        scale: new Animated.Value(0.9),
      })) ?? [],
    [featuredGames],
  );

  useEffect(() => {
    if (!loading && featuredGames?.length) {
      const anims = featuredAnimations.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 450,
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
      Animated.stagger(100, anims).start();
    }
  }, [loading, featuredGames]);

  const renderLoadingSkeleton = () => (
    <View style={styles.content}>
      <View style={styles.bannerBtn}>
        <Skeleton style={styles.bannerSkeleton} />
      </View>
      <View style={styles.skHeader}>
        <Skeleton style={styles.skTitle} />
      </View>
      <View style={styles.featuredGrid}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={styles.gridCard}>
            <Skeleton style={styles.imageContainer} />
            <View style={styles.cardFooter}>
              <View style={{ flex: 1 }}>
                <Skeleton style={styles.skLine1} />
                <Skeleton style={styles.skLine2} />
              </View>
              <Skeleton style={styles.skBtn} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenContainer style={{ backgroundColor: '#FFF' }}>
      <CommonHeader showCart={isAuthenticated} showWallet={isAuthenticated} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {isConnected === false ? (
          <NoInternetView onRetry={loadData} />
        ) : loading && !refreshing ? (
          renderLoadingSkeleton()
        ) : (
          <>
            {/* Banner Section */}
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
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.bannerBtn}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.bannerImage}
                        resizeMode="stretch" // Fixes the zoom issue
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Featured Games</Text>
                <View style={styles.sectionLine} />
              </View>
            </View>

            {featuredGames?.length > 0 ? (
              <View style={styles.featuredGrid}>
                {featuredGames.map((item, index) => {
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
                          <Image
                            source={{ uri: item.logo }}
                            style={styles.cardImage}
                          />
                          <View style={styles.liveBadge}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                          </View>
                        </View>
                        <View style={styles.cardFooter}>
                          <View style={styles.cardInfo}>
                            <Text style={styles.cardName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.cardTime}>
                              {item?.time ?? 'Closing soon'}
                            </Text>
                          </View>
                          <View style={styles.miniPlayBtn}>
                            <Feather
                              name="play"
                              size={12}
                              color="#FFF"
                              fill="#FFF"
                            />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <NoDataView />
            )}

            {/* Trust Section */}
            <View style={[styles.sectionHeader, { marginTop: 40 }]}>
              <View>
                <Text style={styles.sectionTitle}>Why Choose Us</Text>
                <View style={styles.sectionLine} />
              </View>
            </View>
            <View style={styles.trustGrid}>
              {TRUST.map(item => (
                <View key={item.id} style={styles.trustCard}>
                  <View style={styles.trustIcon}>
                    <Feather
                      name={item.icon}
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.trustTitle}>{item.title}</Text>
                  <Text style={styles.trustDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </Animated.ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 60, backgroundColor: '#FFFFFF' },
  // States
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  illustrationWrapper: { position: 'relative', marginBottom: 25 },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  offlineDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  errorDesc: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 35,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  // Skeleton
  skeletonBase: { backgroundColor: '#E2E8F0', borderRadius: 8 },
  bannerSkeleton: {
    width: width - 32,
    height: width * 0.48,
    borderRadius: 20,
    marginTop: 16,
    alignSelf: 'center',
  },
  skHeader: { padding: 16, marginTop: 10 },
  skTitle: { width: 140, height: 20, borderRadius: 4 },
  skLine1: { width: '85%', height: 14, borderRadius: 4, marginBottom: 8 },
  skLine2: { width: '50%', height: 10, borderRadius: 4 },
  skBtn: { width: 30, height: 30, borderRadius: 15 },

  // Layout
  bannerWrapper: { marginTop: 16 },
  bannerBtn: { paddingHorizontal: 16 },
  bannerImage: { width: '100%', height: '100%', borderRadius: 20 },
  sectionHeader: { marginHorizontal: 16, marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: '#0F172A' },
  sectionLine: {
    width: 28,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 4,
  },

  // Grid Cards
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  imageContainer: {
    width: '100%',
    height: GRID_CARD_WIDTH * 0.85,
    backgroundColor: '#F8FAFC',
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  liveText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardFooter: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1, marginRight: 5 },
  cardName: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  cardTime: { fontSize: 10, color: '#64748B', marginTop: 2, fontWeight: '600' },
  miniPlayBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Trust Section
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  trustCard: {
    width: GRID_CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  trustIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  trustTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
  trustDesc: {
    fontSize: 10,
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 5,
    lineHeight: 15,
    fontWeight: '500',
  },
});
