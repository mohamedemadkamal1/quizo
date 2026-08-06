import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NotificationBellIcon } from '../../atoms/icons/navigation/NotificationBellIcon';

type HomeWelcomeSectionProps = {
  displayName?: string | null;
  onPressNotifications?: () => void;
};

export function HomeWelcomeSection({
  displayName,
  onPressNotifications,
}: HomeWelcomeSectionProps) {
  const visibleName = displayName?.trim() || 'Learner';
  const notificationsDisabled = !onPressNotifications;

  return (
    <View className="w-full flex-row items-center justify-between">
      <View className="min-w-0 flex-1 pr-4">
        <Text
          numberOfLines={1}
          className="font-fredoka text-[16px] font-medium leading-[22.5px] tracking-[0px] text-[#0C0A09]"
          style={styles.text}
        >
          Welcome,{' '}
          <Text className="font-fredoka font-normal text-[#8B5CF6]">
            {visibleName}
          </Text>
        </Text>

        <Text
          className="mt-0.5 font-nunito text-[12px] font-medium leading-[12px] tracking-[0px] text-[#0C0A09B2]"
          style={styles.text}
        >
          Ready to learn something new
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open notifications"
        accessibilityState={{ disabled: notificationsDisabled }}
        disabled={notificationsDisabled}
        hitSlop={8}
        onPress={onPressNotifications}
        className="h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white active:scale-95 active:opacity-80"
        style={styles.notificationButton}
      >
        <NotificationBellIcon />
      </Pressable>
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
