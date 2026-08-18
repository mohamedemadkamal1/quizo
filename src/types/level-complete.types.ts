import type { SubCategoryId } from "@/types/home.types";
import type { LevelMapDifficulty } from "@/types/level-map.types";

export type LevelFinalScoreViewModel = {
  sessionId: number;
  score: number;
  xpEarned: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswers: number;
  durationSeconds: number;
  isReplay: boolean;
  alreadyCompleted: boolean;
  passed: boolean;
};

export type LevelCompleteSummary = LevelFinalScoreViewModel & {
  categoryId: SubCategoryId;
  categoryName: string;
  categoryIcon: string;
  difficulty: LevelMapDifficulty;
  levelId: number;
  levelNumber: number;
};
