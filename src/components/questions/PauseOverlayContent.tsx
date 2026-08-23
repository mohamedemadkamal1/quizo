import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import {
  CloseGlyph,
  GoldPauseGlyph,
} from '@/components/questions/QuestionIcons';
import { gameplayColors } from '@/constants/questions';
import { useTranslation } from '@/hooks/useTranslation';

type PauseOverlayContentProps = {
  scale: number;
  onResume: () => void;
  onBackToMap: () => void;
  onHome: () => void;
};

type PauseActionButtonProps = {
  label: string;
  accessibilityLabel: string;
  top: number;
  scale: number;
  primary?: boolean;
  house?: boolean;
  onPress: () => void;
};

function PauseActionButton({
  label,
  accessibilityLabel,
  top,
  scale,
  primary = false,
  house = false,
  onPress,
}: PauseActionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      android_ripple={{ color: 'rgba(72, 91, 221, 0.08)' }}
      onPress={onPress}
      style={[
        styles.action,
        {
          top: top * scale,
          left: 33 * scale,
          width: 550 * scale,
          height: 98 * scale,
          borderRadius: 49 * scale,
          borderColor: primary ? gameplayColors.orange : gameplayColors.border,
          backgroundColor: primary
            ? gameplayColors.orange
            : gameplayColors.surface,
        },
      ]}
    >
      <View style={[styles.actionContent, { gap: 8 * scale }]}>
        <AppText
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          numberOfLines={1}
          style={[
            styles.actionLabel,
            {
              color: primary
                ? gameplayColors.white
                : gameplayColors.primaryText,
              fontSize: 33 * scale,
              lineHeight: 41 * scale,
            },
          ]}
        >
          {label}
        </AppText>
        {house ? (
          <AppText
            accessible={false}
            style={{ fontSize: 29 * scale, lineHeight: 36 * scale }}
          >
            🏠
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

export function PauseOverlayContent({
  scale,
  onResume,
  onBackToMap,
  onHome,
}: PauseOverlayContentProps) {
  const { t } = useTranslation();
  const closeIconSize = 48 * scale;
  const closeOffset = (44 - closeIconSize) / 2;

  return (
    <View accessibilityViewIsModal style={styles.panel}>
      <Pressable
        accessibilityLabel={t('questions.pauseOverlay.closeLabel')}
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(255, 255, 255, 0.12)' }}
        onPress={onResume}
        style={[
          styles.close,
          {
            top: 28 * scale - closeOffset,
            end: 29 * scale - closeOffset,
          },
        ]}
      >
        <CloseGlyph size={closeIconSize} />
      </Pressable>

      <View
        pointerEvents="none"
        style={[
          styles.largePause,
          {
            top: 57 * scale,
            left: 258 * scale,
            width: 100 * scale,
            height: 100 * scale,
          },
        ]}
      >
        <GoldPauseGlyph
          barInset={8}
          gradientId="pauseModalGradient"
          size={100 * scale}
        />
      </View>

      <AppText
        accessibilityRole="header"
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        numberOfLines={1}
        style={[
          styles.heading,
          {
            top: 171 * scale,
            fontSize: 56 * scale,
            lineHeight: 67 * scale,
          },
        ]}
      >
        {t('questions.pauseOverlay.title')}
      </AppText>

      <PauseActionButton
        accessibilityLabel={t('questions.pauseOverlay.resumeLabel')}
        label={t('questions.pauseOverlay.resume')}
        onPress={onResume}
        primary
        scale={scale}
        top={281}
      />
      <PauseActionButton
        accessibilityLabel={t('questions.pauseOverlay.backToMapLabel')}
        label={t('questions.pauseOverlay.backToMap')}
        onPress={onBackToMap}
        scale={scale}
        top={422}
      />
      <PauseActionButton
        accessibilityLabel={t('questions.pauseOverlay.homeLabel')}
        house
        label={t('questions.pauseOverlay.home')}
        onPress={onHome}
        scale={scale}
        top={562}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: gameplayColors.background,
  },
  close: {
    position: 'absolute',
    zIndex: 4,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largePause: {
    position: 'absolute',
  },
  heading: {
    position: 'absolute',
    right: 0,
    left: 0,
    color: gameplayColors.heading,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  action: {
    position: 'absolute',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 5,
    elevation: 5,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  actionLabel: {
    minWidth: 0,
    flexShrink: 1,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
