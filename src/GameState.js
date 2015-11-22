import EventEmitter from "eventemitter2";
import _ from "lodash";
import ndarray from "ndarray";

const gameState = new EventEmitter();
const MAP_WIDTH = 80;
const MAP_HEIGHT = 100;

gameState.playerPosition = {
  x: 0,
  y: 0,
};

gameState.map = ndarray([], [MAP_WIDTH, MAP_HEIGHT]);

function makeTile(type) {
  return {
    type,
  };
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

makeARectangularRoom(gameState.map, 12, 10, 2, 2);

export function updatePlayerPosition(newPosition) {
  _.extend(gameState.playerPosition, newPosition);
  gameState.emit("change");
}

export default gameState;
