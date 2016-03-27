import SewerLevel from "logic/levels/SewerLevel";
import PestControlLevel from "logic/levels/PestControlLevel";

const LEVELS = [
  SewerLevel,
  SewerLevel,
  SewerLevel,
  SewerLevel,
  PestControlLevel,
];

export function enterPreviousLevel(currentPlayerLevel) {
  return currentPlayerLevel.previousLevel;
}

export function enterNextLevel(currentPlayerLevel) {
  if (!currentPlayerLevel) {
    return LEVELS[0]({ id: 0 });
  }

  if (currentPlayerLevel.nextLevel) {
    return currentPlayerLevel.nextLevel;
  }

  const newLevelId = currentPlayerLevel.id + 1;
  const newLevelType = LEVELS[newLevelId];
  const newLevel = newLevelType({ id: newLevelId });

  currentPlayerLevel.nextLevel = newLevel;
  newLevel.previousLevel = currentPlayerLevel;

  return newLevel;
}
