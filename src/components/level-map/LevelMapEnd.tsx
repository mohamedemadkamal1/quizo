import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { LEVEL_MAP_BOUNDARY_HEIGHT } from '@/constants/level-map';
import { useTranslation } from '@/hooks/useTranslation';

export function LevelMapEnd() {
  const { t } = useTranslation();

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      <View style={styles.glow} />
      <AppText style={styles.crown}>{'\u{1F451}'}</AppText>
      <AppText style={styles.label}>{t('levelMap.journeyComplete')}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: LEVEL_MAP_BOUNDARY_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  crown: {
    fontSize: 42,
  },
  label: {
    marginTop: 4,
    fontFamily: 'Fredoka',
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
