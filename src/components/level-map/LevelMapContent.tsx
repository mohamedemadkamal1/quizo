import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LevelFogBoundary } from '@/components/level-map/LevelFogBoundary';
import { LevelMapEnd } from '@/components/level-map/LevelMapEnd';
import { LevelMapHeader } from '@/components/level-map/LevelMapHeader';
import { LevelMapRow } from '@/components/level-map/LevelMapRow';
import { LevelStartConfirmationModal } from '@/components/level-map/LevelStartConfirmationModal';
import {
  LEVEL_MAP_BOUNDARY_HEIGHT,
  LEVEL_MAP_ROW_HEIGHT,
} from '@/constants/level-map';
import type { useLevelMapScreen } from '@/hooks/level-map/useLevelMapScreen';
import type { LevelMapLevel } from '@/types/level-map.types';

type LevelMapContentProps = {
  screen: ReturnType<typeof useLevelMapScreen>;
};

function LevelMapStatePanel({
  message,
  actionLabel,
  actionDisabled = false,
  isLoading = false,
  onAction,
}: {
  message: string;
  actionLabel: string;
  actionDisabled?: boolean;
  isLoading?: boolean;
  onAction: () => void;
}) {
  return (
    <SafeAreaView style={styles.stateSafeArea}>
      <View style={styles.statePanel}>
        {isLoading ? (
          <ActivityIndicator
            accessibilityLabel="Loading level map"
            size="large"
          />
        ) : null}
        <Text style={styles.stateMessage}>{message}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={actionDisabled}
          onPress={onAction}
          style={({ pressed }) => [
            styles.stateAction,
            pressed && styles.stateActionPressed,
            actionDisabled && styles.stateActionDisabled,
          ]}
        >
          <Text style={styles.backLink}>{actionLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export function LevelMapContent({ screen }: LevelMapContentProps) {
  const listRef = useRef<FlatList<LevelMapLevel>>(null);
  const positionedKeyRef = useRef<string | null>(null);
  const { width } = useWindowDimensions();
  const mapWidth = Math.min(width, 520);

  const positionCurrentLevel = useCallback(() => {
    if (screen.status !== 'ready' || screen.presentationLevels.length === 0) {
      return;
    }

    const positionKey = `${screen.theme?.difficulty}:${screen.currentLevel?.number ?? 'none'}:${screen.presentationLevels.length}`;
    if (positionedKeyRef.current === positionKey) {
      return;
    }

    positionedKeyRef.current = positionKey;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index: screen.initialScrollIndex,
        animated: false,
        viewPosition: 0.45,
      });
    });
  }, [screen]);

  useEffect(() => {
    positionCurrentLevel();
  }, [positionCurrentLevel]);

  if (screen.status === 'invalid') {
    return (
      <LevelMapStatePanel
        actionLabel="Back to Home"
        message="This level-map link is invalid."
        onAction={screen.handleClose}
      />
    );
  }

  if (screen.status === 'loading') {
    return (
      <LevelMapStatePanel
        actionLabel="Back"
        isLoading
        message="Loading level map…"
        onAction={screen.handleClose}
      />
    );
  }

  if (screen.status === 'error') {
    return (
      <LevelMapStatePanel
        actionDisabled={screen.isRetrying}
        actionLabel="Retry"
        message={screen.errorMessage ?? 'Unable to load this level map.'}
        onAction={screen.handleRetry}
      />
    );
  }

  if (screen.status === 'empty') {
    return (
      <LevelMapStatePanel
        actionLabel="Back to Home"
        message="No levels are available yet."
        onAction={screen.handleClose}
      />
    );
  }

  if (!screen.category || !screen.theme || !screen.data) {
    return null;
  }

  const { category, theme, data } = screen;

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <LinearGradient
          colors={theme.backgroundColors}
          locations={theme.backgroundLocations}
          style={styles.mapSurface}
        >
          <LevelMapHeader
            category={category}
            totalLevels={data.meta.total}
            theme={theme}
            onClose={screen.handleClose}
          />

          <FlatList
            ref={listRef}
            alwaysBounceVertical={false}
            bounces={false}
            data={screen.presentationLevels}
            getItemLayout={(_, index) => ({
              index,
              length: LEVEL_MAP_ROW_HEIGHT,
              offset: LEVEL_MAP_BOUNDARY_HEIGHT + index * LEVEL_MAP_ROW_HEIGHT,
            })}
            initialNumToRender={10}
            keyExtractor={(level) => String(level.id)}
            ListHeaderComponent={
              <View style={styles.boundaryHeader}>
                <LevelFogBoundary
                  mapWidth={mapWidth}
                  revealKey={screen.presentationLevels[0]?.number ?? 0}
                  theme={theme}
                />
                {!screen.hasMoreLevels ? (
                  <View style={StyleSheet.absoluteFill}>
                    <LevelMapEnd />
                  </View>
                ) : null}
              </View>
            }
            maxToRenderPerBatch={10}
            onContentSizeChange={positionCurrentLevel}
            onScrollToIndexFailed={(failure) => {
              listRef.current?.scrollToOffset({
                animated: false,
                offset:
                  LEVEL_MAP_BOUNDARY_HEIGHT +
                  failure.averageItemLength * failure.index,
              });
              positionedKeyRef.current = null;
              requestAnimationFrame(positionCurrentLevel);
            }}
            overScrollMode="never"
            renderItem={({ item, index }) => (
              <LevelMapRow
                level={item}
                mapWidth={mapWidth}
                decoration={screen.decorationPlan.get(item.id) ?? null}
                nextLevel={screen.presentationLevels[index + 1] ?? null}
                onPressLevel={screen.handlePressLevel}
                previousLevel={screen.presentationLevels[index - 1] ?? null}
                theme={theme}
              />
            )}
            scrollEventThrottle={32}
            showsVerticalScrollIndicator={false}
            style={styles.list}
            contentContainerStyle={{
              alignSelf: 'center',
              width: mapWidth,
              paddingBottom: screen.contentBottomPadding,
            }}
            windowSize={7}
          />
        </LinearGradient>
      </SafeAreaView>

      <LevelStartConfirmationModal
        errorMessage={screen.startLevelErrorMessage}
        isStarting={screen.isStartingLevel}
        levelNumber={screen.selectedLevel?.number ?? null}
        onClose={screen.handleCloseLevelStartModal}
        onStart={screen.handleStartSelectedLevel}
        visible={screen.isLevelStartModalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F4F8',
  },
  safeArea: {
    flex: 1,
  },
  mapSurface: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  boundaryHeader: {
    height: LEVEL_MAP_BOUNDARY_HEIGHT,
  },
  stateSafeArea: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  statePanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  stateMessage: {
    fontFamily: 'Fredoka',
    fontSize: 20,
    textAlign: 'center',
    color: '#211A61',
  },
  backLink: {
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '700',
    color: '#6D4DE8',
  },
  stateAction: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  stateActionPressed: {
    opacity: 0.72,
  },
  stateActionDisabled: {
    opacity: 0.5,
  },
});
