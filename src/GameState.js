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
  setStairs(map, rotMap);
  return map;
}

function setStairs(map, rotMap) {
  let rooms = rotMap.getRooms();
  var stairsDownPosition = rooms[0].getCenter();
  map.set(stairsDownPosition[0], stairsDownPosition[1], makeTile("stairsDown"));
  map.set(rooms[rooms.length - 1].getCenter()[0], rooms[rooms.length - 1].getCenter()[1], makeTile("stairsUp"));
  map.stairsDownPosition = stairsDownPosition;
}

export function makeGameState() {
  let gameState = new EventEmitter();


  gameState.map = makeMap();
  gameState.playerPosition = {
    x: gameState.map.stairsDownPosition[0],
    y: gameState.map.stairsDownPosition[1],
  };
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
