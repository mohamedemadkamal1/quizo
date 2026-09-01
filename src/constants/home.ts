import { colors, gradients } from '@/constants/colors';
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

/**
 * Single source of truth for the category palette. Each entry pairs a card
 * gradient with the progress fill tinted to match that card's colour, so the
 * two can never drift out of order.
 */
const HOME_CATEGORY_THEMES = [
  {
    gradient: gradients.categories.quran,
    progressFill: colors.categoryProgressFill.violet,
  },
  {
    gradient: gradients.categories.seerah,
    progressFill: colors.categoryProgressFill.sky,
  },
  {
    gradient: gradients.categories.duas,
    progressFill: colors.categoryProgressFill.emerald,
  },
  {
    gradient: gradients.categories.prophets,
    progressFill: colors.categoryProgressFill.yellow,
  },
  {
    gradient: gradients.categories.goodManners,
    progressFill: colors.categoryProgressFill.amber,
  },
  {
    gradient: gradients.categories.islamicQuiz,
    progressFill: colors.categoryProgressFill.pink,
  },
  {
    gradient: gradients.categories.companions,
    progressFill: colors.categoryProgressFill.rose,
  },
  {
    gradient: gradients.categories.ramadan,
    progressFill: colors.categoryProgressFill.cyan,
  },
] as const satisfies readonly {
  gradient: GradientColors;
  progressFill: string;
}[];

export const HOME_CATEGORY_COLOR_PALETTE: readonly GradientColors[] =
  HOME_CATEGORY_THEMES.map((theme) => theme.gradient);

export const HOME_CATEGORY_PROGRESS_FILL_PALETTE: readonly string[] =
  HOME_CATEGORY_THEMES.map((theme) => theme.progressFill);

export const CATEGORY_LEVELS: CategoryLevelConfig[] = [
  {
    difficulty: 'BEGINNER',
    titleKey: 'home.difficulty.beginnerTitle',
    descriptionKey: 'home.difficulty.beginnerDescription',
    icon: '\u{1F331}',
    stars: 1,
    gradient: gradients.categoryModal.beginner,
  },
  {
    difficulty: 'INTERMEDIATE',
    titleKey: 'home.difficulty.intermediateTitle',
    descriptionKey: 'home.difficulty.intermediateDescription',
    icon: '\u26A1',
    stars: 2,
    gradient: gradients.categoryModal.intermediate,
  },
  {
    difficulty: 'ADVANCED',
    titleKey: 'home.difficulty.advancedTitle',
    descriptionKey: 'home.difficulty.advancedDescription',
    icon: '\u{1F525}',
    stars: 3,
    gradient: gradients.categoryModal.advanced,
  },
];
