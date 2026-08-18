export type TimerColorState = "green" | "orange" | "red";

export function getTimerColorState(secondsRemaining: number): TimerColorState {
  if (secondsRemaining > 15) {
    return "green";
  }

  if (secondsRemaining >= 7) {
    return "orange";
  }

  return "red";
}
