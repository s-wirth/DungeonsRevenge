import ROT from "rot-js";

let creatureIdCounter = 0;

export function makeCreature(x, y, type, baseDamage = 1, experienceLootOnKill = 1, maxHealth = 5, strength = 0, endurance = 1, experience = 0, experienceNeeded = 2, sightRadius = 8) {
  let id = creatureIdCounter += 1;
  return {
    id,
    type,
    x, y,
    experienceLootOnKill: experienceLootOnKill,
    strength: strength,
    endurance: endurance,
    experience: experience,
    experienceNeeded: experienceNeeded,
    baseDamage,
    maxHealth,
    health: maxHealth,
    sightRadius,
  };
}

export function makePlayer(x, y) {
  return makeCreature(x, y, "player", 3, null, 15, 1, 1, 0, 2, 6);
}

function distanceBetween({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) );
}

function findPath(origin, destination, canPassFn) {
  let pathfinder = new ROT.Path.Dijkstra(origin.x, origin.y, canPassFn, { topology: 4 });
  let result = [];
  pathfinder.compute(destination.x, destination.y, (x, y) => result.push({x, y}) );
  return result;
}

export function makeCreatureAct(creature, gameState) {
  function canSeePlayer() {
    // We ignore obstacles between us and the player
    return distanceBetween(creature, gameState.player) < creature.sightRadius;
  }

  function moveRandomly() {
    let moveBy = [
      {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1},
    ][Math.round(Math.random() * 3)];
    gameState.updateCreaturePosition(creature, {x: creature.x + moveBy.x, y: creature.y + moveBy.y});
  }

  function moveTowardsPlayer() {
    let player = gameState.player;
    let path = findPath(creature, player, (x, y) => {
      if (x === creature.x && y === creature.y || x === player.x && y === player.y) {
        return true;
      }
      return gameState.isTilePassable(x, y);
    });
    if (path.length > 0) {
      let firstStepFromOrigin = path[ path.length - 2 ];
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
