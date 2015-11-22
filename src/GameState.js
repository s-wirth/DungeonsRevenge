import EventEmitter from "eventemitter2";
import _ from "lodash";
import ndarray from "ndarray";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 100;

function makeTile(type) {
  return {
    type,
  };
}

function makeMap() {
  let map = ndarray([], [MAP_WIDTH, MAP_HEIGHT]);
  return map;
}

function makeARectangularRoom(map, width, height, topLeftX, topLeftY) {
  // Make top edge
  for (let i = topLeftX; i < topLeftX + width; i++) {
    map.set(i, topLeftY, makeTile("wall"));
  }
  // Make right edge
  for (let i = topLeftY; i < topLeftY + height; i++) {
    map.set(topLeftX + width, i, makeTile("wall"));
  }
  // Make bottom edge
  for (let i = topLeftX; i < topLeftX + width; i++) {
    map.set(i, topLeftY + height - 1, makeTile("wall"));
  }
  // Make left edge
  for (let i = topLeftY; i < topLeftY + height; i++) {
    map.set(topLeftX, i, makeTile("wall"));
  }
}

export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.playerPosition = {
    x: 0,
    y: 0,
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
makeARectangularRoom(defaultGameState.map, 12, 10, 2, 2);

export default defaultGameState;
