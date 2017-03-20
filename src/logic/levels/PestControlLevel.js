import ROT from "rot-js";
import Map from "logic/Map";
import stampit from "stampit";
import bossMusic from "assets/audio/background/boss";

import creatures from "logic/creatures";

const BOSS_MAP_WIDTH = 20;
const BOSS_MAP_HEIGHT = 15;

const PestControlLevel = Map.compose(stampit({
  props: {
    music: bossMusic,
  },

  init({ instance: map }) {
    const rotMap = new ROT.Map.Arena(BOSS_MAP_WIDTH, BOSS_MAP_HEIGHT);

    rotMap.create((x, y, wall) => {
      if (wall) {
        map.setTile("wall", { x, y });
      } else {
        map.setTile("floor", { x, y });
      }
    });

    map.setStairs({ x: 1, y: 2 });
    map.setInitialPlayerPosition({ x: 1, y: 2 });

    map.creatures = [
      creatures.pestcontrol.create({
        x: BOSS_MAP_WIDTH - 5, y: Math.floor(BOSS_MAP_HEIGHT / 2),
      }),
    ];
  },
}));
export default PestControlLevel;
