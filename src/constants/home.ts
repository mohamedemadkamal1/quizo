import { gradients } from '@/constants/colors';
import type { CategoryLevelConfig, GradientColors } from '@/types/home.types';

export const HOME_CATEGORY_ICONS = [
  '\u{1F319}',
  '\u{1F54C}',
  '\u{1F932}',
  '\u{1F4D6}',
  '\u2B50',
  '\u{1F9E0}',
  '\u{1F42A}',
  '\u{1F381}',
] as const;

export const HOME_CATEGORY_COLOR_PALETTE: readonly GradientColors[] = [
  gradients.categories.quran,
  gradients.categories.seerah,
  gradients.categories.duas,
  gradients.categories.prophets,
  gradients.categories.goodManners,
  gradients.categories.islamicQuiz,
  gradients.categories.companions,
  gradients.categories.ramadan,
];

export const CATEGORY_LEVELS: CategoryLevelConfig[] = [
  { difficulty: 'BEGINNER', title: 'Beginner', icon: '\u{1F331}', description: 'Start your journey!', stars: 1, gradient: gradients.categoryModal.beginner },
  { difficulty: 'INTERMEDIATE', title: 'Intermediate', icon: '\u26A1', description: 'Rise to the challenge!', stars: 2, gradient: gradients.categoryModal.intermediate },
  { difficulty: 'ADVANCED', title: 'Advanced', icon: '\u{1F525}', description: 'For true champions!', stars: 3, gradient: gradients.categoryModal.advanced },
];
