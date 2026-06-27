const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Custom resolver to safely handle react-native-maps on web vs native.
// This prevents "Importing native-only module" errors (codegenNativeCommands etc.)
// during web bundling while keeping full functionality on iOS/Android.
const webMapsStub = path.resolve(__dirname, './MapViewWebStub.js');

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-maps' || moduleName.startsWith('react-native-maps/')) {
    if (platform === 'web') {
      // On web always return our safe placeholder (no native code, no real package)
      return {
        type: 'sourceFile',
        filePath: webMapsStub,
      };
    }
    // On native: do NOT redirect. Let the default resolver load the real react-native-maps.
    // This way .native files that import it get the real implementation.
  }

  // Fall back to Expo's default resolution (or previous if existed)
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Also keep a simple alias as fallback for some cases
config.resolver.alias = {
  ...config.resolver.alias,
  // We mainly rely on resolveRequest above; this can stay for compatibility
  'react-native-maps$': webMapsStub,
};

module.exports = config;