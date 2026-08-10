import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeWelcomeSection } from '@/components/home/HomeWelcomeSection';
import { RecentActivitySection } from '@/components/home/RecentActivitySection';
import { gradients } from '@/constants/colors';
import type { useHomeScreen } from '@/hooks/home/useHomeScreen';

type HomeContentProps = {
  screen: ReturnType<typeof useHomeScreen>;
};

export function HomeContent({ screen }: HomeContentProps) {

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
            { paddingBottom: screen.contentBottomPadding },
          ]}
        >
          <HomeWelcomeSection displayName={screen.displayName} />

          <RecentActivitySection
            activities={screen.recentActivities}
            illustrationSource={require('../../assets/images/illustrations/home/home-student.png')}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
