import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { CloseGlyph, DoorGlyph } from '@/components/questions/QuestionIcons';
import { gameplayColors, gameplayGradients } from '@/constants/questions';
import { useTranslation } from '@/hooks/useTranslation';

type QuitOverlayContentProps = {
  scale: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function QuitOverlayContent({
  scale,
  onCancel,
  onConfirm,
}: QuitOverlayContentProps) {
  const { t } = useTranslation();
  const closeIconSize = 48 * scale;
  const closeOffset = (44 - closeIconSize) / 2;

  return (
    <LinearGradient
      accessibilityViewIsModal
      colors={gameplayGradients.quitPanel}
      locations={[0, 0.48, 1]}
      style={styles.panel}
    >
      <Pressable
        accessibilityLabel={t('questions.quitOverlay.cancelLabel')}
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(255, 159, 10, 0.1)' }}
        onPress={onCancel}
        style={[
          styles.close,
          {
            top: 27 * scale - closeOffset,
            end: 30 * scale - closeOffset,
          },
        ]}
      >
        <CloseGlyph color={gameplayColors.orange} size={closeIconSize} />
      </Pressable>

      <View
        pointerEvents="none"
        style={[
          styles.door,
          {
            top: 124 * scale,
            left: 258 * scale,
            width: 100 * scale,
            height: 100 * scale,
          },
        ]}
      >
        <DoorGlyph size={100 * scale} />
      </View>

      <AppText
        accessibilityRole="header"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={[
          styles.heading,
          {
            top: 306 * scale,
            left: 44 * scale,
            width: 528 * scale,
            fontSize: 33 * scale,
            lineHeight: 42 * scale,
          },
        ]}
      >
        {t('questions.quitOverlay.titlePrefix')}
        <AppText style={styles.quitAccent}>
          {t('questions.quitOverlay.titleAccent')}
        </AppText>
      </AppText>

      <Pressable
        accessibilityLabel={t('questions.quitOverlay.confirmLabel')}
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(72, 91, 221, 0.08)' }}
        onPress={onConfirm}
        style={[
          styles.confirm,
          {
            top: 562 * scale,
            left: 33 * scale,
            width: 550 * scale,
            height: 89 * scale,
            borderRadius: 45 * scale,
          },
        ]}
      >
        <AppText
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={1}
          style={[
            styles.confirmLabel,
            { fontSize: 33 * scale, lineHeight: 41 * scale },
          ]}
        >
          {t('questions.quitOverlay.confirm')}
        </AppText>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    overflow: 'hidden',
  },
  close: {
    position: 'absolute',
    zIndex: 3,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  door: {
    position: 'absolute',
  },
  heading: {
    position: 'absolute',
    color: gameplayColors.black,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  quitAccent: {
    color: gameplayColors.orange,
  },
  confirm: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: gameplayColors.border,
    backgroundColor: gameplayColors.surface,
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 5,
    elevation: 5,
  },
  confirmLabel: {
    color: gameplayColors.primaryText,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
