import type { ImageSourcePropType } from 'react-native';

export type LevelMapDecorationDefinition = {
  key: string;
  source: ImageSourcePropType;
  aspectRatio: number;
  preferredWidth: number;
};

export type LevelMapDecorationSide = 'left' | 'right';

export type LevelMapDecorationPlacement = {
  levelId: number;
  decoration: LevelMapDecorationDefinition;
  side: LevelMapDecorationSide;
  verticalOffset: number;
};

export const LEVEL_MAP_DECORATIONS = [
  {
    key: 'bush',
    source: require('../assets/images/illustrations/level-map/decorations/bush.png'),
    aspectRatio: 274 / 186,
    preferredWidth: 112,
  },
  {
    key: 'coin-crate',
    source: require('../assets/images/illustrations/level-map/decorations/coin-crate.png'),
    aspectRatio: 249 / 219,
    preferredWidth: 104,
  },
  {
    key: 'lantern',
    source: require('../assets/images/illustrations/level-map/decorations/lantern.png'),
    aspectRatio: 221 / 309,
    preferredWidth: 78,
  },
  {
    key: 'star-lamp',
    source: require('../assets/images/illustrations/level-map/decorations/star-lamp.png'),
    aspectRatio: 206 / 249,
    preferredWidth: 84,
  },
  {
    key: 'mosque',
    source: require('../assets/images/illustrations/level-map/decorations/mosque.png'),
    aspectRatio: 1,
    preferredWidth: 108,
  },
  {
    key: 'market-cart',
    source: require('../assets/images/illustrations/level-map/decorations/market-cart.png'),
    aspectRatio: 288 / 321,
    preferredWidth: 102,
  },
  {
    key: 'signpost',
    source: require('../assets/images/illustrations/level-map/decorations/signpost.png'),
    aspectRatio: 181 / 323,
    preferredWidth: 76,
  },
  {
    key: 'quran-scroll',
    source: require('../assets/images/illustrations/level-map/decorations/quran-scroll.png'),
    aspectRatio: 295 / 180,
    preferredWidth: 120,
  },
  {
    key: 'treasure-chest',
    source: require('../assets/images/illustrations/level-map/decorations/treasure-chest.png'),
    aspectRatio: 269 / 201,
    preferredWidth: 112,
  },
  {
    key: 'books-scroll',
    source: require('../assets/images/illustrations/level-map/decorations/books-scroll.png'),
    aspectRatio: 228 / 189,
    preferredWidth: 108,
  },
  {
    key: 'campfire',
    source: require('../assets/images/illustrations/level-map/decorations/campfire.png'),
    aspectRatio: 297 / 257,
    preferredWidth: 110,
  },
  {
    key: 'well',
    source: require('../assets/images/illustrations/level-map/decorations/well.png'),
    aspectRatio: 282 / 307,
    preferredWidth: 102,
  },
  {
    key: 'moon-boat',
    source: require('../assets/images/illustrations/level-map/decorations/moon-boat.png'),
    aspectRatio: 324 / 277,
    preferredWidth: 118,
  },
  {
    key: 'crescent-cloud',
    source: require('../assets/images/illustrations/level-map/decorations/crescent-cloud.png'),
    aspectRatio: 256 / 272,
    preferredWidth: 104,
  },
] as const satisfies readonly LevelMapDecorationDefinition[];
