/**
 * Vehicle Photos Screen
 * Photo upload for vehicle listing (8+ photos required)
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Text, Button } from '../../../components/atoms';
import { palette, spacing } from '@/theme';

interface VehiclePhoto {
  id: string;
  uri: string;
  type: 'exterior_front' | 'exterior_rear' | 'exterior_side' | 'interior' | 'detail' | 'general';
  isPrimary: boolean;
  order: number;
}

const PHOTO_CATEGORIES = [
  { value: 'exterior_front', label: 'Front Exterior', required: true },
  { value: 'exterior_rear', label: 'Rear Exterior', required: true },
  { value: 'exterior_side', label: 'Side View', required: true },
  { value: 'interior', label: 'Interior', required: true },
  { value: 'detail', label: 'Details', required: false },
  { value: 'general', label: 'General', required: false },
] as const;

const MIN_PHOTOS = 8;

export default function VehiclePhotosScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow access to your photo library to upload vehicle photos.'
      );
      return false;
    }

    return true;
  };

  const pickImage = async (category: VehiclePhoto['type']): Promise<void> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: VehiclePhoto = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: category,
          isPrimary: photos.length === 0, // First photo is primary
          order: photos.length,
        };

        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async (category: VehiclePhoto['type']): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow camera access to take photos.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: VehiclePhoto = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: category,
          isPrimary: photos.length === 0,
          order: photos.length,
        };

        setPhotos([...photos, newPhoto]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const removePhoto = (photoId: string): void => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updatedPhotos = photos.filter((p) => p.id !== photoId);

          // If removed photo was primary, make first photo primary
          if (updatedPhotos.length > 0) {
            const removedWasPrimary = photos.find((p) => p.id === photoId)?.isPrimary;
            if (removedWasPrimary) {
              updatedPhotos[0].isPrimary = true;
            }
          }

          // Reorder
          const reordered = updatedPhotos.map((p, index) => ({
            ...p,
            order: index,
          }));

          setPhotos(reordered);
        },
      },
    ]);
  };

  const setPrimaryPhoto = (photoId: string): void => {
    const updatedPhotos = photos.map((p) => ({
      ...p,
      isPrimary: p.id === photoId,
    }));
    setPhotos(updatedPhotos);
  };

  const showPhotoOptions = (category: VehiclePhoto['type']): void => {
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: () => takePhoto(category) },
      { text: 'Choose from Library', onPress: () => pickImage(category) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const getPhotosForCategory = (category: VehiclePhoto['type']): VehiclePhoto[] => {
    return photos.filter((p) => p.type === category);
  };

  const hasRequiredPhotos = (): boolean => {
    return photos.length >= MIN_PHOTOS;
  };

  const handleContinue = (): void => {
    if (!hasRequiredPhotos()) {
      Alert.alert(
        'More Photos Needed',
        `Please add at least ${MIN_PHOTOS} photos. You currently have ${photos.length}.`
      );
      return;
    }

    // TODO: Upload photos to server
    // Navigate to location picker
    router.push({
      pathname: '/(host)/vehicle/location' as any,
      params: {
        ...params,
        photoCount: photos.length.toString(),
      },
    });
  };

  const photoCount = photos.length;
  const progress = Math.min((photoCount / MIN_PHOTOS) * 100, 100);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">Vehicle Photos</Text>
          <Text variant="bodyMedium" color="secondary" style={styles.subtitle}>
            Add at least {MIN_PHOTOS} high-quality photos
          </Text>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text variant="caption" color="secondary" style={styles.progressText}>
              {photoCount} / {MIN_PHOTOS} photos
            </Text>
          </View>
        </View>

        {/* Photo Categories */}
        {PHOTO_CATEGORIES.map((category) => {
          const categoryPhotos = getPhotosForCategory(category.value);
          const hasPhotos = categoryPhotos.length > 0;

          return (
            <View key={category.value} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text variant="labelLarge">
                  {category.label}
                  {category.required && <Text style={styles.required}> *</Text>}
                </Text>
                <Text variant="caption" color="secondary">
                  {categoryPhotos.length} photo{categoryPhotos.length !== 1 ? 's' : ''}
                </Text>
              </View>

              <View style={styles.photoGrid}>
                {categoryPhotos.map((photo) => (
                  <Pressable
                    key={photo.id}
                    style={styles.photoCard}
                    onPress={() => setPrimaryPhoto(photo.id)}
                    onLongPress={() => removePhoto(photo.id)}
                  >
                    <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                    {photo.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <Text variant="caption" style={styles.primaryText}>
                          Primary
                        </Text>
                      </View>
                    )}
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removePhoto(photo.id)}
                    >
                      <Text style={styles.removeIcon}>×</Text>
                    </Pressable>
                  </Pressable>
                ))}

                {/* Add Photo Button */}
                <Pressable
                  style={styles.addPhotoCard}
                  onPress={() => showPhotoOptions(category.value)}
                >
                  <Text style={styles.addIcon}>+</Text>
                  <Text variant="caption" color="secondary">
                    Add Photo
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {/* Tips */}
        <View style={styles.tipsBox}>
          <Text variant="labelLarge" style={styles.tipsTitle}>
            Photo Tips
          </Text>
          <Text variant="caption" color="secondary" style={styles.tipItem}>
            • Use natural lighting for best results
          </Text>
          <Text variant="caption" color="secondary" style={styles.tipItem}>
            • Show all angles of your vehicle
          </Text>
          <Text variant="caption" color="secondary" style={styles.tipItem}>
            • Include close-ups of special features
          </Text>
          <Text variant="caption" color="secondary" style={styles.tipItem}>
            • Clean your vehicle before taking photos
          </Text>
          <Text variant="caption" color="secondary" style={styles.tipItem}>
            • First photo will be the primary listing image
          </Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomCTA,
          {
            paddingBottom: insets.bottom + spacing['3'],
          },
        ]}
      >
        <Button onPress={handleContinue} disabled={!hasRequiredPhotos()} fullWidth>
          Continue to Location ({photoCount}/{MIN_PHOTOS})
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.neutral[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    paddingBottom: spacing['24'],
  },
  header: {
    marginBottom: spacing['5'],
  },
  subtitle: {
    marginTop: spacing['2'],
    marginBottom: spacing['4'],
  },
  progressContainer: {
    marginTop: spacing['3'],
  },
  progressBar: {
    height: 8,
    backgroundColor: palette.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary[500],
    borderRadius: 4,
  },
  progressText: {
    marginTop: spacing['2'],
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: spacing['6'],
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  required: {
    color: palette.error[500],
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['3'],
  },
  photoCard: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: palette.neutral[200],
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  primaryBadge: {
    position: 'absolute',
    top: spacing['1'],
    left: spacing['1'],
    backgroundColor: palette.primary[500],
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    borderRadius: 4,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: spacing['1'],
    right: spacing['1'],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  addPhotoCard: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: palette.neutral[300],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  addIcon: {
    fontSize: 32,
    color: palette.neutral[400],
    marginBottom: spacing['1'],
  },
  tipsBox: {
    marginTop: spacing['4'],
    padding: spacing['4'],
    backgroundColor: palette.info[50],
    borderRadius: 12,
  },
  tipsTitle: {
    marginBottom: spacing['2'],
    color: palette.info[700],
  },
  tipItem: {
    marginBottom: spacing['1'],
    lineHeight: 20,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: spacing['4'],
    borderTopWidth: 1,
    borderTopColor: palette.neutral[200],
    shadowColor: palette.neutral[900],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
