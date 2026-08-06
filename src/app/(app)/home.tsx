import { LinearGradient } from 'expo-linear-gradient';
import { useBottomTabBarHeight } from 'expo-router/js-tabs';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeWelcomeSection } from '@/components/organisms/home/HomeWelcomeSection';
import { useAuthStore } from '@/features/auth/stores/auth.store';
import { gradients } from '@/theme/tokens';

import { NotificationBellIcon } from '@/components/atoms/icons/navigation/NotificationBellIcon';

import {
  RecentActivitySection,
  type RecentActivity,
} from '@/components/organisms/home/RecentActivitySection';

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const displayName = useAuthStore((state) => state.session?.user.displayName);

  const recentActivities: RecentActivity[] = [
    {
      id: 'stories-today',
      statusLabel: '✓ Completed',
      activityName: 'Hadeeth',
      xp: 40,
      day: 'Level 5',
      icon: <NotificationBellIcon size={20} />,
    },
    {
      id: 'quran-level-6',
      statusLabel: '✓ Completed',
      activityName: 'Quran',
      xp: 50,
      day: 'Level 6',
      icon: <NotificationBellIcon size={20} />,
    },
  ];

  return (
    <LinearGradient
      colors={gradients.homeBackground.colors}
      locations={gradients.homeBackground.locations}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView edges={['top', 'left', 'right']} className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: tabBarHeight + 24,
            },
          ]}
        >
          <HomeWelcomeSection displayName={displayName} />

          <RecentActivitySection
            activities={recentActivities}
            illustrationSource={require('../../../assets/images/illustrations/home/home-student.png')}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },

  activityIcon: {
    width: 20,
    height: 20,
  },
});
