import ndarray from "ndarray";
import ROT from "rot-js";

import {
  makeCreature
} from "logic/creatures";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;

const BOSS_MAP_WIDTH = 20;
const BOSS_MAP_HEIGHT = 15;

function makeTile(type) {
  return {
    type,
  };
}

export function enterNextLevel(currentPlayerLevel) {
  if (!currentPlayerLevel.nextLevel) {

    let newLevel;

    if (currentPlayerLevel.id === 0) {
      newLevel = bossLevel(currentPlayerLevel.id + 1);
    } else {
      newLevel = makeMap(currentPlayerLevel.id + 1);
    }

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

export function bossLevel(id) {
  let map = ndarray([], [BOSS_MAP_WIDTH, BOSS_MAP_HEIGHT]);
  let rotMap = new ROT.Map.Arena(BOSS_MAP_WIDTH, BOSS_MAP_HEIGHT);
  map.id = id;

  rotMap.create(function (x, y, wall) {
    map.set(x, y, wall ? makeTile("wall") : makeTile("floor"));
  });
  setStairs(map, [1,2]);
  setInitialPlayerPosition(map, 1, 2);
  map.creatures = [makeCreature(BOSS_MAP_WIDTH-5, Math.floor(BOSS_MAP_HEIGHT/2), "pestcontrol", 5, 20)];

  return map;
}

export function makeMap(id) {
  let map = ndarray([], [MAP_WIDTH, MAP_HEIGHT]);
  let rotMap = new ROT.Map.Digger(MAP_WIDTH, MAP_HEIGHT, {roomWidth: [7, 12], roomHeight: [7, 13], dugPercentage: 0.5});
  map.id = id || 0;

  rotMap.create(function (x, y, wall) {
    map.set(x, y, wall ? makeTile("wall") : makeTile("floor"));
  });

  let rooms = rotMap.getRooms();

  if (map.id != 0){
    setStairs(map, rooms[0].getCenter(), rooms[rooms.length - 1].getCenter());
  } else {
    setStairs(map, null, rooms[rooms.length - 1].getCenter());
  }

  setInitialPlayerPosition(map, rooms[0].getCenter()[0], rooms[0].getCenter()[1]);
  map.creatures = spawnEnemies(rotMap);
  return map;
}

function setStairs(map, stairsDownPosition, stairsUpPosition) {
  if(stairsDownPosition) {
    map.stairsDownPosition = stairsDownPosition;
    map.set(stairsDownPosition[0], stairsDownPosition[1], makeTile("stairsDown"));
  }
  if(stairsUpPosition) {
    map.stairsUpPosition = stairsUpPosition;
    map.set(stairsUpPosition[0], stairsUpPosition[1], makeTile("stairsUp"));
  }
}

function setInitialPlayerPosition(map, x, y) {
  map.initialPlayerPosition = {x: x, y: y}
}

function randomPositionIn(room) {
  return [
    Math.floor(room.getLeft() + (room.getRight() - room.getLeft()) * Math.random()),
    Math.floor(room.getTop() + (room.getBottom() - room.getTop()) * Math.random()),
  ];
}

export function spawnEnemies(rotMap) {
  return rotMap.getRooms().map((room) => {
    let position = randomPositionIn(room);
    return makeCreature(position[0], position[1], 'enemy');
  });
}
