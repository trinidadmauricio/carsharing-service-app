/**
 * Vehicle Detail Page
 * Complete vehicle information with booking CTA
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Pressable,
  ActivityIndicator,
  ViewToken,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Card } from '@/components/atoms/Card';
import { Avatar } from '@/components/atoms/Avatar';
import { Divider } from '@/components/atoms/Divider';
import { useThemeColors, palette, spacing, borderRadius, shadows } from '@/theme';
import {
  useVehicleDetail,
  useFavorites,
  useSimilarVehicles,
  formatDistance,
} from '@/hooks';
import { VehicleCard } from '@/components/molecules/VehicleCard';
import type { VehicleReview, VehicleFeature, FEATURE_DISPLAY } from '@/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.4;

export default function VehicleDetailPage() {
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ id: string }>();
  const vehicleId = params.id;

  const scrollY = useSharedValue(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch vehicle data
  const { data: vehicle, isLoading, isError } = useVehicleDetail(vehicleId);
  const { data: similarVehicles } = useSimilarVehicles(vehicleId, 4);
  const { toggleFavorite, isToggling } = useFavorites();

  // Handle image pagination
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentImageIndex(viewableItems[0].index);
      }
    },
    []
  );

  // Handle favorite toggle
  const handleFavoritePress = useCallback(() => {
    if (vehicle) {
      // Assume isFavorite from context or state
      toggleFavorite(vehicle.id, false);
    }
  }, [vehicle, toggleFavorite]);

  // Handle booking
  const handleBookNow = useCallback(() => {
    if (vehicle) {
      router.push({
        pathname: '/booking/[vehicleId]',
        params: { vehicleId: vehicle.id },
      });
    }
  }, [vehicle]);

  // Animated header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, IMAGE_HEIGHT - 100, IMAGE_HEIGHT],
      [0, 0, 1],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary[500]} />
          <Text variant="body1" style={styles.loadingText}>
            Loading vehicle...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !vehicle) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Ionicons name="car-outline" size={64} color={palette.gray[400]} />
          <Text variant="h3" style={styles.errorTitle}>
            Vehicle not found
          </Text>
          <Text variant="body1" style={styles.errorText}>
            The vehicle you're looking for doesn't exist or is no longer available.
          </Text>
          <Button onPress={() => router.back()} style={styles.backButton}>
            Go back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <Pressable onPress={() => {}} style={styles.headerButton}>
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={handleFavoritePress}
                style={styles.headerButton}
                disabled={isToggling}
              >
                <Ionicons
                  name="heart"
                  size={24}
                  color={palette.red[500]}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      {/* Animated header background */}
      <Animated.View
        style={[
          styles.animatedHeader,
          { backgroundColor: colors.background.primary },
          headerAnimatedStyle,
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Photo Gallery */}
        <View style={styles.galleryContainer}>
          <FlatList
            data={vehicle.photos}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.url }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            )}
            getItemLayout={(_, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />

          {/* Image pagination */}
          <View style={styles.paginationContainer}>
            <View style={styles.paginationBadge}>
              <Text variant="caption" style={styles.paginationText}>
                {currentImageIndex + 1} / {vehicle.photos.length}
              </Text>
            </View>
          </View>

          {/* Instant Book badge */}
          {vehicle.instantBookEnabled && (
            <View style={styles.instantBookBadge}>
              <Ionicons name="flash" size={16} color="#FFFFFF" />
              <Text variant="body2" style={styles.instantBookText}>
                Instant Book
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <Text variant="h2" style={styles.title}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
              {vehicle.trim && (
                <Badge variant="neutral">{vehicle.trim}</Badge>
              )}
            </View>
            <View style={styles.priceRow}>
              <Text variant="h3" style={styles.price}>
                ${vehicle.pricing.dailyRate}
              </Text>
              <Text variant="body1" style={styles.priceUnit}>
                / day
              </Text>
            </View>
            {vehicle.pricing.weeklyDiscount && (
              <Text variant="caption" style={styles.discount}>
                {vehicle.pricing.weeklyDiscount}% off for weekly rentals
              </Text>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <StatItem
              icon="star"
              value={vehicle.rating.toFixed(1)}
              label={`${vehicle.reviewCount} reviews`}
            />
            <StatItem
              icon="location-outline"
              value={vehicle.location.city}
              label={`${vehicle.distanceFromUser ? formatDistance(vehicle.distanceFromUser) : 'Nearby'}`}
            />
            <StatItem
              icon="flash"
              value={vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}
              label={vehicle.fuelType}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Features */}
          <SectionTitle>Features & Amenities</SectionTitle>
          <View style={styles.featuresGrid}>
            {vehicle.features.map((feature) => (
              <FeatureItem key={feature} feature={feature} />
            ))}
          </View>

          <Divider style={styles.divider} />

          {/* Host Info */}
          <SectionTitle>{`Hosted by ${vehicle.host.firstName}`}</SectionTitle>
          <Card variant="outlined" style={styles.hostCard}>
            <Pressable
              onPress={() => {
                // TODO: Implement host profile route
                console.log('Navigate to host profile:', vehicle.host.id);
              }}
              style={styles.hostContent}
            >
              <Avatar
                source={vehicle.host.avatarUrl ?? undefined}
                name={`${vehicle.host.firstName} ${vehicle.host.lastName}`}
                size="lg"
              />
              <View style={styles.hostInfo}>
                <View style={styles.hostNameRow}>
                  <Text variant="h4">
                    {vehicle.host.firstName} {vehicle.host.lastName}
                  </Text>
                  {vehicle.host.isSuperHost && (
                    <Badge variant="success" size="sm">
                      Superhost
                    </Badge>
                  )}
                </View>
                <View style={styles.hostStats}>
                  <Text variant="caption" style={styles.hostStat}>
                    <Ionicons name="star" size={12} color={palette.yellow[500]} />{' '}
                    {vehicle.host.rating.toFixed(1)} ({vehicle.host.reviewCount} reviews)
                  </Text>
                  <Text variant="caption" style={styles.hostStat}>
                    • {vehicle.host.tripsCompleted} trips
                  </Text>
                </View>
                <Text variant="caption" style={styles.hostJoined}>
                  Member since {new Date(vehicle.host.memberSince).getFullYear()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={palette.gray[400]} />
            </Pressable>
          </Card>

          <Divider style={styles.divider} />

          {/* Location */}
          <SectionTitle>Location</SectionTitle>
          <Card variant="outlined" style={styles.locationCard}>
            <View style={styles.locationContent}>
              <Ionicons name="location" size={24} color={palette.primary[500]} />
              <View style={styles.locationInfo}>
                <Text variant="body1" style={styles.locationCity}>
                  {vehicle.location.city}, {vehicle.location.state}
                </Text>
                <Text variant="caption" style={styles.locationAddress}>
                  Exact location shown after booking
                </Text>
              </View>
            </View>
          </Card>

          <Divider style={styles.divider} />

          {/* Reviews */}
          {vehicle.reviews && vehicle.reviews.length > 0 && (
            <>
              <View style={styles.reviewsHeader}>
                <SectionTitle>{`Reviews (${vehicle.reviewCount})`}</SectionTitle>
                <Pressable onPress={() => {}}>
                  <Text variant="body2" style={styles.seeAllLink}>
                    See all
                  </Text>
                </Pressable>
              </View>

              {vehicle.reviews.slice(0, 3).map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}

              <Divider style={styles.divider} />
            </>
          )}

          {/* Rules */}
          <SectionTitle>Vehicle Rules</SectionTitle>
          <View style={styles.rulesList}>
            <RuleItem
              icon={vehicle.rules.smokingAllowed ? 'checkmark-circle' : 'close-circle'}
              label={vehicle.rules.smokingAllowed ? 'Smoking allowed' : 'No smoking'}
              allowed={vehicle.rules.smokingAllowed}
            />
            <RuleItem
              icon={vehicle.rules.petsAllowed ? 'checkmark-circle' : 'close-circle'}
              label={vehicle.rules.petsAllowed ? 'Pets allowed' : 'No pets'}
              allowed={vehicle.rules.petsAllowed}
            />
            {vehicle.rules.mileageLimit && (
              <RuleItem
                icon="speedometer-outline"
                label={`${vehicle.rules.mileageLimit} miles/day limit`}
                allowed={true}
              />
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Similar Vehicles */}
          {similarVehicles && similarVehicles.length > 0 && (
            <>
              <SectionTitle>Similar Vehicles</SectionTitle>
              <FlatList
                data={similarVehicles}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.similarVehicle}>
                    <VehicleCard vehicle={item} onPress={() => router.push(`/vehicle/${item.id}`)} />
                  </View>
                )}
                contentContainerStyle={styles.similarList}
              />
            </>
          )}

          {/* Bottom spacer */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomCTA, { backgroundColor: colors.background.primary }]}>
        <View style={styles.ctaLeft}>
          <Text variant="h4" style={styles.ctaPrice}>
            ${vehicle.pricing.dailyRate}
            <Text variant="body2" style={styles.ctaPriceUnit}>
              {' '}
              / day
            </Text>
          </Text>
          <View style={styles.ctaRating}>
            <Ionicons name="star" size={14} color={palette.yellow[500]} />
            <Text variant="caption" style={styles.ctaRatingText}>
              {vehicle.rating.toFixed(1)} ({vehicle.reviewCount})
            </Text>
          </View>
        </View>
        <Button
          onPress={handleBookNow}
          style={styles.bookButton}
        >
          Book now
        </Button>
      </View>
    </View>
  );
}

// Section Title Component
const SectionTitle: React.FC<{ children: string }> = ({ children }) => (
  <Text variant="h3" style={styles.sectionTitle}>
    {children}
  </Text>
);

// Stat Item Component
interface StatItemProps {
  icon: string;
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon as any} size={20} color={palette.primary[500]} />
    <Text variant="body1" style={styles.statValue}>
      {value}
    </Text>
    <Text variant="caption" style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

// Feature Item Component
interface FeatureItemProps {
  feature: VehicleFeature;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature }) => {
  const getFeatureIcon = (feature: VehicleFeature): string => {
    const iconMap: Record<VehicleFeature, string> = {
      gps: 'navigate',
      bluetooth: 'bluetooth',
      backup_camera: 'videocam',
      apple_carplay: 'logo-apple',
      android_auto: 'logo-android',
      sunroof: 'sunny',
      heated_seats: 'flame',
      leather_seats: 'person',
      child_seat: 'person-add',
      bike_rack: 'bicycle',
      ski_rack: 'snow',
      toll_pass: 'card',
      usb_charger: 'battery-charging',
      aux_input: 'headset',
      keyless_entry: 'key',
      remote_start: 'power',
    };
    return iconMap[feature] || 'checkmark-circle';
  };

  const getFeatureLabel = (feature: VehicleFeature): string => {
    return feature.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <View style={styles.featureItem}>
      <Ionicons name={getFeatureIcon(feature) as any} size={20} color={palette.gray[600]} />
      <Text variant="body2" style={styles.featureLabel}>
        {getFeatureLabel(feature)}
      </Text>
    </View>
  );
};

