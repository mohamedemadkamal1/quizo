import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
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
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <SafeAreaView style={styles.stateSafeArea}>
      <View style={styles.statePanel}>
        <Text style={styles.stateMessage}>{message}</Text>
        <Text accessibilityRole="button" onPress={onClose} style={styles.backLink}>
          Back to Home
        </Text>
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

    const positionKey = `${screen.response?.difficulty}:${screen.derived?.currentLevel?.number ?? 'complete'}:${screen.presentationLevels.length}`;
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
        message="This level-map link is invalid."
        onClose={screen.handleClose}
      />
    );
  }

  if (screen.status === 'loading') {
    return (
      <LevelMapStatePanel
        message="Loading level map…"
        onClose={screen.handleClose}
      />
    );
  }

  if (screen.status === 'error') {
    return (
      <LevelMapStatePanel
        message={screen.errorMessage ?? 'Unable to load this level map.'}
        onClose={screen.handleClose}
      />
    );
  }

  if (!screen.category || !screen.theme || !screen.response || !screen.derived) {
    return (
      <LevelMapStatePanel
        message="No levels are available yet."
        onClose={screen.handleClose}
      />
    );
  }

  const { category, theme, response, derived } = screen;

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
            totalLevels={response.totalLevels}
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
              offset:
                LEVEL_MAP_BOUNDARY_HEIGHT + index * LEVEL_MAP_ROW_HEIGHT,
            })}
            initialNumToRender={10}
            keyExtractor={(level) => level.id}
            ListHeaderComponent={
              derived.hasHiddenLevels ? (
                <LevelFogBoundary
                  revealKey={
                    derived.visibleLevels[derived.visibleLevels.length - 1]
                      ?.number ?? 0
                  }
                  theme={theme}
                />
              ) : (
                <LevelMapEnd />
              )
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
});
