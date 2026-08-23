import { StyleSheet, type ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
});

/**
 * Mirrors an icon that points along the reading direction — chevrons, back
 * arrows and "continue" affordances.
 *
 * Deliberately not applied to the Quizo logo, flags, avatars, mascots or any
 * other artwork, which reads the same in both languages.
 */
export function getDirectionalIconStyle(isRTL: boolean): ViewStyle | null {
  return isRTL ? styles.mirrored : null;
}
