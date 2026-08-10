export function getDisplayInitials(displayName: string | null | undefined) {
  const words = displayName?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length === 0) {
    return 'Q';
  }

  const selectedWords = words.length === 1 ? words : [words[0], words.at(-1)!];

  return selectedWords
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toLocaleUpperCase();
}
