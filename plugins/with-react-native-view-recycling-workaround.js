const { withMainApplication } = require('@expo/config-plugins');

const FEATURE_FLAGS_IMPORT =
  'import com.facebook.react.internal.featureflags.ReactNativeFeatureFlags\n' +
  'import com.facebook.react.internal.featureflags.ReactNativeNewArchitectureFeatureFlagsDefaults\n';

const FEATURE_FLAGS_OVERRIDE = `    // Work around an Android Fabric/react-native-screens transition crash caused by
    // recycled native views being reattached before their previous transition ends.
    ReactNativeFeatureFlags.dangerouslyForceOverride(
      object : ReactNativeNewArchitectureFeatureFlagsDefaults() {
        override fun enableViewRecyclingForImage(): Boolean = false
        override fun enableViewRecyclingForText(): Boolean = false
        override fun enableViewRecyclingForView(): Boolean = false
      }
    )
`;

module.exports = function withReactNativeViewRecyclingWorkaround(config) {
  return withMainApplication(config, (applicationConfig) => {
    if (applicationConfig.modResults.language !== 'kt') {
      throw new Error(
        'The React Native view-recycling workaround requires a Kotlin MainApplication.',
      );
    }

    let contents = applicationConfig.modResults.contents;

    if (!contents.includes('ReactNativeFeatureFlags.dangerouslyForceOverride')) {
      const importAnchor = 'import com.facebook.react.ReactHost\n';
      const loadAnchor = '    loadReactNative(this)\n';

      if (!contents.includes(importAnchor) || !contents.includes(loadAnchor)) {
        throw new Error(
          'Unable to locate the expected Expo MainApplication anchors.',
        );
      }

      contents = contents
        .replace(importAnchor, `${importAnchor}${FEATURE_FLAGS_IMPORT}`)
        .replace(loadAnchor, `${loadAnchor}${FEATURE_FLAGS_OVERRIDE}`);
    }

    applicationConfig.modResults.contents = contents;
    return applicationConfig;
  });
};
