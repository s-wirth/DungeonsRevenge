import { makeCreature } from "logic/creatures";

const INITIAL_PLAYER_LEVEL = 1;
const MAX_PLAYER_LEVEL = 30;

function maxHealthForLevel(level) {
  return Math.log2(level / (0.8 * MAX_PLAYER_LEVEL) + 1) * 200;
}

function experienceNeededToReachLevel(level) {
  return 10000 * Math.pow((level - 1) / MAX_PLAYER_LEVEL, 2);
}

export function makePlayer(x, y) {
  const player = makeCreature({
    x, y, type: "player", baseDamage: 3, maxHealth: 0, strength: 1,
    sightRadius: 5,
  });

  function setLevel(level) {
    player.level = level;
    const newMaxHealth = maxHealthForLevel(level);
    const maxHealthIncrease = newMaxHealth - player.maxHealth;
    player.maxHealth = newMaxHealth;
    player.increaseHealth(maxHealthIncrease);
    player.experienceNeeded = experienceNeededToReachLevel(level + 1);
  }

  setLevel(INITIAL_PLAYER_LEVEL);
  player.health = player.maxHealth;

  Object.assign(player, {
    gainExperience(experience) {
      player.experience += experience;
      if (player.experience >= player.experienceNeeded) {
        setLevel(player.level + 1);
        player.experience = 0;
        player.strength += 1;
      }
    },
  });

  return player;
}
