export const QUESTION_REFERENCE_WIDTH = 400;
export const QUESTION_REFERENCE_SURFACE_HEIGHT = 760;
export const QUESTION_CONTENT_MAX_WIDTH = 400;

export const GAMEPLAY_MODAL_REFERENCE_WIDTH = 616;
export const GAMEPLAY_MODAL_REFERENCE_HEIGHT = 816;
export const GAMEPLAY_MODAL_MAX_WIDTH = 430;

export const QUESTION_FEEDBACK_DURATION_MS = 1200;
export const QUESTION_TIMER_INTERVAL_MS = 250;
export const QUESTION_DURATION_SECONDS = 30;

export const gameplayColors = {
  background: '#C6D2FF',
  heading: '#1E1A4D',
  primaryText: '#485BDD',
  cardStart: '#A3B3FF',
  cardEnd: '#C6D2FF',
  surface: '#F0F2F5',
  border: '#A3B3FF',
  gold: '#FFDF20',
  orange: '#FF9F0A',
  correct: '#10B981',
  wrong: '#FF383A',
  futureSegment: 'rgba(240, 249, 255, 0.48)',
  timerTrack: 'rgba(240, 242, 245, 0.82)',
  white: '#FFFFFF',
  black: '#0C0A09',
} as const;

export const gameplayGradients = {
  questionCard: ['#A3B3FF', '#C6D2FF'] as const,
  timer: ['#FFDF20', '#FF9F0A'] as const,
  goldIcon: ['#FFDF20', '#FF9F0A'] as const,
  quitPanel: ['#F8FAFC', '#F0F2F5', '#C6D2FF'] as const,
} as const;
