import ndarray from "ndarray";
import ROT from "rot-js";

import {
  makeCreature
} from "logic/creatures";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;

function makeTile(type) {
  return {
    type,
  };
}

export function enterNextLevel(currentPlayerLevel) {
  if (!currentPlayerLevel.nextLevel) {
    let newLevel = makeMap(currentPlayerLevel.id + 1);
    currentPlayerLevel.nextLevel = newLevel;
    newLevel.previousLevel = currentPlayerLevel;
    return newLevel;
  } else {
    return currentPlayerLevel.nextLevel;
  }
}
export function enterPreviousLevel(currentPlayerLevel) {
  return currentPlayerLevel.previousLevel;
}

export function makeMap(id) {
  let map = ndarray([], [MAP_WIDTH, MAP_HEIGHT]);
  let rotMap = new ROT.Map.Digger(MAP_WIDTH, MAP_HEIGHT, {roomWidth: [7, 12], roomHeight: [7, 13], dugPercentage: 0.5});
  map.rotMap = rotMap;
  map.id = id || 0;

  rotMap.create(function (x, y, wall) {
    map.set(x, y, wall ? makeTile("wall") : makeTile("floor"));
  });
  setStairs(map);
  setInitialPlayerPosition(map);
  map.creatures = spawnEnemies(map);
  return map;
}

function setStairs(map) {
  let rotMap = map.rotMap;
  let rooms = rotMap.getRooms();
  if(map.id !== 0) {
    var stairsDownPosition = rooms[0].getCenter();
    map.stairsDownPosition = stairsDownPosition;
    map.set(stairsDownPosition[0], stairsDownPosition[1], makeTile("stairsDown"));
  }
  if(map.id !== 4) {
    var stairsUpPosition = rooms[rooms.length - 1].getCenter();
    map.stairsUpPosition = stairsUpPosition;
    map.set(stairsUpPosition[0], stairsUpPosition[1], makeTile("stairsUp"));
  }
}

function setInitialPlayerPosition(map) {
  let rotMap = map.rotMap;
  let rooms = rotMap.getRooms();
  map.initialPlayerPosition = {x: rooms[0].getCenter()[0], y: rooms[0].getCenter()[1]}
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
