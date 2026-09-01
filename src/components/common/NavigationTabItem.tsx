import type { BottomTabBarButtonProps } from 'expo-router/js-tabs';
import { type ComponentType, type ReactNode, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';

type NavigationTabItemProps = {
  label: string;
  focused: boolean;
  bottomInset: number;
  showDivider: boolean;
  icon: ReactNode;
};

// React Navigation's button includes web href support that React Native's
// Pressable runtime accepts but its native TypeScript definition omits.
const TabBarPressable =
  Pressable as unknown as ComponentType<BottomTabBarButtonProps>;

export function NavigationTabButton(props: BottomTabBarButtonProps) {
  const { style, ...buttonProps } = props;

  return (
    <TabBarPressable
      {...buttonProps}
      accessibilityRole="button"
      style={[style, styles.button]}
    />
  );
}

export function NavigationTabItem({
  label,
  focused,
  bottomInset,
  showDivider,
  icon,
}: NavigationTabItemProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(rotation);

    if (focused) {
      rotation.value = 0;
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 3200,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    } else {
      rotation.value = 0;
    }

    return () => cancelAnimation(rotation);
  }, [focused, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.item}
    >
      {focused ? (
        <View style={[styles.itemFocused, { bottom: -bottomInset }]} />
      ) : null}

      <Animated.View style={[styles.icon, animatedIconStyle]}>
        {icon}
      </Animated.View>

      <AppText
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        numberOfLines={1}
        style={[styles.label, focused && styles.labelFocused]}
      >
        {label}
      </AppText>

      {!focused && showDivider ? <View style={styles.divider} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: '100%',
    width: '100%',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  item: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 8,
  },

  itemFocused: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.navigation.activeTabBorder,
    backgroundColor: colors.navigation.activeTabBackground,
  },

  icon: {
    width: '100%',
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    maxWidth: '100%',
    color: colors.navigation.tabLabel,
    fontFamily: 'Fredoka',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    textAlign: 'center',
    includeFontPadding: false,
  },

  labelFocused: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 17,
  },

  divider: {
    position: 'absolute',
    right: 0,
    width: 1,
    height: '58%',
    backgroundColor: colors.navigation.tabDivider,
  },
});
