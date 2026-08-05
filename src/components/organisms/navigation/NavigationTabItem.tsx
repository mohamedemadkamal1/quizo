import type { BottomTabBarButtonProps } from 'expo-router/js-tabs';
import type { ComponentType, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/tokens';

type NavigationTabItemProps = {
  label: string;
  focused: boolean;
  icon: ReactNode;
};

// React Navigation's button includes web href support that React Native's
// Pressable runtime accepts but its native TypeScript definition omits.
const TabBarPressable = Pressable as unknown as ComponentType<
  BottomTabBarButtonProps
>;

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
  icon,
}: NavigationTabItemProps) {
  const color = focused
    ? colors.navigation.activeTab
    : colors.navigation.inactiveTab;

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.item, focused ? styles.itemFocused : styles.itemDefault]}
    >
      <View style={styles.icon}>{icon}</View>

      <Text numberOfLines={1} style={[styles.label, { color }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 75,
    width: '100%',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  item: {
    flex: 1,
    width: '100%',
    maxWidth: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 10,
    paddingRight: 19,
    paddingBottom: 10,
    paddingLeft: 19,
  },

  itemFocused: {
    borderTopWidth: 2,
    borderTopColor: colors.navigation.activeTab,
    backgroundColor: colors.navigation.activeTabBackground,
    // Keep the icon and label at the same vertical position as the unselected item.
    paddingTop: 8,
  },

  itemDefault: {
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },

  icon: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    alignSelf: 'stretch',
    marginHorizontal: -19,
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
