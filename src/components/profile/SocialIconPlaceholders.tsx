import { Platform, Pressable, StyleSheet, View } from "react-native";

import {
  handleSocialPlaceholderPress,
  SocialProviderLogo,
  type SocialProvider,
} from "@/components/common/SocialProviderLogo";

type SocialIconPlaceholdersProps = {
  disabled: boolean;
};

const socialProviders: readonly SocialProvider[] =
  Platform.OS === "android" ? ["google"] : ["google", "apple"];

function SocialIconButton({
  disabled,
  provider,
}: {
  disabled: boolean;
  provider: SocialProvider;
}) {
  const isGoogle = provider === "google";

  return (
    <Pressable
      accessibilityLabel={`Continue with ${isGoogle ? "Google" : "Apple"}`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handleSocialPlaceholderPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <SocialProviderLogo provider={provider} size={isGoogle ? 21 : 23} />
    </Pressable>
  );
}

export function SocialIconPlaceholders({
  disabled,
}: SocialIconPlaceholdersProps) {
  return (
    <View style={styles.row}>
      {socialProviders.map((provider) => (
        <SocialIconButton
          disabled={disabled}
          key={provider}
          provider={provider}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 11,
  },
  button: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#8B8B8B",
    borderRadius: 20,
    backgroundColor: "#F7F8FA",
    shadowColor: "#111827",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabled: {
    opacity: 0.55,
  },
});
