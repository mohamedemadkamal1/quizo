import * as Speech from 'expo-speech';

import {
  createQuestionSpeechController,
  type QuestionSpeechController,
} from '@/services/question-speech';

function reportSpeechError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[speech] Question narration failed: ${message}`);
}

export function createNativeQuestionSpeechController(
  onSpeakingChange: (isSpeaking: boolean) => void,
): QuestionSpeechController {
  return createQuestionSpeechController(
    {
      speak: (text, options) => Speech.speak(text, options),
      stop: () => Speech.stop(),
    },
    onSpeakingChange,
    reportSpeechError,
  );
}
