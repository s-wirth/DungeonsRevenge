import SewerLevel from "logic/levels/SewerLevel";
import PestControlLevel from "logic/levels/PestControlLevel";

export function enterPreviousLevel(currentPlayerLevel) {
  return currentPlayerLevel.previousLevel;
}

export function enterNextLevel(currentPlayerLevel) {
  if (!currentPlayerLevel.nextLevel) {
    let newLevel;

    if (currentPlayerLevel.id === 4) {
      newLevel = PestControlLevel(currentPlayerLevel.id + 1);
    } else {
      newLevel = SewerLevel(currentPlayerLevel.id + 1);
    }

    currentPlayerLevel.nextLevel = newLevel;
    newLevel.previousLevel = currentPlayerLevel;
    return newLevel;
  }

  return currentPlayerLevel.nextLevel;
}

export { Sewer as makeMap };
