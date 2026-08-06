import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";

import { ActivityCard } from "@/components/molecules/ActivityCard";
import { colors } from "@/theme/tokens";

export type RecentActivity = {
  id: string;
  icon: React.ReactNode;
  statusLabel: string;
  activityName: string;
  xp: number;
  day: string;
};

type RecentActivitySectionProps = {
  activities: RecentActivity[];
  illustrationSource: ImageSourcePropType;
};

export function RecentActivitySection({
  activities,
  illustrationSource,
}: RecentActivitySectionProps) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Recent Activity</Text>

      <View style={styles.content}>
        <Image
          source={illustrationSource}
          resizeMode="contain"
          style={styles.illustration}
        />

        <View style={styles.activityList}>
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              icon={activity.icon}
              statusLabel={activity.statusLabel}
              activityName={activity.activityName}
              xp={activity.xp}
              day={activity.day}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    marginTop: 40,
  },

  heading: {
    marginLeft: 4,
    fontFamily: "Fredoka",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
    color: colors.activity.title,
    includeFontPadding: false,
  },

  content: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    marginTop: 10,
  },

  illustration: {
    width: "28%",
    maxWidth: 125,
    aspectRatio: 125 / 208,
    flexShrink: 1,
  },

  activityList: {
    minWidth: 0,
    flex: 1,
    alignItems: "flex-end",
    gap: 8,
  },
});
