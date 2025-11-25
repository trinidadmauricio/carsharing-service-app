/**
 * VehicleCard Component
 * Vehicle card for search results with swipeable gallery and key info
 */

import React, { useState, useCallback, memo } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/atoms/Text';
import { Badge } from '@/components/atoms/Badge';
import { Card } from '@/components/atoms/Card';
import { useThemeColors, palette, spacing, borderRadius, shadows } from '@/theme';
import { formatDistance } from '@/hooks';
import type { VehicleListItem, VehicleFeature, FEATURE_DISPLAY } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = spacing['4'];
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const IMAGE_HEIGHT = 180;

interface VehicleCardProps {
  vehicle: VehicleListItem;
  onPress?: (vehicle: VehicleListItem) => void;
  onFavoritePress?: (vehicleId: string, isFavorite: boolean) => void;
  style?: object;
}

export const VehicleCard: React.FC<VehicleCardProps> = memo(({
  vehicle,
  onPress,
  onFavoritePress,
  style,
}) => {
  const colors = useThemeColors();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const favoriteScale = useSharedValue(1);

  // Handle image pagination
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentImageIndex(viewableItems[0].index);
      }
    },
    []
  );

  // Handle card press
  const handlePress = useCallback(() => {
    onPress?.(vehicle);
  }, [onPress, vehicle]);

  // Handle favorite press with animation
  const handleFavoritePress = useCallback(() => {
    favoriteScale.value = withSpring(0.8, { damping: 15 }, () => {
      favoriteScale.value = withSpring(1, { damping: 10 });
    });
    onFavoritePress?.(vehicle.id, vehicle.isFavorite ?? false);
  }, [favoriteScale, onFavoritePress, vehicle.id, vehicle.isFavorite]);

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  // Get display features (max 3)
  const displayFeatures = vehicle.features.slice(0, 3);

  return (
    <Pressable onPress={handlePress} style={[styles.container, style]}>
      <Card variant="elevated" style={styles.card}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <FlatList
            data={vehicle.photos.slice(0, 5)}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.url || vehicle.primaryPhotoUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH,
              offset: CARD_WIDTH * index,
              index,
            })}
          />

          {/* Image pagination dots */}
          {vehicle.photos.length > 1 && (
            <View style={styles.pagination}>
              {vehicle.photos.slice(0, 5).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Favorite button */}
          <Animated.View style={[styles.favoriteButton, favoriteAnimatedStyle]}>
            <Pressable
              onPress={handleFavoritePress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                vehicle.isFavorite ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Ionicons
                name={vehicle.isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={vehicle.isFavorite ? palette.red[500] : '#FFFFFF'}
              />
            </Pressable>
          </Animated.View>

          {/* Price badge */}
          <View style={styles.priceBadge}>
            <Text variant="h4" style={styles.priceText}>
              ${vehicle.dailyRate}
            </Text>
            <Text variant="caption" style={styles.priceUnit}>
              /day
            </Text>
          </View>

          {/* Instant Book badge */}
          {vehicle.instantBookEnabled && (
            <View style={styles.instantBadge}>
              <Ionicons name="flash" size={12} color="#FFFFFF" />
              <Text variant="caption" style={styles.instantText}>
                Instant
              </Text>
            </View>
          )}
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoContainer}>
          {/* Title row */}
          <View style={styles.titleRow}>
            <Text variant="h4" numberOfLines={1} style={styles.title}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={palette.yellow[500]} />
              <Text variant="body2" style={styles.ratingText}>
                {vehicle.rating.toFixed(1)}
              </Text>
              <Text variant="caption" style={styles.reviewCount}>
                ({vehicle.reviewCount})
              </Text>
            </View>
          </View>

          {/* Host info & distance */}
          <View style={styles.metaRow}>
            <View style={styles.hostInfo}>
              {vehicle.hostIsSuperHost && (
                <Badge variant="success" size="sm">
                  Superhost
                </Badge>
              )}
              <Ionicons
                name="star"
                size={12}
                color={palette.gray[400]}
                style={styles.hostIcon}
              />
              <Text variant="caption" style={styles.hostRating}>
                {vehicle.hostRating.toFixed(1)} host
              </Text>
            </View>
            {vehicle.distanceFromUser !== undefined && (
              <View style={styles.distanceInfo}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={palette.gray[500]}
                />
                <Text variant="caption" style={styles.distanceText}>
                  {formatDistance(vehicle.distanceFromUser)}
                </Text>
              </View>
            )}
          </View>

          {/* Features */}
          <View style={styles.featuresRow}>
            <FeatureChip icon="car-outline" label={vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'} />
            <FeatureChip icon="people-outline" label={`${vehicle.type}`} />
            {displayFeatures.includes('bluetooth') && (
              <FeatureChip icon="bluetooth" label="Bluetooth" />
            )}
            {displayFeatures.includes('gps') && (
              <FeatureChip icon="navigate-outline" label="GPS" />
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

VehicleCard.displayName = 'VehicleCard';

// Feature chip sub-component
interface FeatureChipProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const FeatureChip: React.FC<FeatureChipProps> = ({ icon, label }) => {
  return (
    <View style={styles.featureChip}>
      <Ionicons name={icon} size={12} color={palette.gray[600]} />
      <Text variant="caption" style={styles.featureText}>
        {label}
      </Text>
    </View>
  );
};

// Skeleton loader
export const VehicleCardSkeleton: React.FC = () => {
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withTiming(1, { duration: 1000 }, () => {
      shimmer.value = 0;
    });
    const interval = setInterval(() => {
      shimmer.value = withTiming(1, { duration: 1000 }, () => {
        shimmer.value = 0;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]),
  }));

  return (
    <View style={[styles.container, styles.skeletonContainer]}>
      <Card variant="elevated" style={styles.card}>
        <Animated.View style={[styles.skeletonImage, shimmerStyle]} />
        <View style={styles.infoContainer}>
          <Animated.View style={[styles.skeletonTitle, shimmerStyle]} />
          <Animated.View style={[styles.skeletonMeta, shimmerStyle]} />
          <Animated.View style={[styles.skeletonFeatures, shimmerStyle]} />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: CARD_MARGIN,
    marginBottom: spacing['4'],
  },
  skeletonContainer: {
    opacity: 0.7,
  },
  card: {
    overflow: 'hidden',
    padding: 0,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: palette.gray[200],
    position: 'relative',
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  pagination: {
    position: 'absolute',
    bottom: spacing['2'],
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['1'],
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing['3'],
    right: spacing['3'],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadge: {
    position: 'absolute',
    bottom: spacing['3'],
    left: spacing['3'],
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.md,
  },
  priceText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  priceUnit: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 2,
  },
  instantBadge: {
    position: 'absolute',
    top: spacing['3'],
    left: spacing['3'],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.primary[500],
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.full,
    gap: spacing['1'],
  },
  instantText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoContainer: {
    padding: spacing['3'],
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  title: {
    flex: 1,
    marginRight: spacing['2'],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: spacing['1'],
    fontWeight: '600',
  },
  reviewCount: {
    marginLeft: spacing['0.5'],
    color: palette.gray[500],
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostIcon: {
    marginLeft: spacing['2'],
  },
  hostRating: {
    marginLeft: spacing['1'],
    color: palette.gray[600],
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    marginLeft: spacing['1'],
    color: palette.gray[600],
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['2'],
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.gray[100],
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: borderRadius.full,
    gap: spacing['1'],
  },
  featureText: {
    color: palette.gray[700],
  },
  // Skeleton styles
  skeletonImage: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: palette.gray[300],
  },
  skeletonTitle: {
    width: '70%',
    height: 20,
    backgroundColor: palette.gray[300],
    borderRadius: borderRadius.sm,
    marginBottom: spacing['2'],
  },
  skeletonMeta: {
    width: '50%',
    height: 14,
    backgroundColor: palette.gray[300],
    borderRadius: borderRadius.sm,
    marginBottom: spacing['3'],
  },
  skeletonFeatures: {
    width: '80%',
    height: 24,
    backgroundColor: palette.gray[300],
    borderRadius: borderRadius.full,
  },
});

export default VehicleCard;
