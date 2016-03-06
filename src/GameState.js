import EventEmitter from "eventemitter2";
import _ from "lodash";
import ndarray from "ndarray";
import ROT from "rot-js";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;

function makeTile(type) {
  return {
    type,
  };
}

let creatureIdCounter = 0;

function makeCreature(x, y, type) {
  let id = creatureIdCounter += 1;
  return {
    id,
    type,
    x, y,
  };
}

function makePlayer(x, y) {
  return {
    //type: 'player',
    x, y,
  };
}

function makeMap() {
  let map = ndarray([], [MAP_WIDTH, MAP_HEIGHT]);
  let rotMap = new ROT.Map.Digger(MAP_WIDTH, MAP_HEIGHT, {roomWidth: [7,12], roomHeight: [7,13], dugPercentage: 0.5});
  map.rotMap = rotMap;

  rotMap.create(function(x, y, wall) {
    map.set(x, y, wall ? makeTile("wall") : null);
  });

  setStairs(map);

  return map;
}

function setStairs(map) {
  let rotMap = map.rotMap;
  let rooms = rotMap.getRooms();
  var stairsDownPosition = rooms[0].getCenter();
  map.set(stairsDownPosition[0], stairsDownPosition[1], makeTile("stairsDown"));
  map.set(rooms[rooms.length - 1].getCenter()[0], rooms[rooms.length - 1].getCenter()[1], makeTile("stairsUp"));
  map.stairsDownPosition = stairsDownPosition;
}

function randomPositionIn(room) {
  return [
    Math.floor(room.getLeft() + (room.getRight() - room.getLeft()) * Math.random()),
    Math.floor(room.getTop() + (room.getBottom() - room.getTop()) * Math.random()),
  ];
}

function spawnEnemies(map) {
  let rotMap = map.rotMap;

  return rotMap.getRooms().map((room) => {
    let position = randomPositionIn(room);
    return makeCreature(position[0], position[1], 'enemy');
  });
}

function makeCreatureAct(creature, gameState) {
  let moveBy = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }][Math.round(Math.random() * 3)];

  gameState.updateCreaturePosition(creature, { x: creature.x + moveBy.x, y: creature.y + moveBy.y });
}

export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.map = makeMap();
  gameState.playerPosition = makePlayer(gameState.map.stairsDownPosition[0], gameState.map.stairsDownPosition[1]);

  gameState.creatures = spawnEnemies(gameState.map);

  Object.assign(gameState, {
    updateCreaturePosition(creature, destination) {
      let { x, y } = _.defaults(destination, creature);
      let tileAtDestination = gameState.map.get(x, y);

      if (tileAtDestination && tileAtDestination.type === "wall") return;

      creature.x = x;
      creature.y = y;
      gameState.emit("change");
    },

    updatePlayerPosition(destination) {
      gameState.updateCreaturePosition(gameState.playerPosition, destination);
      gameState.allowCreaturesToAct();
    },

    allowCreaturesToAct() {
      gameState.creatures.forEach((creature) => {
        makeCreatureAct(creature, gameState);
      });
    },
  });

  return gameState;
}

const defaultGameState = makeGameState();

export default defaultGameState;
