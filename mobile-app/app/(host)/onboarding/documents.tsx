/**
 * Host Onboarding - Documents Upload Page
 * Upload driver license, registration, and insurance documents
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { Divider } from '@/components/atoms/Divider';
import { useThemeColors, palette } from '@/theme';
import { spacing } from '@/theme/spacing';

interface DocumentUpload {
  id: string;
  title: string;
  description: string;
  icon: string;
  required: boolean;
  uploaded: boolean;
  uploading: boolean;
  imageUri?: string;
  documentType: 'license-front' | 'license-back' | 'registration' | 'insurance';
}

export default function HostOnboardingDocumentsScreen(): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  const [documents, setDocuments] = useState<DocumentUpload[]>([
    {
      id: 'license-front',
      title: 'Driver License (Front)',
      description: 'Clear photo of the front of your valid driver license',
      icon: 'card-outline',
      required: true,
      uploaded: false,
      uploading: false,
      documentType: 'license-front',
    },
    {
      id: 'license-back',
      title: 'Driver License (Back)',
      description: 'Clear photo of the back of your driver license',
      icon: 'card-outline',
      required: true,
      uploaded: false,
      uploading: false,
      documentType: 'license-back',
    },
    {
      id: 'registration',
      title: 'Vehicle Registration',
      description: 'Current vehicle registration document',
      icon: 'newspaper-outline',
      required: true,
      uploaded: false,
      uploading: false,
      documentType: 'registration',
    },
    {
      id: 'insurance',
      title: 'Insurance Policy',
      description: 'Current auto insurance policy document',
      icon: 'shield-outline',
      required: true,
      uploaded: false,
      uploading: false,
      documentType: 'insurance',
    },
  ]);

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to upload documents.'
      );
      return false;
    }
    return true;
  };

  // Handle document upload
  const handleUploadDocument = async (documentId: string): Promise<void> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.9,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        // Update document state to uploading
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? { ...doc, uploading: true } : doc
          )
        );

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Update document state to uploaded
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  uploaded: true,
                  uploading: false,
                  imageUri: result.assets[0].uri,
                }
              : doc
          )
        );
      }
    } catch (error) {
      console.error('Document upload error:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');

      // Reset uploading state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, uploading: false } : doc
        )
      );
    }
  };

  // Handle take photo
  const handleTakePhoto = async (documentId: string): Promise<void> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need camera access to take photos of documents.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.9,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        // Update document state to uploading
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? { ...doc, uploading: true } : doc
          )
        );

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Update document state to uploaded
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId
              ? {
                  ...doc,
                  uploaded: true,
                  uploading: false,
                  imageUri: result.assets[0].uri,
                }
              : doc
          )
        );
      }
    } catch (error) {
      console.error('Photo capture error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');

      // Reset uploading state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId ? { ...doc, uploading: false } : doc
        )
      );
    }
  };

  // Handle remove document
  const handleRemoveDocument = (documentId: string): void => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setDocuments((prev) =>
              prev.map((doc) =>
                doc.id === documentId
                  ? { ...doc, uploaded: false, imageUri: undefined }
                  : doc
              )
            );
          },
        },
      ]
    );
  };

  // Show upload options
  const showUploadOptions = (documentId: string): void => {
    Alert.alert('Upload Document', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => handleTakePhoto(documentId),
      },
      {
        text: 'Choose from Library',
        onPress: () => handleUploadDocument(documentId),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const allRequiredUploaded = documents
    .filter((doc) => doc.required)
    .every((doc) => doc.uploaded);

  const handleContinue = (): void => {
    router.push('/(host)/onboarding/protection' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Upload Documents',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: spacing['4'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2" style={{ color: colors.text.primary }}>
            Verify Your Documents
          </Text>
          <Text
            variant="body2"
            style={{ color: colors.text.secondary, marginTop: spacing['2'] }}
          >
            Please upload clear photos of the required documents. All documents will be reviewed before approval.
          </Text>
        </View>

        {/* Documents List */}
        <View style={styles.documentsList}>
          {documents.map((doc, index) => (
            <React.Fragment key={doc.id}>
              <Card style={styles.documentCard}>
                <View style={styles.documentHeader}>
                  <View
                    style={[
                      styles.documentIcon,
                      { backgroundColor: palette.primary[100] },
                    ]}
                  >
                    <Ionicons
                      name={doc.icon as any}
                      size={24}
                      color={palette.primary[600]}
                    />
                  </View>
                  <View style={styles.documentContent}>
                    <View style={styles.documentTitleRow}>
                      <Text
                        variant="body1"
                        style={{
                          color: colors.text.primary,
                          fontWeight: '600',
                          flex: 1,
                        }}
                      >
                        {doc.title}
                      </Text>
                      {doc.required && (
                        <View
                          style={[
                            styles.requiredBadge,
                            { backgroundColor: palette.error[100] },
                          ]}
                        >
                          <Text
                            variant="caption"
                            style={{ color: palette.error[700], fontWeight: '600' }}
                          >
                            Required
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      variant="body2"
                      style={{
                        color: colors.text.secondary,
                        marginTop: spacing['1'],
                      }}
                    >
                      {doc.description}
                    </Text>
                  </View>
                </View>

                {/* Upload Status */}
                <View style={styles.uploadSection}>
                  {doc.uploading ? (
                    <View style={styles.uploadingContainer}>
                      <ActivityIndicator size="small" color={palette.primary[600]} />
                      <Text
                        variant="body2"
                        style={{
                          color: palette.primary[600],
                          marginLeft: spacing['2'],
                        }}
                      >
                        Uploading...
                      </Text>
                    </View>
                  ) : doc.uploaded ? (
                    <View style={styles.uploadedContainer}>
                      <View style={styles.uploadedInfo}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={palette.success[600]}
                        />
                        <Text
                          variant="body2"
                          style={{
                            color: palette.success[700],
                            marginLeft: spacing['2'],
                            fontWeight: '600',
                          }}
                        >
                          Uploaded
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveDocument(doc.id)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="trash-outline" size={20} color={palette.error[600]} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => showUploadOptions(doc.id)}
                      style={styles.uploadButton}
                    >
                      <View style={styles.uploadButtonContent}>
                        <Ionicons name="cloud-upload-outline" size={18} color={palette.primary[600]} />
                        <Text
                          variant="body2"
                          style={{
                            color: palette.primary[600],
                            marginLeft: spacing['2'],
                            fontWeight: '600',
                          }}
                        >
                          Upload Document
                        </Text>
                      </View>
                    </Button>
                  )}
                </View>
              </Card>
              {index < documents.length - 1 && <View style={styles.cardSpacing} />}
            </React.Fragment>
          ))}
        </View>

        {/* Tips Card */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={20} color={palette.warning[600]} />
            <Text
              variant="body2"
              style={{
                color: palette.warning[900],
                fontWeight: '600',
                marginLeft: spacing['2'],
              }}
            >
              Tips for Great Photos
            </Text>
          </View>
          <Text
            variant="caption"
            style={{
              color: palette.warning[800],
              marginTop: spacing['2'],
              lineHeight: 18,
            }}
          >
            • Ensure good lighting - avoid shadows and glare{'\n'}
            • All text should be clearly readable{'\n'}
            • Capture the entire document within the frame{'\n'}
            • Photos should be in focus and not blurry{'\n'}
            • Document should be flat, not folded or bent
          </Text>
        </Card>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomCTA,
          {
            backgroundColor: colors.background.primary,
            borderTopColor: colors.border.default,
            paddingBottom: insets.bottom + spacing['4'],
          },
        ]}
      >
        <Text
          variant="caption"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            marginBottom: spacing['3'],
          }}
        >
          {documents.filter((d) => d.uploaded).length} of {documents.filter((d) => d.required).length} required documents uploaded
        </Text>
        <Button
          variant="primary"
          size="lg"
          onPress={handleContinue}
          disabled={!allRequiredUploaded}
          style={styles.ctaButton}
        >
          Continue to Protection Plan
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['6'],
  },
  header: {
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['4'],
  },
  documentsList: {
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['4'],
  },
  documentCard: {
    padding: spacing['4'],
  },
  cardSpacing: {
    height: spacing['3'],
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentContent: {
    flex: 1,
    marginLeft: spacing['3'],
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  requiredBadge: {
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['1'],
    borderRadius: 4,
  },
  uploadSection: {
    marginTop: spacing['3'],
  },
  uploadButton: {
    width: '100%',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2'],
  },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing['2'],
  },
  uploadedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    padding: spacing['2'],
  },
  tipsCard: {
    marginHorizontal: spacing['4'],
    padding: spacing['4'],
    backgroundColor: palette.warning[50],
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomCTA: {
    borderTopWidth: 1,
    paddingHorizontal: spacing['4'],
    paddingTop: spacing['4'],
  },
  ctaButton: {
    width: '100%',
  },
});
