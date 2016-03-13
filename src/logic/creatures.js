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

export function makeCreatureAct(creature, gameState) {
  let moveBy = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}][Math.round(Math.random() * 3)];

  gameState.updateCreaturePosition(creature, {x: creature.x + moveBy.x, y: creature.y + moveBy.y});
}

