import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  NavigationTabButton,
  NavigationTabItem,
} from '@/components/common/NavigationTabItem';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import type { TranslationKey } from '@/i18n';

const TAB_BAR_CONTENT_HEIGHT = 90;

function TabBarBackground() {
  return (
    <LinearGradient
      colors={[colors.navigation.tabBarStart, colors.navigation.tabBarEnd]}
      end={{ x: 0.5, y: 1 }}
      start={{ x: 0.5, y: 0 }}
      style={styles.tabBarBackground}
    />
  );
}

// Translation keys rather than labels, so the tab bar follows the language.
const tabs = [
  {
    name: 'leaderboard',
    labelKey: 'navigation.leaderboard',
    image: require('@/assets/images/navigation/leaderboard.png'),
    iconSize: { default: 52, focused: 66 },
  },
  {
    name: 'home',
    labelKey: 'navigation.home',
    image: require('@/assets/images/navigation/home.png'),
    iconSize: { default: 54, focused: 70 },
  },
  {
    name: 'profile',
    labelKey: 'navigation.setting',
    image: require('@/assets/images/navigation/setting.png'),
    iconSize: { default: 54, focused: 70 },
  },
] as const satisfies readonly {
  name: string;
  labelKey: TranslationKey;
  image: number;
  iconSize: { default: number; focused: number };
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
      {tabs.map(({ name, labelKey, image, iconSize }, index) => {
        const label = t(labelKey);

        return (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: label,
              tabBarAccessibilityLabel: t('navigation.tab', { label }),
              tabBarIcon: ({ focused }) => (
                <NavigationTabItem
                  label={label}
                  focused={focused}
                  bottomInset={insets.bottom}
                  showDivider={index < tabs.length - 1}
                  icon={
                    <Image
                      source={image}
                      resizeMode="contain"
                      style={{
                        width: focused ? iconSize.focused : iconSize.default,
                        height: focused ? iconSize.focused : iconSize.default,
                      }}
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
    paddingHorizontal: 0,
    paddingTop: 0,
    justifyContent: 'space-between',
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
  },

  tabBarBackground: {
    flex: 1,
  },

  tabBarItem: {
    flex: 1,
    height: TAB_BAR_CONTENT_HEIGHT,
  },

  tabBarIcon: {
    width: '100%',
    height: TAB_BAR_CONTENT_HEIGHT,
  },

  hiddenTab: {
    display: 'none',
  },
});
