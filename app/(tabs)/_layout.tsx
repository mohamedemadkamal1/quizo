import { Tabs } from 'expo-router';
import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeTabIcon } from '@/components/common/icons/HomeTabIcon';
import { LeaderboardTabIcon } from '@/components/common/icons/LeaderboardTabIcon';
import { ProfileTabIcon } from '@/components/common/icons/ProfileTabIcon';
import { SettingsTabIcon } from '@/components/common/icons/SettingsTabIcon';
import type { NavigationIconProps } from '@/components/common/icons/types';
import {
  NavigationTabButton,
  NavigationTabItem,
} from '@/components/common/NavigationTabItem';
import { colors } from '@/constants/colors';

const TAB_BAR_CONTENT_HEIGHT = 76;

function TabBarBackground() {
  return <View style={styles.tabBarBackground} />;
}

const tabs = [
  {
    name: 'home',
    label: 'Home',
    Icon: HomeTabIcon,
    inactiveIconColor: colors.navigation.inactiveHomeIcon,
  },
  {
    name: 'profile',
    label: 'Profile',
    Icon: ProfileTabIcon,
    inactiveIconColor: undefined,
  },
  {
    name: 'rank',
    label: 'Rank',
    Icon: LeaderboardTabIcon,
    inactiveIconColor: undefined,
  },
  {
    name: 'settings',
    label: 'Settings',
    Icon: SettingsTabIcon,
    inactiveIconColor: undefined,
  },
] as const satisfies readonly {
  name: string;
  label: string;
  Icon: ComponentType<NavigationIconProps>;
  inactiveIconColor?: string;
}[];

export default function AppLayout() {
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
      {tabs.map(({ name, label, Icon, inactiveIconColor }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarAccessibilityLabel: `${label} tab`,
            tabBarIcon: ({ focused, color }) => (
              <NavigationTabItem
                label={label}
                focused={focused}
                icon={
                  <Icon
                    color={
                      !focused && inactiveIconColor
                        ? inactiveIconColor
                        : color
                    }
                    focused={focused}
                  />
                }
              />
            ),
          }}
        />
      ))}
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
});
