import SewerLevel from "logic/levels/SewerLevel";
import PestControlLevel from "logic/levels/PestControlLevel";

const LEVELS = {
  0: (id) => SewerLevel({ id }),
  1: (id) => SewerLevel({ id }),
  2: (id) => SewerLevel({ id }),
  3: (id) => SewerLevel({ id }),
  4: PestControlLevel,
};

export function enterPreviousLevel(currentPlayerLevel) {
  return currentPlayerLevel.previousLevel;
}

export function enterNextLevel(currentPlayerLevel) {
  if (!currentPlayerLevel) {
    return LEVELS[0](0);
  }

  if (currentPlayerLevel.nextLevel) {
    return currentPlayerLevel.nextLevel;
  }

  const newLevelId = currentPlayerLevel.id + 1;
  const newLevelType = LEVELS[newLevelId];
  const newLevel = newLevelType(newLevelId);

  currentPlayerLevel.nextLevel = newLevel;
  newLevel.previousLevel = currentPlayerLevel;

  return newLevel;
}
