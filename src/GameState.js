import EventEmitter from "eventemitter2";
import _ from "lodash";
import ROT from "rot-js";
import {
  makePlayer,
  spawnEnemies,
  makeCreatureAct,
  makeCreatureAttack
} from "logic/creatures";
import {
  enterNextLevel,
  enterPreviousLevel,
  makeMap
} from "logic/levels";

function addIncludesMethod(sightMap) {
  sightMap.includes = function(x, y) {
    return sightMap.indexOf(`${x},${y}`) != -1;
  };
}

export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.map = makeMap();

  gameState.player = makePlayer(gameState.map.rotMap.getRooms()[0].getCenter()[0], gameState.map.rotMap.getRooms()[0].getCenter()[1]);

  gameState.map.creatures = spawnEnemies(gameState.map);
  gameState.creatures = gameState.map.creatures;
  gameState.creatures.push(gameState.player);
  gameState.sightMap = calculateSight(gameState.player.x, gameState.player.y);
  gameState.memorisedSightMap = [].concat(gameState.sightMap);
  addIncludesMethod(gameState.memorisedSightMap);

  function calculateSight(playerPositionX, playerPositionY) {

    var lightPasses = function(x, y) {
      let tile = gameState.map.get(x, y);
      let opaqueTiles = ['wall'];
      /*returns true if tile.type is not in opaqueTiles list*/
      return !tile || opaqueTiles.indexOf(tile.type) === -1;
    };

    var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
    let sightMap = [];

    fov.compute(playerPositionX, playerPositionY, 10, function(x, y, r, visibility) {
      if (visibility > 0) {
        let visibleTile = `${x},${y}`;
        sightMap.push(visibleTile);
      }
    });

    addIncludesMethod(sightMap);

    return sightMap;
  }

  Object.assign(gameState, {
    updateCreaturePosition(creature, destination) {
      let { x, y } = _.defaults(destination, creature);
      let tileAtDestination = gameState.map.get(x, y);

      if (tileAtDestination && tileAtDestination.type === "wall") return;

      if (creature.type === "player"){
        if (tileAtDestination && tileAtDestination.type === "stairsUp") {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(creature), 1);
          gameState.map = enterNextLevel(gameState.map);
          creature.x = gameState.map.stairsDownPosition[0];
          creature.y = gameState.map.stairsDownPosition[1];
          if (!gameState.map.creatures) {
            gameState.map.creatures = spawnEnemies(gameState.map);
          }
          gameState.creatures = gameState.map.creatures;
          gameState.creatures.push(gameState.player);
          return;
        }
        if (tileAtDestination && tileAtDestination.type === "stairsDown") {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(creature), 1);
          gameState.map = enterPreviousLevel(gameState.map);
          creature.x = gameState.map.stairsUpPosition[0];
          creature.y = gameState.map.stairsUpPosition[1];
          gameState.creatures = gameState.map.creatures;
          gameState.creatures.push(gameState.player);
          return;
        }
      }
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

      gameState.sightMap = calculateSight(gameState.player.x, gameState.player.y);
      gameState.memorisedSightMap = _.uniq(gameState.memorisedSightMap.concat(gameState.sightMap));
      addIncludesMethod(gameState.memorisedSightMap);

      gameState.emit("change");
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
