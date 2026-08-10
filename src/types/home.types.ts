import type { ReactNode } from 'react';

export type RecentActivity = {
  id: string;
  icon: ReactNode;
  statusLabel: string;
  activityName: string;
  xp: number;
  day: string;
};
