import ROT from "rot-js";
import Map from "logic/Map";

import {
  makeCreature,
} from "logic/creatures";

const BOSS_MAP_WIDTH = 20;
const BOSS_MAP_HEIGHT = 15;

function makeTile(type) {
  return {
    type,
  };
}
import SewerLevel from "logic/levels/SewerLevel";

export function enterPreviousLevel(currentPlayerLevel) {
  return currentPlayerLevel.previousLevel;
}

export function bossLevel(id) {
  const map = Map.create({ id, width: BOSS_MAP_WIDTH, height: BOSS_MAP_HEIGHT });
  const rotMap = new ROT.Map.Arena(BOSS_MAP_WIDTH, BOSS_MAP_HEIGHT);

  rotMap.create((x, y, wall) => {
    map.tiles.set(x, y, wall ? makeTile("wall") : makeTile("floor"));
  });
  map.setStairs(map, [1, 2]);
  map.setInitialPlayerPosition(1, 2);
  map.creatures = [
    makeCreature("pestcontrol", {
      x: BOSS_MAP_WIDTH - 5, y: Math.floor(BOSS_MAP_HEIGHT / 2),
    }),
  ];

  return map;
}

export function enterNextLevel(currentPlayerLevel) {
  if (!currentPlayerLevel.nextLevel) {
    let newLevel;

    if (currentPlayerLevel.id === 4) {
      newLevel = bossLevel(currentPlayerLevel.id + 1);
    } else {
      newLevel = Sewer(currentPlayerLevel.id + 1);
    }

    currentPlayerLevel.nextLevel = newLevel;
    newLevel.previousLevel = currentPlayerLevel;
    return newLevel;
  }

  return currentPlayerLevel.nextLevel;
}

export { Sewer as makeMap };
