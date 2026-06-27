import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  // Demo keys (hardcoded for team sharing, hackathon only - do NOT use in production)
  // .env can still override if present
  const googleMapsAndroidKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY ||
    'AIzaSy_REPLACE_WITH_YOUR_ANDROID_MAPS_KEY';
  const googleMapsIosKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY ||
    'AIzaSy_REPLACE_WITH_YOUR_IOS_MAPS_KEY';
  const googlePlacesKey =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY ||
    'AIzaSy_REPLACE_WITH_YOUR_PLACES_KEY';

  const geminiApiKey =
    process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
    'REPLACE_WITH_YOUR_GEMINI_OR_LLM_KEY'; // 拍拍 key - 请替换为自己的（从 AI Studio 或 keyllm 获取）

  return {
    ...config,
    name: 'Paipai',
    slug: 'paipai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'paipai',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.paipai.hackathon',
      config: {
        googleMapsApiKey: googleMapsIosKey,
      },
      infoPlist: {
        NSCameraUsageDescription: 'Paipai needs camera access to help you capture great shots',
        NSLocationWhenInUseUsageDescription: 'Paipai needs your location to show nearby photo spots',
      },
    },
    android: {
      package: 'com.paipai.hackathon',
      adaptiveIcon: {
        backgroundColor: '#1A73E8',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
      },
      permissions: ['CAMERA', 'ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: googleMapsAndroidKey,
        },
      },
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-camera',
        {
          cameraPermission: 'Paipai needs camera access to help you capture great shots',
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          resizeMode: 'contain',
          backgroundColor: '#1A73E8',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      googleMapsAndroidKey,
      googleMapsIosKey,
      googlePlacesKey,
      geminiApiKey,
    },
  };
};