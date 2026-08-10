import { gradients } from '@/constants/colors';
import type { CategoryLevel, HomeCategory } from '@/types/home.types';

export const HOME_CATEGORIES: HomeCategory[] = [
  { id: 'quran', name: 'Quran', icon: '\u{1F319}', levelCount: 12, xp: 50, displayedProgress: 85, visualFillRatio: 0.47882, gradient: gradients.categories.quran },
  { id: 'seerah', name: 'Seerah', icon: '\u{1F54C}', levelCount: 10, xp: 45, displayedProgress: 60, visualFillRatio: 0.33797, gradient: gradients.categories.seerah },
  { id: 'duas', name: 'Duas', icon: '\u{1F932}', levelCount: 8, xp: 40, displayedProgress: 40, visualFillRatio: 0.22533, gradient: gradients.categories.duas },
  { id: 'prophets', name: 'Prophets', icon: '\u{1F4D6}', levelCount: 15, xp: 60, displayedProgress: 25, visualFillRatio: 0.1408, gradient: gradients.categories.prophets },
  { id: 'good-manners', name: 'Good Manners', icon: '\u2B50', levelCount: 9, xp: 45, displayedProgress: 70, visualFillRatio: 0.39434, gradient: gradients.categories.goodManners },
  { id: 'islamic-quiz', name: 'Islamic Quiz', icon: '\u{1F9E0}', levelCount: 20, xp: 70, displayedProgress: 15, visualFillRatio: 0.08448, gradient: gradients.categories.islamicQuiz },
  { id: 'companions', name: 'Companions', icon: '\u{1F42A}', levelCount: 11, xp: 55, displayedProgress: 30, visualFillRatio: 0.16896, gradient: gradients.categories.companions },
  { id: 'ramadan', name: 'Ramadan', icon: '\u{1F381}', levelCount: 7, xp: 80, displayedProgress: 5, visualFillRatio: 0.02816, gradient: gradients.categories.ramadan },
];

export const CATEGORY_LEVELS: CategoryLevel[] = [
  { id: 'beginner', title: 'Beginner', icon: '\u{1F331}', levelCount: 6, description: 'Start your journey!', stars: 1, gradient: gradients.categoryModal.beginner },
  { id: 'intermediate', title: 'Intermediate', icon: '\u26A1', levelCount: 9, description: 'Rise to the challenge!', stars: 2, gradient: gradients.categoryModal.intermediate },
  { id: 'advanced', title: 'Advanced', icon: '\u{1F525}', levelCount: 12, description: 'For true champions!', stars: 3, gradient: gradients.categoryModal.advanced },
];

