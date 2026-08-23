import { Tabs } from 'expo-router';
import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeTabIcon } from '@/components/common/icons/HomeTabIcon';
import { LeaderboardTabIcon } from '@/components/common/icons/LeaderboardTabIcon';
import { ProfileTabIcon } from '@/components/common/icons/ProfileTabIcon';
import type { NavigationIconProps } from '@/components/common/icons/types';
import {
  NavigationTabButton,
  NavigationTabItem,
} from '@/components/common/NavigationTabItem';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import type { TranslationKey } from '@/i18n';

const TAB_BAR_CONTENT_HEIGHT = 76;

function TabBarBackground() {
  return <View style={styles.tabBarBackground} />;
}

// Translation keys rather than labels, so the tab bar follows the language.
const tabs = [
  {
    name: 'leaderboard',
    labelKey: 'navigation.leaderboard',
    Icon: LeaderboardTabIcon,
    inactiveIconColor: undefined,
  },
  {
    name: 'home',
    labelKey: 'navigation.home',
    Icon: HomeTabIcon,
    inactiveIconColor: colors.navigation.inactiveHomeIcon,
  },
  {
    name: 'profile',
    labelKey: 'navigation.profile',
    Icon: ProfileTabIcon,
    inactiveIconColor: undefined,
  },
] as const satisfies readonly {
  name: string;
  labelKey: TranslationKey;
  Icon: ComponentType<NavigationIconProps>;
  inactiveIconColor?: string;
}[];

export default function AppLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="home"
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.navigation.activeTab,
        tabBarInactiveTintColor: colors.navigation.inactiveTab,
        tabBarBackground: TabBarBackground,
        tabBarButton: NavigationTabButton,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarStyle: [
          styles.tabBar,
          { height: TAB_BAR_CONTENT_HEIGHT + insets.bottom },
        ],
      }}
    >
      {tabs.map(({ name, labelKey, Icon, inactiveIconColor }) => {
        const label = t(labelKey);

        return (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarAccessibilityLabel: t('navigation.tab', { label }),
            tabBarIcon: ({ focused, color }) => (
              <NavigationTabItem
                label={label}
                focused={focused}
                icon={
                  <Icon
                    color={
                      !focused && inactiveIconColor ? inactiveIconColor : color
                    }
                    focused={focused}
                  />
                }
              />
            ),
          }}
        />
        );
      })}
      <Tabs.Screen
        name="level-map"
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: styles.hiddenTab,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    borderTopWidth: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
  },

  tabBarBackground: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: colors.navigation.tabBarBackground,
  },

  tabBarItem: {
    flex: 1,
    height: 75,
  },

  tabBarIcon: {
    width: '100%',
    height: 75,
  },

  hiddenTab: {
    display: 'none',
  },
});
