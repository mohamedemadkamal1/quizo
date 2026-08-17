import { Image, type ImageStyle, type StyleProp } from 'react-native';

export type SocialProvider = 'apple' | 'google';

const providerLogos = {
  apple: require('../../assets/images/auth/apple-logo.png'),
  google: require('../../assets/images/auth/google-logo.png'),
} as const;

export function handleSocialPlaceholderPress() {
  // TODO: Connect these visual placeholders in the future social-auth task.
}

type SocialProviderLogoProps = {
  provider: SocialProvider;
  size: number;
  style?: StyleProp<ImageStyle>;
};

export function SocialProviderLogo({
  provider,
  size,
  style,
}: SocialProviderLogoProps) {
  return (
    <Image
      accessibilityElementsHidden
      resizeMode="contain"
      source={providerLogos[provider]}
      style={[{ width: size, height: size }, style]}
    />
  );
}
