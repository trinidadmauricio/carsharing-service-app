import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Carsharing SV',
  slug: 'carsharing-sv',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  scheme: 'carsharing',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#667eea',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.carsharingsv.app',
    infoPlist: {
      NSCameraUsageDescription: 'We need camera access to capture vehicle photos and verify your identity.',
      NSPhotoLibraryUsageDescription: 'We need photo library access to upload vehicle photos.',
      NSLocationWhenInUseUsageDescription: 'We need your location to find vehicles near you.',
      NSFaceIDUsageDescription: 'We use Face ID to securely log you in.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#667eea',
    },
    package: 'com.carsharingsv.app',
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'USE_BIOMETRIC',
      'USE_FINGERPRINT',
    ],
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-web-browser',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Carsharing SV to access your camera for vehicle photos and identity verification.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Carsharing SV to access your photos for vehicle uploads.',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow Carsharing SV to use your location to find nearby vehicles.',
      },
    ],
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow Carsharing SV to use Face ID for secure authentication.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiMode: process.env.EXPO_PUBLIC_API_MODE ?? 'mock',
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
    deepLinkScheme: process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME ?? 'carsharing',
    env: process.env.EXPO_PUBLIC_ENV ?? 'dev',
    eas: {
      projectId: 'your-project-id',
    },
  },
});
