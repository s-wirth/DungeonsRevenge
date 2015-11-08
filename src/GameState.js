import EventEmitter from "eventemitter2";
import _ from "lodash";

const gameState = new EventEmitter();
gameState.playerPosition = {
  x: 0,
  y: 0,
};

export function updatePlayerPosition(newPosition) {
  _.extend(gameState.playerPosition, newPosition);
  gameState.emit("change");
}

export default gameState;
