import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
} from 'expo-audio';

import { getSoundPreferences } from '@/services/profile.service';

const answerSoundSources = {
  correct: require('../assets/sounds/answer-correct.wav'),
  wrong: require('../assets/sounds/answer-wrong.wav'),
} as const;

export type AnswerSound = keyof typeof answerSoundSources;

let players: Record<AnswerSound, AudioPlayer> | null = null;
let audioModePromise: Promise<void> | null = null;

function getPlayers() {
  if (!players) {
    players = {
      correct: createAudioPlayer(answerSoundSources.correct),
      wrong: createAudioPlayer(answerSoundSources.wrong),
    };
  }

  return players;
}

function configureAudioMode() {
  if (!audioModePromise) {
    // Short reaction cues, so they mix with whatever else is playing and are
    // still audible when the ringer is silenced.
    audioModePromise = setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    }).catch(() => undefined);
  }

  return audioModePromise;
}

/**
 * Warms up the answer cues so the first reaction of a session is not delayed by
 * decoding. Safe to call repeatedly.
 */
export async function prepareAnswerSounds() {
  try {
    getPlayers();
    await configureAudioMode();
  } catch {
    // Audio is decorative: never let it interrupt gameplay.
  }
}

export async function playAnswerSound(sound: AnswerSound) {
  try {
    const { soundVolume } = await getSoundPreferences();
    if (soundVolume <= 0) {
      return;
    }

    await configureAudioMode();
    const player = getPlayers()[sound];
    player.volume = soundVolume;

    // A cue that already ran sits at its end, so rewind before replaying it.
    if (player.currentTime > 0) {
      await player.seekTo(0);
    }

    player.play();
  } catch {
    // Audio is decorative: never let it interrupt gameplay.
  }
}

export function releaseAnswerSounds() {
  if (!players) {
    return;
  }

  const activePlayers = players;
  players = null;

  try {
    activePlayers.correct.remove();
    activePlayers.wrong.remove();
  } catch {
    // The players may already be released by a fast unmount.
  }
}
