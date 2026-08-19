import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Path } from 'react-native-svg';

import { colors } from '@/constants/colors';

const REFERENCE_WIDTH = 600;
const REFERENCE_HEIGHT = 720;
const MAX_MODAL_WIDTH = 430;
const SCREEN_MARGIN = 16;

type LevelStartConfirmationModalProps = {
  visible: boolean;
  levelNumber: number | null;
  isReplay: boolean;
  isStarting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onStart: () => void;
};

function ModalDecorations() {
  return (
    <Svg
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      preserveAspectRatio="none"
      viewBox={`0 0 ${REFERENCE_WIDTH} ${REFERENCE_HEIGHT}`}
      style={StyleSheet.absoluteFill}
    >
      <Path
        d="M60 59 64 66 71 70 64 74 60 82 56 74 50 70 56 66Z"
        fill="#FFFFFF"
      />
      <Path
        d="M402 85 407 92 415 96 407 100 402 108 397 100 389 96 397 92Z"
        fill="#FFFFFF"
      />
      <Path
        d="M129 143c1.6 6.2 6.5 11.1 12.7 12.7-6.2 1.6-11.1 6.5-12.7 12.7-1.6-6.2-6.5-11.1-12.7-12.7 6.2-1.6 11.1-6.5 12.7-12.7Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />
      <Path
        d="M471 168c1.6 6.2 6.5 11.1 12.7 12.7-6.2 1.6-11.1 6.5-12.7 12.7-1.6-6.2-6.5-11.1-12.7-12.7 6.2-1.6 11.1-6.5 12.7-12.7Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />
      <Path
        d="m45 184 5.6 13.1 14.2 1.3-10.7 9.4 3.2 13.9L45 214.4l-12.3 7.3 3.2-13.9-10.7-9.4 14.2-1.3Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function CloseIcon({ size }: { size: number }) {
  return (
    <Svg
      accessible={false}
      pointerEvents="none"
      viewBox="0 0 48 48"
      width={size}
      height={size}
    >
      <Line
        x1="14"
        y1="14"
        x2="34"
        y2="34"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <Line
        x1="34"
        y1="14"
        x2="14"
        y2="34"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </Svg>
  );
}

export function LevelStartConfirmationModal({
  visible,
  levelNumber,
  isReplay,
  isStarting,
  errorMessage,
  onClose,
  onStart,
}: LevelStartConfirmationModalProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const availableHeight =
    windowHeight - insets.top - insets.bottom - SCREEN_MARGIN * 2;
  const modalWidth = Math.min(
    MAX_MODAL_WIDTH,
    windowWidth - SCREEN_MARGIN * 2,
    (availableHeight * REFERENCE_WIDTH) / REFERENCE_HEIGHT,
  );
  const scale = modalWidth / REFERENCE_WIDTH;
  const closeIconSize = 48 * scale;
  const closeTouchOffset = (44 - closeIconSize) / 2;

  if (levelNumber === null) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      navigationBarTranslucent
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View
        style={[
          styles.backdrop,
          {
            paddingTop: insets.top + SCREEN_MARGIN,
            paddingBottom: insets.bottom + SCREEN_MARGIN,
          },
        ]}
      >
        <View
          accessibilityViewIsModal
          style={[
            styles.modal,
            {
              width: modalWidth,
              height: modalWidth * (REFERENCE_HEIGHT / REFERENCE_WIDTH),
              borderRadius: 60 * scale,
            },
          ]}
        >
          <ModalDecorations />

          <Pressable
            accessibilityLabel="Close level confirmation"
            accessibilityRole="button"
            accessibilityState={{ disabled: isStarting }}
            disabled={isStarting}
            onPress={onClose}
            style={[
              styles.closeButton,
              {
                top: 31 * scale - closeTouchOffset,
                right: 34 * scale - closeTouchOffset,
              },
            ]}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.closeIconFeedback,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <CloseIcon size={closeIconSize} />
              </View>
            )}
          </Pressable>

          <View
            style={[
              styles.card,
              {
                top: 263 * scale,
                left: 30 * scale,
                width: 540 * scale,
                height: 426 * scale,
                borderRadius: 62 * scale,
              },
            ]}
          />

          <View
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={[
              styles.characterSlot,
              {
                top: 94 * scale,
                left: 180 * scale,
                width: 240 * scale,
                height: 192 * scale,
              },
            ]}
          >
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="contain"
              source={require('../../assets/images/illustrations/level-map/ready-to-start-character.png')}
              style={styles.character}
            />
          </View>

          <View pointerEvents="none" style={styles.copy}>
            <Text
              accessibilityRole="header"
              style={[
                styles.title,
                {
                  top: 318 * scale,
                  fontSize: 37 * scale,
                  lineHeight: 45 * scale,
                },
              ]}
            >
              {isReplay ? 'Play Again?' : 'Ready To start?'}
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  top: 378 * scale,
                  fontSize: 21 * scale,
                  lineHeight: 27 * scale,
                },
              ]}
            >
              {isReplay ? 'You’re about to replay' : 'You’re about to begin'}
            </Text>
            <Text
              style={[
                styles.level,
                {
                  top: 431 * scale,
                  fontSize: 32 * scale,
                  lineHeight: 41 * scale,
                },
              ]}
            >
              Level {levelNumber}
            </Text>
            {errorMessage ? (
              <Text
                accessibilityRole="alert"
                style={[
                  styles.error,
                  {
                    top: 478 * scale,
                    width: 470 * scale,
                    fontSize: 15 * scale,
                    lineHeight: 19 * scale,
                  },
                ]}
              >
                {errorMessage}
              </Text>
            ) : null}
          </View>

          <Pressable
            accessibilityLabel={
              isReplay
                ? `Replay Level ${levelNumber}`
                : `Start Level ${levelNumber}`
            }
            accessibilityRole="button"
            accessibilityState={{ disabled: isStarting, busy: isStarting }}
            disabled={isStarting}
            onPress={onStart}
            style={[
              styles.startButton,
              {
                top: 522 * scale,
                left: 68 * scale,
                width: 464 * scale,
                height: 108 * scale,
              },
            ]}
          >
            {({ pressed }) => (
              <View
                style={[
                  styles.buttonVisual,
                  pressed && styles.startButtonPressed,
                ]}
              >
                <View
                  pointerEvents="none"
                  style={[
                    styles.buttonShadow,
                    {
                      top: 14 * scale,
                      width: 464 * scale,
                      height: 90 * scale,
                      borderRadius: 46 * scale,
                      shadowOffset: { width: 0, height: 5 * scale },
                      shadowRadius: 5 * scale,
                    },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.buttonWhiteLayer,
                    {
                      top: 11 * scale,
                      width: 464 * scale,
                      height: 92 * scale,
                      borderRadius: 46 * scale,
                    },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.buttonLip,
                    {
                      top: 8 * scale,
                      width: 464 * scale,
                      height: 91 * scale,
                      borderRadius: 46 * scale,
                    },
                  ]}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.buttonSurface,
                    {
                      width: 464 * scale,
                      height: 92 * scale,
                      borderRadius: 46 * scale,
                    },
                  ]}
                >
                  {isStarting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text
                      style={[
                        styles.buttonLabel,
                        { fontSize: 33.5 * scale, lineHeight: 42 * scale },
                      ]}
                    >
                      {isReplay ? 'Let’s Replay' : 'Let’s Play'}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SCREEN_MARGIN,
    backgroundColor: 'rgba(12, 10, 9, 0.54)',
  },
  modal: {
    overflow: 'hidden',
    backgroundColor: colors.settings.background,
  },
  closeButton: {
    position: 'absolute',
    zIndex: 5,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconFeedback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.94 }],
  },
  card: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: colors.activity.cardBackground,
  },
  characterSlot: {
    position: 'absolute',
    zIndex: 3,
  },
  character: {
    width: '100%',
    height: '100%',
  },
  copy: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    color: '#0C0A09',
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  subtitle: {
    position: 'absolute',
    color: '#7E7E7E',
    fontFamily: 'Nunito',
    fontWeight: '500',
    includeFontPadding: false,
    textAlign: 'center',
  },
  level: {
    position: 'absolute',
    color: colors.navigation.activeTab,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
  error: {
    position: 'absolute',
    color: '#B42318',
    fontFamily: 'Nunito',
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    zIndex: 4,
  },
  buttonVisual: {
    flex: 1,
  },
  startButtonPressed: {
    opacity: 0.94,
    transform: [{ translateY: 2 }, { scale: 0.99 }],
  },
  buttonShadow: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(70, 70, 70, 0.34)',
    shadowColor: '#4B4B4B',
    shadowOpacity: 0.3,
    elevation: 3,
  },
  buttonLip: {
    position: 'absolute',
    left: 0,
    backgroundColor: colors.navigation.activeTab,
  },
  buttonWhiteLayer: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#FFFFFF',
  },
  buttonSurface: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.settings.violet,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontFamily: 'Fredoka',
    fontWeight: '600',
    includeFontPadding: false,
    textAlign: 'center',
  },
});
