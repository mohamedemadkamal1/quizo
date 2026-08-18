export type LevelResultPathname = "/level-complete" | "/level-failed";

export function getLevelResultPathname(passed: boolean): LevelResultPathname {
  return passed ? "/level-complete" : "/level-failed";
}
