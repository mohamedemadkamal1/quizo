import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageStore } from '@/store/language.store';

export function LanguageRestartOverlay() {
  const { t } = useTranslation();
  const { directionStyle } = useLanguageDirection();
  const isRestarting = useLanguageStore((state) => state.isRestarting);
  const restartError = useLanguageStore((state) => state.restartError);
  const dismissRestartError = useLanguageStore(
    (state) => state.dismissRestartError,
  );

  if (!isRestarting && !restartError) {
    return null;
  }

  if (isRestarting) {
    return (
      <View
        accessibilityLabel={t('language.switchingAccessibilityLabel')}
        accessibilityLiveRegion="assertive"
        accessibilityRole="progressbar"
        accessible
        pointerEvents="auto"
        style={[styles.overlay, directionStyle]}
      >
        <ActivityIndicator color="#7C3AED" size="large" />
        <AppText style={styles.loadingMessage}>
          {t('language.switching')}
        </AppText>
      </View>
    );
  }

  return (
    <View
      accessibilityLabel={t('language.restartErrorAccessibilityLabel')}
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
      accessible
      pointerEvents="auto"
      style={[styles.overlay, directionStyle]}
    >
      <View style={styles.errorCard}>
        <AppText style={styles.errorTitle}>
          {t('language.restartErrorTitle')}
        </AppText>
        <AppText style={styles.errorBody}>{t('language.restartError')}</AppText>
        <Pressable
          accessibilityRole="button"
          onPress={dismissRestartError}
          style={styles.button}
        >
          <AppText style={styles.buttonLabel}>
            {t('language.dismissRestartError')}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2000,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  loadingMessage: {
    marginTop: 18,
    color: '#1E1A4D',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9D6FF',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#F7F8FF',
  },
  errorTitle: {
    color: '#1E1A4D',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBody: {
    marginTop: 10,
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    minWidth: 150,
    minHeight: 48,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingHorizontal: 22,
    backgroundColor: '#7C3AED',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
