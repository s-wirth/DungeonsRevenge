import SewerLevel from "logic/levels/SewerLevel";
import PestControlLevel from "logic/levels/PestControlLevel";

const LEVELS = [
  SewerLevel.props({ rats: 1.0, minions: 0.0 }),
  SewerLevel.props({ rats: 0.8, minions: 0.2 }),
  SewerLevel.props({ rats: 0.5, minions: 0.5 }),
  SewerLevel.props({ rats: 0.2, minions: 0.8 }),
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
