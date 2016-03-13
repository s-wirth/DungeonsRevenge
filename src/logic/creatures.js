let creatureIdCounter = 0;

export function makeCreature(x, y, type, baseDamage = 1, maxHealth = 5) {
  let id = creatureIdCounter += 1;
  return {
    id,
    type,
    x, y,
    baseDamage: baseDamage,
    maxHealth: maxHealth,
    health: maxHealth,
  };
}

export function makePlayer(x, y) {
  return makeCreature(x, y, "player", 3, 15);
}

function distanceBetween({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
}

export function makeCreatureAct(creature, gameState) {
  function canSeePlayer() {
    const MAX_VISIBLE_DISTANCE = 8;
    // We ignore obstacles between us and the player
    return distanceBetween(creature, gameState.player) < MAX_VISIBLE_DISTANCE;
  }

  function moveRandomly() {
    let moveBy = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}][Math.round(Math.random() * 3)];
    gameState.updateCreaturePosition(creature, {x: creature.x + moveBy.x, y: creature.y + moveBy.y});
  }

  function moveTowardsPlayer() {
    let player = gameState.player;
    let moveX = Math.sign(player.x - creature.x);
    let moveY = Math.sign(player.y - creature.y);
    if (moveX !== 0) {
      gameState.updateCreaturePosition(creature, { x: creature.x + moveX, y: creature.y });
    } else if (moveY !== 0) {
      gameState.updateCreaturePosition(creature, { x: creature.x, y: creature.y + moveY});
    }
  }

  if (canSeePlayer()) {
    moveTowardsPlayer();
  } else {
    moveRandomly();
  }
}
