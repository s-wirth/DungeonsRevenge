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

function makeMap() {
  let map = ndarray([], [MAP_WIDTH, MAP_HEIGHT]);
  let rotMap = new ROT.Map.Digger(MAP_WIDTH, MAP_HEIGHT);
  rotMap.create(function(x, y, wall) {
    map.set(x, y, wall ? makeTile("wall") : null);
  });
  return map;
}

export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.playerPosition = {
    x: 1,
    y: 1,
  };
  gameState.map = makeMap();

  Object.assign(gameState, {
    updatePlayerPosition(destination) {
      let { x, y } = _.defaults(destination, gameState.playerPosition);
      let tileAtDestination = gameState.map.get(x, y);

      if (tileAtDestination && tileAtDestination.type === "wall") return;

      gameState.playerPosition.x = x;
      gameState.playerPosition.y = y;
      gameState.emit("change");
    },
  });

  return gameState;
}

const defaultGameState = makeGameState();

export default defaultGameState;
