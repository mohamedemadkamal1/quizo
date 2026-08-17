import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  handleSocialPlaceholderPress,
  SocialProviderLogo,
  type SocialProvider,
} from "@/components/common/SocialProviderLogo";

const MAX_ROW_WIDTH = 280;
const COMPACT_SCREEN_WIDTH = 350;
const REFERENCE_BUTTON_WIDTH = 136;
const socialProviders: readonly SocialProvider[] =
  Platform.OS === "android" ? ["google"] : ["apple", "google"];

function ProviderOptionButton({ provider }: { provider: SocialProvider }) {
  const isApple = provider === "apple";
  const label = `Continue with ${isApple ? "Apple" : "Google"}`;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={handleSocialPlaceholderPress}
      style={styles.button}
    >
      <SocialProviderLogo provider={provider} size={isApple ? 24 : 21} />
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        numberOfLines={1}
        style={styles.label}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function SocialOptionButtons() {
  const { width: windowWidth } = useWindowDimensions();
  const rowWidth = Math.min(MAX_ROW_WIDTH, windowWidth - 48);
  const gap =
    socialProviders.length > 1
      ? windowWidth < COMPACT_SCREEN_WIDTH
        ? 6
        : 8
      : 0;
  const buttonWidth =
    socialProviders.length === 1
      ? Math.min(REFERENCE_BUTTON_WIDTH, rowWidth)
      : (rowWidth - gap) / socialProviders.length;

  return (
    <View style={[styles.row, { width: rowWidth, gap }]}>
      {socialProviders.map((provider) => (
        <View key={provider} style={{ width: buttonWidth }}>
          <ProviderOptionButton provider={provider} />
        </View>
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
  },
  button: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#8B8B8B",
    borderRadius: 20,
    paddingHorizontal: 4,
    backgroundColor: "#F7F8FA",
    shadowColor: "#111827",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    minWidth: 0,
    flexShrink: 1,
    color: "#111111",
    fontFamily: "Nunito",
    fontSize: 9,
    fontWeight: "500",
    lineHeight: 12,
  },
});
