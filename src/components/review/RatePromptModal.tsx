import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProfileIcon } from '@/components/profile/ProfileIcon';
import { ProfileModalFrame } from '@/components/profile/ProfileModalFrame';
import { ProfileModalSubmitButton } from '@/components/profile/ProfileModalElements';
import { RatingStars } from '@/components/review/RatingStars';
import { useTranslation } from '@/hooks/useTranslation';

type RatePromptModalProps = {
  selectedStars: number;
  isOpeningStore: boolean;
  onSelectStars: (stars: number) => void;
  onRate: () => void;
  onDismiss: () => void;
};

export function RatePromptModal({
  selectedStars,
  isOpeningStore,
  onSelectStars,
  onRate,
  onDismiss,
}: RatePromptModalProps) {
  const { t } = useTranslation();
  const rateLabel =
    Platform.OS === 'ios' ? t('review.rateAppStore') : t('review.ratePlayStore');
  const dismiss = () => {
    if (!isOpeningStore) {
      onDismiss();
    }
  };

  return (
    <ProfileModalFrame
      accessibilityLabel={t('review.dialogLabel')}
      isBusy={isOpeningStore}
      maxWidth={360}
      onClose={dismiss}
      visible
    >
      <Pressable
        accessibilityLabel={t('common.close')}
        accessibilityRole="button"
        disabled={isOpeningStore}
        hitSlop={10}
        onPress={dismiss}
        style={[styles.closeButton, isOpeningStore && styles.disabled]}
      >
        <ProfileIcon name="close" color="#4B63D7" size={26} />
      </Pressable>

      <View style={styles.header}>
        <AppText accessibilityRole="header" style={styles.title}>
          {t('review.title')}
        </AppText>
        <AppText style={styles.subtitle}>{t('review.subtitle')}</AppText>
      </View>

      <RatingStars onChange={onSelectStars} value={selectedStars} />

      <ProfileModalSubmitButton isBusy={isOpeningStore} onPress={onRate}>
        {rateLabel}
      </ProfileModalSubmitButton>

      <Pressable
        accessibilityRole="button"
        disabled={isOpeningStore}
        hitSlop={8}
        onPress={dismiss}
        style={[styles.laterButton, isOpeningStore && styles.disabled]}
      >
        <AppText style={styles.laterLabel}>{t('review.later')}</AppText>
      </Pressable>
    </ProfileModalFrame>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 12,
    end: 12,
    zIndex: 2,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    gap: 8,
    marginTop: 34,
    paddingHorizontal: 8,
  },
  title: {
    color: '#272A5C',
    fontFamily: 'Fredoka',
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 34,
    textAlign: 'center',
  },
  subtitle: {
    color: '#7183A5',
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
    textAlign: 'center',
  },
  laterButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  laterLabel: {
    color: '#5B6B8C',
    fontFamily: 'Nunito',
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.55,
  },
});
