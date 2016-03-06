import EventEmitter from "eventemitter2";
import _ from "lodash";
import ndarray from "ndarray";
import ROT from "rot-js";
import {
  makePlayer,
  spawnEnemies,
  makeCreatureAct,
  makeCreatureAttack
} from "logic/creatures";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;

function makeTile(type) {
  return {
    type,
  };
}


function makeMap() {
  let map = ndarray([], [MAP_WIDTH, MAP_HEIGHT]);
  let rotMap = new ROT.Map.Digger(MAP_WIDTH, MAP_HEIGHT, {roomWidth: [7, 12], roomHeight: [7, 13], dugPercentage: 0.5});
  map.rotMap = rotMap;

  rotMap.create(function (x, y, wall) {
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


export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.map = makeMap();
  gameState.player = makePlayer(gameState.map.stairsDownPosition[0], gameState.map.stairsDownPosition[1]);

  gameState.creatures = spawnEnemies(gameState.map);
  gameState.creatures.push(gameState.player);

  Object.assign(gameState, {
    updateCreaturePosition(creature, destination) {
      let { x, y } = _.defaults(destination, creature);
      let tileAtDestination = gameState.map.get(x, y);

      if (tileAtDestination && tileAtDestination.type === "wall") return;
      for (let i = 0; i < gameState.creatures.length; i++) {
        if (gameState.creatures[i].x === destination.x && gameState.creatures[i].y === destination.y) {
          makeCreatureAttack(creature, gameState.creatures[i], gameState.creatures);
          return;
        }
      }

      creature.x = x;
      creature.y = y;
      gameState.emit("change");
    },

    updatePlayerPosition(destination) {
      gameState.updateCreaturePosition(gameState.player, destination);
      gameState.allowCreaturesToAct();
    },

    allowCreaturesToAct() {
      gameState.creatures.forEach((creature) => {
        if (creature.type === 'player') {
          return;
        }
        makeCreatureAct(creature, gameState);
      });
    },
  });

  return gameState;
}

const defaultGameState = makeGameState();

export default defaultGameState;
