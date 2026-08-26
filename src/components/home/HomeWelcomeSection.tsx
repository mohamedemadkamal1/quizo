import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { useTranslation } from '@/hooks/useTranslation';

type HomeWelcomeSectionProps = {
  displayName?: string | null;
  onPressNotifications?: () => void;
};

export function HomeWelcomeSection({
  displayName,
}: HomeWelcomeSectionProps) {
  const { t } = useTranslation();
  // A player's own name is never translated; only the greeting around it is.
  const visibleName = displayName?.trim() || t('home.defaultName');
  return (
    <View className="w-full flex-row items-center justify-between">
      <View className="min-w-0 flex-1 pe-4">
        <AppText
          numberOfLines={1}
          className="font-fredoka text-[16px] font-medium leading-[22.5px] tracking-[0px] text-[#0C0A09]"
          style={styles.text}
        >
          {t('home.greeting')}
          <AppText className="font-fredoka font-normal text-[#8B5CF6]">
            {visibleName}
          </AppText>
        </AppText>

        <AppText
          className="mt-0.5 font-nunito text-[12px] font-medium leading-[12px] tracking-[0px] text-[#0C0A09B2]"
          style={styles.text}
        >
          {t('home.subtitle')}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
  },

  notificationButton: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 2,
        blurRadius: 4,
        spreadDistance: -2,
        color: 'rgba(0, 0, 0, 0.10)',
      },
      {
        offsetX: 0,
        offsetY: 4,
        blurRadius: 6,
        spreadDistance: -1,
        color: 'rgba(0, 0, 0, 0.10)',
      },
    ],
  },
});
