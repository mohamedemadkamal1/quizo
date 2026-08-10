import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AudioSettings } from '@/components/settings/AudioSettings';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';
import {
  GuestSettingsActions,
  RegisteredSettingsActions,
} from '@/components/settings/SettingsActions';
import { SettingsProfileHeader } from '@/components/settings/SettingsProfileHeader';
import { SettingsText as Text } from '@/components/settings/SettingsText';
import { colors } from '@/constants/colors';
import type { useSettingsScreen } from '@/hooks/settings/useSettingsScreen';

type SettingsContentProps = {
  screen: ReturnType<typeof useSettingsScreen>;
};

export function SettingsContent({ screen }: SettingsContentProps) {
  if (!screen.profile) {
    return <SafeAreaView style={styles.safeArea} />;
  }

  const isGuest = screen.profile.mode === 'guest';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: screen.tabBarHeight + 26,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileHeader
          profile={screen.profile}
          onEditName={screen.onEditName}
        />

        <View
          style={[styles.content, isGuest ? styles.guestContent : undefined]}
        >
          {isGuest ? (
            <>
              <GuestSettingsActions
                onCompleteProfile={screen.onCompleteProfile}
              />
              <AudioSettings
                preferences={screen.audioPreferences}
                onChangeEnd={screen.onChangeAudioPreference}
              />
            </>
          ) : (
            <>
              <AudioSettings
                preferences={screen.audioPreferences}
                onChangeEnd={screen.onChangeAudioPreference}
              />
              <RegisteredSettingsActions
                isLoggingOut={screen.isLoggingOut}
                onChangePassword={screen.onChangePassword}
                onDeleteAccount={screen.onRequestDeleteAccount}
                onLogOut={screen.onLogOut}
              />
            </>
          )}

          {screen.errorMessage ? (
            <View
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
              style={styles.feedback}
            >
              <Text style={styles.feedbackText}>{screen.errorMessage}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <DeleteAccountModal
        visible={screen.isDeleteModalVisible}
        isDeleting={screen.isDeleting}
        onCancel={screen.onCancelDeleteAccount}
        onConfirm={screen.onConfirmDeleteAccount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.settings.background,
  },
  content: {
    gap: 32,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  guestContent: {
    gap: 40,
  },
  feedback: {
    borderWidth: 1,
    borderColor: 'rgba(245, 93, 110, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: colors.settings.coralSoft,
  },
  feedbackText: {
    color: '#A61B32',
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'center',
  },
});
