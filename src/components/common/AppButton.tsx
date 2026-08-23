import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';

export type AppButtonVariant = 'primary' | 'secondary';

type AppButtonProps = Omit<
  PressableProps,
  'children' | 'disabled' | 'style'
> & {
  label: string;
  variant?: AppButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
};

function PrimaryButtonGradient() {
  return (
    <Svg
      pointerEvents="none"
      preserveAspectRatio="none"
      viewBox="0 0 280 45"
      style={StyleSheet.absoluteFill}
    >
      <Defs>
        <RadialGradient
          id="primaryButtonGradient"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <Stop
            offset="0.49%"
            stopColor={colors.button.gradientStart}
            stopOpacity={0.8}
          />

          <Stop
            offset="65.87%"
            stopColor={colors.button.gradientMiddle}
            stopOpacity={0.8}
          />

          <Stop
            offset="100%"
            stopColor={colors.button.gradientEnd}
            stopOpacity={0.8}
          />
        </RadialGradient>
      </Defs>

      <Rect width="280" height="45" fill="url(#primaryButtonGradient)" />
    </Svg>
  );
}

export function AppButton({
  label,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  ...pressableProps
}: AppButtonProps) {
  const isDisabled = disabled || isLoading;
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="button"
      accessibilityState={{
        busy: isLoading,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      className={[
        'h-[45px] w-[280px] max-w-full',
        isPrimary ? 'rounded-[90px]' : 'rounded-[30px]',
        'active:scale-[0.98] active:opacity-90',
        isDisabled ? 'opacity-50' : '',
      ].join(' ')}
      style={isPrimary ? styles.primaryShadow : styles.secondaryShadow}
    >
      <View
        className={[
          'relative flex-1 overflow-hidden border',
          isPrimary
            ? 'rounded-[90px] border-button-primary-border'
            : 'rounded-[30px] border-button-secondary-border bg-button-secondary',
        ].join(' ')}
      >
        {isPrimary && <PrimaryButtonGradient />}

        <View className="relative z-10 flex-1 flex-row items-center justify-center gap-2.5 px-6">
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.muvBlue300} />
          ) : (
            <AppText
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              numberOfLines={1}
              className="text-center font-fredoka text-[18px] font-semibold leading-[22px] text-muv-blue-300"
            >
              {label}
            </AppText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primaryShadow: {
    boxShadow: '1px 2px 8px rgba(0, 0, 0, 0.25)',
  },

  secondaryShadow: {
    boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.25)',
  },

  label: {
    includeFontPadding: false,
  },
});
