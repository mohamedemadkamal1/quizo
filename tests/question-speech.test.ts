import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createQuestionNarrationCoordinator,
  createQuestionSpeechController,
  getQuestionNarrationLanguage,
  getQuestionSpeechSettings,
  type QuestionSpeechAdapter,
  type QuestionSpeechController,
  type QuestionSpeechOptions,
} from '../src/services/question-speech.ts';

function createSpeechHarness() {
  const spoken: Array<{ text: string; options: QuestionSpeechOptions }> = [];
  let stopCount = 0;
  const errors: unknown[] = [];
  const speakingStates: boolean[] = [];
  const adapter: QuestionSpeechAdapter = {
    speak: (text, options) => {
      spoken.push({ text, options });
    },
    stop: async () => {
      stopCount += 1;
    },
  };
  const controller = createQuestionSpeechController(
    adapter,
    (speaking) => speakingStates.push(speaking),
    (error) => errors.push(error),
  );

  return {
    adapter,
    controller,
    errors,
    speakingStates,
    spoken,
    get stopCount() {
      return stopCount;
    },
  };
}

function createCoordinatorHarness() {
  const events: string[] = [];
  const scheduled: Array<() => void> = [];
  let speaking = false;
  const controller: QuestionSpeechController = {
    isSpeaking: () => speaking,
    speak: async (text, language) => {
      speaking = true;
      events.push(`speak:${language}:${text}`);
      return true;
    },
    stop: async () => {
      speaking = false;
      events.push('stop');
    },
    toggle: async (text, language) => {
      events.push(`toggle:${language}:${text}`);
    },
  };
  const coordinator = createQuestionNarrationCoordinator(
    controller,
    (callback) => {
      scheduled.push(callback);
      return callback;
    },
    (callback) => {
      const index = scheduled.indexOf(callback as () => void);
      if (index >= 0) {
        scheduled.splice(index, 1);
      }
    },
  );
  const flush = () => {
    const callbacks = scheduled.splice(0);
    callbacks.forEach((callback) => callback());
  };

  return { coordinator, events, flush, scheduled };
}

test('Arabic and English use the requested native speech settings', () => {
  assert.deepEqual(getQuestionSpeechSettings('ar'), {
    language: 'ar-EG',
    rate: 0.85,
  });
  assert.deepEqual(getQuestionSpeechSettings('en'), {
    language: 'en-US',
    rate: 0.9,
  });
  assert.deepEqual(getQuestionSpeechSettings('ar', 'ios'), {
    language: 'ar-EG',
    rate: 1,
  });
  assert.deepEqual(getQuestionSpeechSettings('en', 'ios'), {
    language: 'en-US',
    rate: 1.05,
  });
});

test('the prompt script takes precedence over the app locale for mixed-language sessions', () => {
  assert.equal(getQuestionNarrationLanguage('ما هو الصيام؟', 'en'), 'ar');
  assert.equal(getQuestionNarrationLanguage('What is fasting?', 'ar'), 'en');
  assert.equal(getQuestionNarrationLanguage('123؟', 'ar'), 'ar');
  assert.equal(getQuestionNarrationLanguage('', 'en'), 'en');
});

test('opening a quiz narrates the first question once and timer updates do not repeat it', () => {
  const { coordinator, events, flush } = createCoordinatorHarness();
  const firstQuestion = {
    active: true,
    enabled: true,
    language: 'en' as const,
    questionKey: '21:101',
    text: 'Who was the first prophet?',
  };

  coordinator.updateAutomaticNarration(firstQuestion);
  flush();
  coordinator.updateAutomaticNarration(firstQuestion);
  flush();

  assert.deepEqual(events, [
    'stop',
    'speak:en:Who was the first prophet?',
  ]);
});

test('moving to a new question stops the previous narration and speaks the new prompt once', () => {
  const { coordinator, events, flush } = createCoordinatorHarness();

  coordinator.updateAutomaticNarration({
    active: true,
    enabled: true,
    language: 'en',
    questionKey: '21:101',
    text: 'First question',
  });
  flush();
  coordinator.updateAutomaticNarration({
    active: true,
    enabled: true,
    language: 'en',
    questionKey: '21:102',
    text: 'Second question',
  });
  flush();

  assert.deepEqual(events, [
    'stop',
    'speak:en:First question',
    'stop',
    'speak:en:Second question',
  ]);
});

test('answering, pausing, leaving, or disabling automatic narration stops speech', () => {
  const { coordinator, events, flush } = createCoordinatorHarness();
  const question = {
    active: true,
    enabled: true,
    language: 'en' as const,
    questionKey: '21:101',
    text: 'Question',
  };

  coordinator.updateAutomaticNarration(question);
  flush();
  coordinator.stop();
  coordinator.stop();
  coordinator.updateAutomaticNarration({ ...question, enabled: false });

  assert.deepEqual(events, ['stop', 'speak:en:Question', 'stop', 'stop', 'stop']);
});

test('manual replay remains available when automatic narration is disabled', () => {
  const { coordinator, events } = createCoordinatorHarness();

  coordinator.updateAutomaticNarration({
    active: true,
    enabled: false,
    language: 'ar',
    questionKey: '8:4',
    text: 'من هو أول الأنبياء؟',
  });
  coordinator.toggle({
    language: 'ar',
    questionKey: '8:4',
    text: 'من هو أول الأنبياء؟',
  });

  assert.deepEqual(events, ['stop', 'toggle:ar:من هو أول الأنبياء؟']);
});

test('the speech controller stops before speaking and exposes speaking state', async () => {
  const harness = createSpeechHarness();

  assert.equal(await harness.controller.speak('Question', 'en'), true);
  assert.equal(harness.stopCount, 1);
  assert.equal(harness.controller.isSpeaking(), true);
  assert.deepEqual(harness.spoken[0]?.options.language, 'en-US');
  assert.deepEqual(harness.spoken[0]?.options.rate, 0.9);
  assert.deepEqual(harness.spoken[0]?.options.pitch, 1);
  assert.deepEqual(harness.spoken[0]?.options.volume, 1);

  harness.spoken[0]?.options.onDone();
  assert.equal(harness.controller.isSpeaking(), false);
  assert.deepEqual(harness.speakingStates, [true, false]);
});

test('empty prompts and native speech failures are harmless', async () => {
  const harness = createSpeechHarness();

  assert.equal(await harness.controller.speak('   ', 'en'), false);
  assert.equal(harness.spoken.length, 0);

  harness.adapter.speak = () => {
    throw new Error('voice unavailable');
  };
  assert.equal(await harness.controller.speak('Question', 'ar'), false);
  assert.equal(harness.controller.isSpeaking(), false);
  assert.equal(harness.errors.length, 1);

  harness.adapter.stop = async () => {
    throw new Error('stop unavailable');
  };
  await assert.doesNotReject(harness.controller.stop());
  assert.equal(harness.errors.length, 2);
});
