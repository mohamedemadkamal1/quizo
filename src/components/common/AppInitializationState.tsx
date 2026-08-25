import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { useTranslation } from '@/hooks/useTranslation';

type AppInitializationStateProps = {
  error: boolean;
  onRetry: () => void;
};

export function AppInitializationState({
  error,
  onRetry,
}: AppInitializationStateProps) {
  const { t } = useTranslation();
  const { directionStyle } = useLanguageDirection();

  if (!error) {
    return (
      <View
        accessibilityLabel={t('initialization.loading')}
        accessibilityLiveRegion="polite"
        accessibilityRole="progressbar"
        accessible
        style={[styles.container, directionStyle]}
      >
        <ActivityIndicator color="#7C3AED" size="large" />
        <AppText style={styles.loadingText}>
          {t('initialization.loading')}
        </AppText>
      </View>
    );
  }

  return (
    <View
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      style={[styles.container, directionStyle]}
    >
      <AppText style={styles.errorTitle}>
        {t('initialization.errorTitle')}
      </AppText>
      <AppText style={styles.errorBody}>
        {t('initialization.errorBody')}
      </AppText>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={styles.button}
      >
        <AppText style={styles.buttonLabel}>{t('initialization.retry')}</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    color: '#1E1A4D',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorTitle: {
    color: '#1E1A4D',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBody: {
    maxWidth: 420,
    marginTop: 10,
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    minHeight: 48,
    marginTop: 22,
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 24,
    backgroundColor: '#7C3AED',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
