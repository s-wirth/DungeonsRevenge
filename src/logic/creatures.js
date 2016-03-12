let creatureIdCounter = 0;

function makeCreature(x, y, type) {
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
    health: 1,
  };
}

function randomPositionIn(room) {
  return [
    Math.floor(room.getLeft() + (room.getRight() - room.getLeft()) * Math.random()),
    Math.floor(room.getTop() + (room.getBottom() - room.getTop()) * Math.random()),
  ];
}

export function spawnEnemies(map) {
  let rotMap = map.rotMap;

  return rotMap.getRooms().map((room) => {
    let position = randomPositionIn(room);
    return makeCreature(position[0], position[1], 'enemy');
  });
}

export function makeCreatureAct(creature, gameState) {
  let moveBy = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}][Math.round(Math.random() * 3)];

  gameState.updateCreaturePosition(creature, {x: creature.x + moveBy.x, y: creature.y + moveBy.y});
}

