import stampit from "stampit";
import creatures from "logic/creatures";
import Creature from "logic/creatures/Creature";

const INITIAL_PLAYER_LEVEL = 1;
const MAX_PLAYER_LEVEL = 30;

function maxHealthForLevel(level) {
  return Math.log2(level / (0.8 * MAX_PLAYER_LEVEL) + 1) * 200;
}

function experienceNeededToReachLevel(playerLevel) {
  return 10000 * Math.pow((playerLevel - 1) / MAX_PLAYER_LEVEL, 2);
}

function averageHitsInflictedPerEnemy(dungeonLevel) {
  return 2 * Math.pow(1.05, (dungeonLevel - 1));
}


function averageEnemyHealth(dungeonLevel) {
  return 2 * Math.pow(1.2, dungeonLevel - 1);
}

function averageHitsToKillEnemy(dungeonLevel) {
  return averageHitsInflictedPerEnemy(dungeonLevel);
}

function averagePlayerDamageRequired(dungeonLevel) {
  return averageEnemyHealth(dungeonLevel) / averageHitsToKillEnemy(dungeonLevel);
}

function proportionDamageByWeaponVsOther(dungeonLevel) {
  return 1 - (0.3 * (dungeonLevel - 1) / MAX_PLAYER_LEVEL);
}

function averagePlayerDamageByWeapon(dungeonLevel) {
  return proportionDamageByWeaponVsOther(dungeonLevel) * averagePlayerDamageRequired(dungeonLevel);
}

function setLevel(player, playerLevel) {
  player.level = playerLevel;
  const newMaxHealth = maxHealthForLevel(playerLevel);
  const maxHealthIncrease = newMaxHealth - player.maxHealth;
  player.maxHealth = newMaxHealth;
  player.increaseHealth(maxHealthIncrease);
  player.experienceNeeded = experienceNeededToReachLevel(playerLevel + 1);
  player.damage = averagePlayerDamageByWeapon(playerLevel);
}

const Player = Creature.compose(stampit({
  props: {
    type: "player",
    damage: 3,
    maxHealth: 0,
    sightRadius: 5,
    experience: 0,
  },

  methods: {
    gainExperience(player, experience) {
      player.experience += experience;
      if (player.experience >= player.experienceNeeded) {
        player.setLevel(player.level + 1);
        player.experience = 0;
      }
    },
  },

  init({ instance: player }) {
    setLevel(player, INITIAL_PLAYER_LEVEL);
  },
}));

export function makePlayer(x, y) {
  return Player.create({ x, y });
}

export default Player;
