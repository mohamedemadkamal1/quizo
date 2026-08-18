export type EarnedStars = 0 | 1 | 2 | 3;

export function getEarnedStars(
  correctAnswers: number,
  totalAnswers: number,
): EarnedStars {
  if (totalAnswers <= 0) {
    return 0;
  }

  if (correctAnswers === totalAnswers) {
    return 3;
  }

  if (correctAnswers >= totalAnswers * 0.7) {
    return 2;
  }

  if (correctAnswers >= totalAnswers * 0.4) {
    return 1;
  }

  return 0;
}
