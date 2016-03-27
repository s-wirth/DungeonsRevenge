import ROT from "rot-js";
import Map from "logic/Map";

import {
  makeCreature,
} from "logic/creatures";

const BOSS_MAP_WIDTH = 20;
const BOSS_MAP_HEIGHT = 15;

export default function PestControlLevel(id) {
  const map = Map.create({ id, width: BOSS_MAP_WIDTH, height: BOSS_MAP_HEIGHT });
  const rotMap = new ROT.Map.Arena(BOSS_MAP_WIDTH, BOSS_MAP_HEIGHT);

  rotMap.create((x, y, wall) => {
    if (wall) {
      map.setTile("wall", { x, y });
    } else {
      map.setTile("floor", { x, y });
    }
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