// Review Item Component
interface ReviewItemProps {
  review: VehicleReview;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <Avatar
        source={review.guestAvatarUrl ?? undefined}
        name={review.guestName}
        size="md"
      />
      <View style={styles.reviewInfo}>
        <Text variant="body1" style={styles.reviewName}>
          {review.guestName}
        </Text>
        <View style={styles.reviewMeta}>
          <Ionicons name="star" size={12} color={palette.yellow[500]} />
          <Text variant="caption" style={styles.reviewRating}>
            {review.rating.toFixed(1)}
          </Text>
          <Text variant="caption" style={styles.reviewDate}>
            • {new Date(review.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
    <Text variant="body2" style={styles.reviewComment} numberOfLines={3}>
      {review.comment}
    </Text>
  </View>
);

// Rule Item Component
interface RuleItemProps {
  icon: string;
  label: string;
  allowed: boolean;
}

const RuleItem: React.FC<RuleItemProps> = ({ icon, label, allowed }) => (
  <View style={styles.ruleItem}>
    <Ionicons
      name={icon as any}
      size={20}
      color={allowed ? palette.green[500] : palette.red[500]}
    />
    <Text variant="body2" style={styles.ruleLabel}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing['4'],
    color: palette.gray[600],
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['6'],
  },
  errorTitle: {
    marginTop: spacing['4'],
    marginBottom: spacing['2'],
  },
  errorText: {
    textAlign: 'center',
    color: palette.gray[600],
    marginBottom: spacing['6'],
  },
  backButton: {
    minWidth: 120,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
    ...shadows.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing['2'],
  },
  headerRight: {
    flexDirection: 'row',
  },
  galleryContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: spacing['4'],
    right: spacing['4'],
  },
  paginationBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.full,
  },
  paginationText: {
    color: '#FFFFFF',
  },
  instantBookBadge: {
    position: 'absolute',
    top: spacing['4'],
    left: spacing['4'],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primary[500],
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['2'],
    borderRadius: borderRadius.full,
    gap: spacing['1'],
  },
  instantBookText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  titleSection: {
    marginBottom: spacing['4'],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginBottom: spacing['2'],
  },
  title: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    color: palette.primary[600],
  },
  priceUnit: {
    color: palette.gray[600],
    marginLeft: spacing['1'],
  },
  discount: {
    color: palette.green[600],
    marginTop: spacing['1'],
  },
  divider: {
    marginVertical: spacing['4'],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '600',
    marginTop: spacing['1'],
  },
  statLabel: {
    color: palette.gray[600],
  },
  sectionTitle: {
    marginBottom: spacing['3'],
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['3'],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    gap: spacing['2'],
  },
  featureLabel: {
    flex: 1,
  },
  hostCard: {
    padding: spacing['3'],
  },
  hostContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostInfo: {
    flex: 1,
    marginLeft: spacing['3'],
  },
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginBottom: spacing['1'],
  },
  hostStats: {
    flexDirection: 'row',
    marginBottom: spacing['0.5'],
  },
  hostStat: {
    color: palette.gray[600],
  },
  hostJoined: {
    color: palette.gray[500],
  },
  locationCard: {
    padding: spacing['3'],
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    marginLeft: spacing['3'],
  },
  locationCity: {
    fontWeight: '500',
    marginBottom: spacing['0.5'],
  },
  locationAddress: {
    color: palette.gray[600],
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  seeAllLink: {
    color: palette.primary[600],
  },
  reviewItem: {
    marginBottom: spacing['4'],
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: spacing['2'],
  },
  reviewInfo: {
    marginLeft: spacing['3'],
  },
  reviewName: {
    fontWeight: '500',
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing['0.5'],
  },
  reviewRating: {
    marginLeft: spacing['1'],
    color: palette.gray[600],
  },
  reviewDate: {
    marginLeft: spacing['1'],
    color: palette.gray[500],
  },
  reviewComment: {
    color: palette.gray[700],
  },
  rulesList: {
    gap: spacing['3'],
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  ruleLabel: {
    flex: 1,
  },
  similarList: {
    paddingRight: spacing['4'],
  },
  similarVehicle: {
    width: SCREEN_WIDTH * 0.7,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['3'],
    borderTopWidth: 1,
    borderTopColor: palette.gray[200],
    ...shadows.lg,
  },
  ctaLeft: {
    flex: 1,
  },
  ctaPrice: {
    marginBottom: spacing['0.5'],
  },
  ctaPriceUnit: {
    color: palette.gray[600],
  },
  ctaRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaRatingText: {
    marginLeft: spacing['1'],
    color: palette.gray[600],
  },
  bookButton: {
    minWidth: 120,
  },
});
