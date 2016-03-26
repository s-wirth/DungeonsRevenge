import { makeCreature } from "logic/creatures";

export function makePlayer(x, y) {
  const player = makeCreature({
    x, y, type: "player", baseDamage: 3, maxHealth: 15, strength: 1,
    sightRadius: 5,
  });

  Object.assign(player, {
    calculateExperienceAndStrength(experience) {
      player.experience += experience;
      if (player.experience >= player.experienceNeeded) {
        player.experience = 0;
        player.experienceNeeded += 5;
        player.maxHealth += 3;
        player.health += 3;
        player.strength += 1;
      }
    },
  });

  return player;
}
