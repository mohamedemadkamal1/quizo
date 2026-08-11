import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CloseGlyph, DoorGlyph } from '@/components/questions/QuestionIcons';
import { gameplayColors, gameplayGradients } from '@/constants/questions';

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
        accessibilityLabel="Cancel quitting"
        accessibilityRole="button"
        android_ripple={{ color: 'rgba(255, 159, 10, 0.1)' }}
        onPress={onCancel}
        style={[
          styles.close,
          {
            top: 27 * scale - closeOffset,
            right: 30 * scale - closeOffset,
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

      <Text
        accessibilityRole="header"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
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
        Are you Sure You Want to <Text style={styles.quitAccent}>Quit?</Text>
      </Text>

      <Pressable
        accessibilityLabel="Yes, quit questions"
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
        <Text
          style={[
            styles.confirmLabel,
            { fontSize: 33 * scale, lineHeight: 41 * scale },
          ]}
        >
          Yes, quit
        </Text>
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
