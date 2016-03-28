import ROT from "rot-js";
import Map from "logic/Map";
import stampit from "stampit";

import {
  makeCreature,
} from "logic/creatures";

const BOSS_MAP_WIDTH = 20;
const BOSS_MAP_HEIGHT = 15;

const PestControlLevel = Map.compose(stampit({
  init({ instance: map }) {
    const rotMap = new ROT.Map.Arena(BOSS_MAP_WIDTH, BOSS_MAP_HEIGHT);

    rotMap.create((x, y, wall) => {
      if (wall) {
        map.setTile("wall", { x, y });
      } else {
        map.setTile("floor", { x, y });
      }
    });

    map.setStairs([1, 2]);
    map.setInitialPlayerPosition(1, 2);

    map.creatures = [
      makeCreature("pestcontrol", {
        x: BOSS_MAP_WIDTH - 5, y: Math.floor(BOSS_MAP_HEIGHT / 2),
      }),
    ];
  },
}));
export default PestControlLevel;
