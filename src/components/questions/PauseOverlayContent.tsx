import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  CloseGlyph,
  GoldPauseGlyph,
} from '@/components/questions/QuestionIcons';
import { gameplayColors } from '@/constants/questions';

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
        <Text
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
        </Text>
        {house ? (
          <Text
            accessible={false}
            style={{ fontSize: 29 * scale, lineHeight: 36 * scale }}
          >
            🏠
          </Text>
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
  const closeIconSize = 48 * scale;
  const closeOffset = (44 - closeIconSize) / 2;

  return (
    <View accessibilityViewIsModal style={styles.panel}>
      <Pressable
        accessibilityLabel="Close pause and resume questions"
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(255, 255, 255, 0.12)' }}
        onPress={onResume}
        style={[
          styles.close,
          {
            top: 28 * scale - closeOffset,
            right: 29 * scale - closeOffset,
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

      <Text
        accessibilityRole="header"
        style={[
          styles.heading,
          {
            top: 171 * scale,
            fontSize: 56 * scale,
            lineHeight: 67 * scale,
          },
        ]}
      >
        Pause
      </Text>

      <PauseActionButton
        accessibilityLabel="Resume questions"
        label="Resume"
        onPress={onResume}
        primary
        scale={scale}
        top={281}
      />
      <PauseActionButton
        accessibilityLabel="Back to level map"
        label="Back to Map"
        onPress={onBackToMap}
        scale={scale}
        top={422}
      />
      <PauseActionButton
        accessibilityLabel="Go to Home"
        house
        label="Home"
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
  },
  actionLabel: {
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
