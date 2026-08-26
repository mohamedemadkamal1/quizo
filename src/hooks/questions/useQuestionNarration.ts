import { useCallback, useEffect, useRef, useState } from 'react';

import type { AppLanguage } from '@/i18n';
import { createNativeQuestionSpeechController } from '@/services/question-speech.service';
import type { QuestionNarrationCoordinator } from '@/services/question-speech';
import {
  createQuestionNarrationCoordinator,
  getQuestionNarrationLanguage,
} from '@/services/question-speech';
import { usePreferencesStore } from '@/store/preferences.store';

type UseQuestionNarrationOptions = {
  active: boolean;
  language: AppLanguage;
  questionKey: string | null;
  text: string | null | undefined;
};

export function useQuestionNarration({
  active,
  language,
  questionKey,
  text,
}: UseQuestionNarrationOptions) {
  const soundEnabled = usePreferencesStore((state) => state.soundEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechLanguage = getQuestionNarrationLanguage(text, language);
  const mountedRef = useRef(false);
  const previousAppLanguageRef = useRef(language);
  const coordinatorRef = useRef<QuestionNarrationCoordinator | undefined>(
    undefined,
  );

  const stop = useCallback(() => {
    coordinatorRef.current?.stop();
  }, []);

  const toggle = useCallback(() => {
    if (!active || !soundEnabled) {
      stop();
      return;
    }

    coordinatorRef.current?.toggle({
      language: speechLanguage,
      questionKey,
      text,
    });
  }, [active, questionKey, soundEnabled, speechLanguage, stop, text]);

  useEffect(() => {
    mountedRef.current = true;
    const controller = createNativeQuestionSpeechController(
      (nextSpeaking) => {
        if (mountedRef.current) {
          setIsSpeaking(nextSpeaking);
        }
      },
    );
    const coordinator = createQuestionNarrationCoordinator(controller);
    coordinatorRef.current = coordinator;

    return () => {
      mountedRef.current = false;
      coordinatorRef.current = undefined;
      coordinator.stop();
    };
  }, []);

  useEffect(() => {
    if (previousAppLanguageRef.current !== language) {
      previousAppLanguageRef.current = language;
      coordinatorRef.current?.stop();
    }
  }, [language]);

  useEffect(() => {
    coordinatorRef.current?.updateAutomaticNarration({
      active,
      enabled: soundEnabled,
      language: speechLanguage,
      questionKey,
      text,
    });
  }, [
    active,
    soundEnabled,
    questionKey,
    speechLanguage,
    text,
  ]);

  return {
    canSpeak: soundEnabled,
    isSpeaking,
    stop,
    toggle,
  };
}
