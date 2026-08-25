import type { AppLanguage } from '@/i18n';

export type QuestionSpeechOptions = {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  onStart: () => void;
  onDone: () => void;
  onStopped: () => void;
  onError: (error: unknown) => void;
};

export type QuestionSpeechAdapter = {
  speak: (text: string, options: QuestionSpeechOptions) => void;
  stop: () => Promise<void>;
};

export type QuestionSpeechController = {
  isSpeaking: () => boolean;
  speak: (text: string, language: AppLanguage) => Promise<boolean>;
  stop: () => Promise<void>;
  toggle: (text: string, language: AppLanguage) => Promise<void>;
};

export type AutomaticQuestionNarration = {
  active: boolean;
  enabled: boolean;
  language: AppLanguage;
  questionKey: string | null;
  text: string | null | undefined;
};

export type QuestionNarrationCoordinator = {
  updateAutomaticNarration: (narration: AutomaticQuestionNarration) => void;
  stop: () => void;
  toggle: (narration: Pick<
    AutomaticQuestionNarration,
    'language' | 'questionKey' | 'text'
  >) => void;
};

export function getQuestionSpeechSettings(language: AppLanguage) {
  return language === 'ar'
    ? { language: 'ar-EG', rate: 0.85 }
    : { language: 'en-US', rate: 0.9 };
}

export function getQuestionNarrationLanguage(
  text: string | null | undefined,
  appLanguage: AppLanguage,
): AppLanguage {
  const normalizedText = text?.trim() ?? '';

  if (/[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u.test(normalizedText)) {
    return 'ar';
  }

  if (/[a-z]/iu.test(normalizedText)) {
    return 'en';
  }

  return appLanguage;
}

export function createQuestionSpeechController(
  adapter: QuestionSpeechAdapter,
  onSpeakingChange: (isSpeaking: boolean) => void = () => {},
  reportError: (error: unknown) => void = () => {},
): QuestionSpeechController {
  let speaking = false;
  let generation = 0;

  const setSpeaking = (nextSpeaking: boolean) => {
    if (speaking !== nextSpeaking) {
      speaking = nextSpeaking;
      onSpeakingChange(nextSpeaking);
    }
  };

  const stop = async () => {
    generation += 1;
    setSpeaking(false);

    try {
      await adapter.stop();
    } catch (error) {
      reportError(error);
    }
  };

  const speak = async (text: string, language: AppLanguage) => {
    const normalizedText = text.trim();
    if (!normalizedText) {
      await stop();
      return false;
    }

    const currentGeneration = ++generation;
    setSpeaking(false);

    try {
      await adapter.stop();
    } catch (error) {
      reportError(error);
    }

    if (currentGeneration !== generation) {
      return false;
    }

    const settings = getQuestionSpeechSettings(language);
    const finish = () => {
      if (currentGeneration === generation) {
        setSpeaking(false);
      }
    };

    try {
      setSpeaking(true);
      adapter.speak(normalizedText, {
        ...settings,
        pitch: 1,
        volume: 1,
        onStart: () => {
          if (currentGeneration === generation) {
            setSpeaking(true);
          }
        },
        onDone: finish,
        onStopped: finish,
        onError: (error) => {
          reportError(error);
          finish();
        },
      });
      return true;
    } catch (error) {
      reportError(error);
      finish();
      return false;
    }
  };

  const toggle = async (text: string, language: AppLanguage) => {
    if (speaking) {
      await stop();
    } else {
      await speak(text, language);
    }
  };

  return {
    isSpeaking: () => speaking,
    speak,
    stop,
    toggle,
  };
}

export function createQuestionNarrationCoordinator(
  controller: QuestionSpeechController,
  schedule: (callback: () => void) => unknown = (callback) =>
    setTimeout(callback, 0),
  cancel: (handle: unknown) => void = (handle) =>
    clearTimeout(handle as ReturnType<typeof setTimeout>),
): QuestionNarrationCoordinator {
  let lastAutomaticKey: string | null = null;
  let pendingAutomaticNarration: unknown | null = null;

  const cancelPending = () => {
    if (pendingAutomaticNarration !== null) {
      cancel(pendingAutomaticNarration);
      pendingAutomaticNarration = null;
    }
  };

  const stop = () => {
    cancelPending();
    void controller.stop();
  };

  const updateAutomaticNarration = ({
    active,
    enabled,
    language,
    questionKey,
    text,
  }: AutomaticQuestionNarration) => {
    cancelPending();
    const normalizedText = text?.trim() ?? '';

    if (!enabled || !active || !questionKey || !normalizedText) {
      void controller.stop();
      return;
    }

    const automaticKey = `${language}:${questionKey}`;
    if (lastAutomaticKey === automaticKey) {
      return;
    }

    void controller.stop();
    pendingAutomaticNarration = schedule(() => {
      pendingAutomaticNarration = null;
      lastAutomaticKey = automaticKey;
      void controller.speak(normalizedText, language);
    });
  };

  const toggle = ({
    language,
    questionKey,
    text,
  }: Pick<
    AutomaticQuestionNarration,
    'language' | 'questionKey' | 'text'
  >) => {
    cancelPending();
    const normalizedText = text?.trim() ?? '';
    if (!normalizedText) {
      void controller.stop();
      return;
    }

    if (questionKey) {
      lastAutomaticKey = `${language}:${questionKey}`;
    }

    void controller.toggle(normalizedText, language);
  };

  return {
    updateAutomaticNarration,
    stop,
    toggle,
  };
}
