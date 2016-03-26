import findPath from "logic/findPath";

let creatureIdCounter = 0;
const MAX_INVENTORY_SIZE = 9;

export function makeCreature({ x, y, type, baseDamage = 1, experienceLootOnKill = 1, maxHealth = 5,
  strength = 0, experience = 0, experienceNeeded = 5, sightRadius = 8 }) {
  const id = creatureIdCounter += 1;
  const creature = {
    id,
    type,
    x, y,
    experienceLootOnKill,
    strength,
    experience,
    experienceNeeded,
    baseDamage,
    maxHealth,
    health: maxHealth,
    sightRadius,
    inventory: [],
    inventorySize: MAX_INVENTORY_SIZE,
  };

  function increaseHealth(amount) {
    creature.health += amount;
    if (creature.health > creature.maxHealth) {
      creature.health = creature.maxHealth;
    }
  }

  Object.assign(creature, {
    increaseHealth,
  });

  return creature;
}

function distanceBetween({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function makeCreatureAct(creature, gameState) {
  function canSeePlayer() {
    // We ignore obstacles between us and the player
    return distanceBetween(creature, gameState.player) < creature.sightRadius;
  }

  function moveRandomly() {
    const moveBy = [
      { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 },
    ][Math.round(Math.random() * 3)];
    gameState.updateCreaturePosition(creature, {
      x: creature.x + moveBy.x,
      y: creature.y + moveBy.y,
    });
  }

  function moveTowardsPlayer() {
    const player = gameState.player;
    const path = findPath(creature, player, gameState.isTilePassable);
    if (path.length > 0) {
      const firstStepFromOrigin = path[path.length - 2];
      gameState.updateCreaturePosition(creature, firstStepFromOrigin);
    } else {
      moveRandomly();
    }
  }

  if (canSeePlayer()) {
    moveTowardsPlayer();
  } else {
    moveRandomly();
  }
}
