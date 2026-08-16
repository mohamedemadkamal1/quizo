import type {
  LevelMapDifficulty,
  LevelMapTheme,
} from '@/types/level-map.types';

export const LEVEL_MAP_ROW_HEIGHT = 132;
export const LEVEL_MAP_BOUNDARY_HEIGHT = 204;
export const LEVEL_MAP_NODE_SIZE = 68;

export const LEVEL_MAP_DIFFICULTIES = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
] as const satisfies readonly LevelMapDifficulty[];

export const levelMapThemes = {
  BEGINNER: {
    difficulty: 'BEGINNER',
    label: 'Beginner',
    icon: '\u{1F331}',
    stars: 1,
    backgroundColors: ['#18BBD0', '#53DBE6', '#B8F3F4'],
    backgroundLocations: [0, 0.52, 1],
    headerColor: '#079EB3',
    chipColor: 'rgba(255, 255, 255, 0.18)',
    completedColor: '#20C99B',
    currentColor: '#211A61',
    playColor: '#18C996',
    connectorColor: 'rgba(255, 255, 255, 0.52)',
    lockedConnectorColor: 'rgba(255, 255, 255, 0.28)',
    lockedFillColor: 'rgba(255, 255, 255, 0.11)',
    lockedBorderColor: 'rgba(255, 255, 255, 0.34)',
    fogColors: [
      'rgba(219, 249, 250, 0.98)',
      'rgba(196, 244, 247, 0.76)',
      'rgba(165, 238, 243, 0)',
    ],
    positionPattern: [0.52, 0.69, 0.72, 0.63, 0.46, 0.27, 0.31, 0.52],
    mascotSource: require('../assets/images/illustrations/level-map/beginner-mascot.png'),
    mascotSide: 'left',
  },
  INTERMEDIATE: {
    difficulty: 'INTERMEDIATE',
    label: 'Intermediate',
    icon: '\u26A1',
    stars: 2,
    backgroundColors: ['#04C68E', '#35DBA7', '#A8F1D8'],
    backgroundLocations: [0, 0.55, 1],
    headerColor: '#079D73',
    chipColor: 'rgba(255, 255, 255, 0.18)',
    completedColor: '#20C99B',
    currentColor: '#211A61',
    playColor: '#16C994',
    connectorColor: 'rgba(255, 255, 255, 0.5)',
    lockedConnectorColor: 'rgba(255, 255, 255, 0.27)',
    lockedFillColor: 'rgba(255, 255, 255, 0.1)',
    lockedBorderColor: 'rgba(255, 255, 255, 0.32)',
    fogColors: [
      'rgba(211, 249, 235, 0.98)',
      'rgba(183, 245, 220, 0.74)',
      'rgba(151, 239, 207, 0)',
    ],
    positionPattern: [0.54, 0.69, 0.74, 0.62, 0.34, 0.31, 0.49, 0.7],
    mascotSource: require('../assets/images/illustrations/level-map/intermediate-mascot.png'),
    mascotSide: 'left',
  },
  ADVANCED: {
    difficulty: 'ADVANCED',
    label: 'Advanced',
    icon: '\u{1F525}',
    stars: 3,
    backgroundColors: ['#4B27A1', '#7456C8', '#C8B7F0'],
    backgroundLocations: [0, 0.52, 1],
    headerColor: '#351779',
    chipColor: 'rgba(255, 255, 255, 0.18)',
    completedColor: '#20C99B',
    currentColor: '#211A61',
    playColor: '#19C990',
    connectorColor: 'rgba(255, 255, 255, 0.48)',
    lockedConnectorColor: 'rgba(255, 255, 255, 0.25)',
    lockedFillColor: 'rgba(255, 255, 255, 0.1)',
    lockedBorderColor: 'rgba(255, 255, 255, 0.31)',
    fogColors: [
      'rgba(227, 219, 248, 0.98)',
      'rgba(201, 185, 239, 0.75)',
      'rgba(174, 151, 225, 0)',
    ],
    positionPattern: [0.56, 0.72, 0.65, 0.5, 0.37, 0.27, 0.41, 0.56],
    mascotSource: require('../assets/images/illustrations/level-map/advanced-mascot.png'),
    mascotSide: 'left',
  },
} satisfies Record<LevelMapDifficulty, LevelMapTheme>;

export function isLevelMapDifficulty(
  value: unknown,
): value is LevelMapDifficulty {
  return (
    typeof value === 'string' &&
    LEVEL_MAP_DIFFICULTIES.some((difficulty) => difficulty === value)
  );
}

export function getLevelNodePosition(
  theme: LevelMapTheme,
  levelNumber: number,
): number {
  return theme.positionPattern[
    (levelNumber - 1) % theme.positionPattern.length
  ];
}
