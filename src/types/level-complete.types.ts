import type { CategoryId } from '@/types/home.types';
import type { LevelMapDifficulty } from '@/types/level-map.types';

export type LevelCompleteSummary = {
  categoryId: CategoryId;
  difficulty: LevelMapDifficulty;
  levelId: string;
  levelNumber: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  points: number;
  weeklyRank: number;
};
