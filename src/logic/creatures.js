let creatureIdCounter = 0;

export function makeCreature(x, y, type) {
  let id = creatureIdCounter += 1;
  return {
    id,
    type,
    x, y,
    maxHealth: 5,
    health: 5,
  };
}

export function makePlayer(x, y) {
  return {
    type: 'player',
    x, y,
    maxHealth: 10,
    health: 10,
  };
}

export function makeCreatureAct(creature, gameState) {
  let moveBy = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}][Math.round(Math.random() * 3)];

  gameState.updateCreaturePosition(creature, {x: creature.x + moveBy.x, y: creature.y + moveBy.y});
}

