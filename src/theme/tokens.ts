export const colors = {
  muvBlue300: '#485BDD',

  navigation: {
    activeTab: '#8B5CF6',
    inactiveTab: '#94A3B8',
    inactiveHomeIcon: '#9DB2CE',
    activeTabBackground: '#8B5CF61A',
    tabBarBackground: '#FFFFFF',
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
      0, 0.0393, 0.0786, 0.1179, 0.1571, 0.1964, 0.2357, 0.275, 0.3143,
      0.3536, 0.3929, 0.4321, 0.4714, 0.5107, 0.55,
    ] as const,
  },
} as const;
