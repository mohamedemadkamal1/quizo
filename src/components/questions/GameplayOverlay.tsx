import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PauseOverlayContent } from '@/components/questions/PauseOverlayContent';
import { QuitOverlayContent } from '@/components/questions/QuitOverlayContent';
import {
  GAMEPLAY_MODAL_MAX_WIDTH,
  GAMEPLAY_MODAL_REFERENCE_HEIGHT,
  GAMEPLAY_MODAL_REFERENCE_WIDTH,
} from '@/constants/questions';
import type { GameplayOverlay, QuitDestination } from '@/types/questions.types';

type GameplayOverlayHostProps = {
  overlay: GameplayOverlay;
  onResume: () => void;
  onRequestQuit: (destination: QuitDestination) => void;
  onCancelQuit: () => void;
  onConfirmQuit: () => void;
  onRequestClose: () => void;
};

export function GameplayOverlayHost({
  overlay,
  onResume,
  onRequestQuit,
  onCancelQuit,
  onConfirmQuit,
  onRequestClose,
}: GameplayOverlayHostProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const margin = 8;
  const availableHeight =
    windowHeight - insets.top - insets.bottom - margin * 2;
  const panelWidth = Math.min(
    GAMEPLAY_MODAL_MAX_WIDTH,
    windowWidth - margin * 2,
    (availableHeight * GAMEPLAY_MODAL_REFERENCE_WIDTH) /
      GAMEPLAY_MODAL_REFERENCE_HEIGHT,
  );
  const panelHeight =
    panelWidth *
    (GAMEPLAY_MODAL_REFERENCE_HEIGHT / GAMEPLAY_MODAL_REFERENCE_WIDTH);
  const scale = panelWidth / GAMEPLAY_MODAL_REFERENCE_WIDTH;

  return (
    <Modal
      animationType="fade"
      navigationBarTranslucent
      onRequestClose={onRequestClose}
      statusBarTranslucent
      transparent
      visible={overlay !== null}
    >
      <View
        style={[
          styles.backdrop,
          {
            paddingTop: insets.top + margin,
            paddingBottom: insets.bottom + margin,
          },
        ]}
      >
        <View
          style={[
            styles.panelShadow,
            {
              width: panelWidth,
              height: panelHeight,
              borderRadius: 60 * scale,
            },
          ]}
        >
          <View style={[styles.panelClip, { borderRadius: 60 * scale }]}>
            {overlay === 'pause' ? (
              <PauseOverlayContent
                onBackToMap={() => onRequestQuit('map')}
                onHome={() => onRequestQuit('home')}
                onResume={onResume}
                scale={scale}
              />
            ) : null}

            {overlay === 'quit' ? (
              <QuitOverlayContent
                onCancel={onCancelQuit}
                onConfirm={onConfirmQuit}
                scale={scale}
              />
            ) : null}
          </View>
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
    paddingHorizontal: 8,
    backgroundColor: 'rgba(12, 10, 9, 0.48)',
  },
  panelShadow: {
    backgroundColor: '#C6D2FF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.34,
    shadowRadius: 10,
    elevation: 10,
  },
  panelClip: {
    flex: 1,
    overflow: 'hidden',
  },
});
