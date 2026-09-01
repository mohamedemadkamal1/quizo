export const colors = {
  muvBlue300: '#485BDD',

  activity: {
    cardBackground: '#F0F2F5',
    iconBackground: '#ECFDF5',
    completed: '#10B981',
    title: '#1E1A4D',
    xp: '#613EEA',
    day: 'rgba(49, 46, 129, 0.5)',
  },

  home: {
    heading: '#1E1A4D',
    categoryText: '#FFFFFF',
    categorySubtext: 'rgba(255, 255, 255, 0.8)',
    categoryDecoration: 'rgba(255, 255, 255, 0.15)',
    categoryGlass: 'rgba(255, 255, 255, 0.25)',
    categoryBadge: 'rgba(255, 255, 255, 0.2)',
    categoryBadgeText: 'rgba(255, 255, 255, 0.9)',
    progressTrack: 'rgba(255, 255, 255, 0.25)',
    viewAll: '#4F46E5',
    modalBackground: '#F5F3FF',
    modalBackdrop: 'rgba(12, 10, 9, 0.62)',
    levelDescription: 'rgba(255, 255, 255, 0.85)',
    levelStar: '#FFDF20',
  },

  leaderboard: {
    background: '#C6D2FF',
    title: '#0B1020',
    subtitle: '#6B7A99',

    listSurface: '#F1F2F6',
    rowBackground: '#E2E7EF',
    rowBorder: '#CDD5DF',
    rowName: '#0B1020',
    rowScore: '#7A8699',
    rowShadow: '#1E1A4D',
    rankPill: '#00D492',
    rankPillText: '#FFFFFF',

    podiumFirst: '#FF9F00',
    podiumFirstTop: '#FFC44D',
    podiumSecond: '#13BDF0',
    podiumSecondTop: '#B9D3F4',
    podiumThird: '#10D6A0',
    podiumThirdTop: '#AFE3D4',
    podiumEdgeHighlight: 'rgba(255, 255, 255, 0.9)',
    podiumMark: 'rgba(255, 255, 255, 0.92)',
    podiumNumber: '#FFFFFF',
    crown: '#FFC300',
    crownShade: '#FFA500',

    podiumName: '#0B1020',
    scorePill: 'rgba(255, 255, 255, 0.45)',
    scorePillText: '#5A6A87',

    avatarFallback: '#8E9BB5',
    avatarFallbackText: '#FFFFFF',
  },

  navigation: {
    activeTab: '#FFFFFF',
    inactiveTab: '#FFFFFF',
    activeTabBackground: 'rgba(229, 222, 255, 0.48)',
    activeTabBorder: 'rgba(255, 255, 255, 0.72)',
    tabLabel: '#FFFFFF',
    tabDivider: 'rgba(255, 255, 255, 0.38)',
    tabBarStart: '#A77CFA',
    tabBarEnd: '#7D2AF8',
  },

  settings: {
    background: '#C6D2FF',
    headerStart: '#8B5CF6',
    headerEnd: '#A78BFA',
    heading: '#1E1A4D',
    body: '#475569',
    muted: '#94A3B8',
    surfaceSoft: 'rgba(255, 255, 255, 0.42)',
    violet: '#7C3AED',
    violetSoft: '#EDE9FE',
    cyan: '#08BBD2',
    cyanEnd: '#22D3EE',
    coral: '#F55D6E',
    coralSoft: '#FCE7EA',
    green: '#10B981',
    sliderTrack: 'rgba(255, 255, 255, 0.58)',
    sliderYellow: '#FFDF20',
    sliderOrange: '#FF9F0A',
    modalBackdrop: 'rgba(30, 26, 77, 0.55)',
  },

  languageSelector: {
    surface: '#EDE9FE',
    border: 'rgba(139, 92, 246, 0.38)',
    icon: '#7C3AED',
    menuSurface: '#FFFFFF',
    menuBorder: 'rgba(139, 92, 246, 0.24)',
    optionSelected: '#EDE9FE',
    optionText: '#4C1D95',
    optionSelectedText: '#6D28D9',
  },

  button: {
    primaryBorder: '#A3B3FF',
    secondaryBackground: '#F0F2F5',
    secondaryBorder: 'rgba(163, 179, 255, 0.5)',

    gradientStart: '#F0F9FF',
    gradientMiddle: '#C6D2FF',
    gradientEnd: '#A3B3FF',
  },
} as const;

export const gradients = {
  authHero: {
    colors: ['#FFFFFF', '#C6D2FF', '#A3B3FF'] as const,
    locations: [0, 0.6635, 1] as const,
  },

  homeBackground: {
    colors: [
      '#FFFFFF',
      '#FBFCFF',
      '#F7F9FF',
      '#F3F5FF',
      '#EEF2FF',
      '#EAEFFF',
      '#E6ECFF',
      '#E2E9FF',
      '#DEE5FF',
      '#DAE2FF',
      '#D6DFFF',
      '#D2DCFF',
      '#CED8FF',
      '#CAD5FF',
      '#C6D2FF',
    ] as const,
    locations: [
      0, 0.0393, 0.0786, 0.1179, 0.1571, 0.1964, 0.2357, 0.275, 0.3143, 0.3536,
      0.3929, 0.4321, 0.4714, 0.5107, 0.55,
    ] as const,
  },

  categories: {
    quran: ['#8B5CF6', '#A78BFA'] as const,
    seerah: ['#00BCFF', '#74D4FF'] as const,
    duas: ['#00D492', '#5EE9B5'] as const,
    prophets: ['#FFB900', '#FFDF20'] as const,
    goodManners: ['#FE9A00', '#FFB86A'] as const,
    islamicQuiz: ['#FB64B6', '#FDA5D5'] as const,
    companions: ['#F97273', '#FCA5A5'] as const,
    ramadan: ['#22D3EE', '#A2F4FD'] as const,
  },

  categoryModal: {
    chip: ['#7C3AED', '#A78BFA'] as const,
    beginner: ['#22D3EE', '#22D3EE'] as const,
    intermediate: ['#10B981', '#00D492'] as const,
    advanced: ['#8B5CF6', '#A78BFA'] as const,
  },
} as const;
