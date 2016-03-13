import EventEmitter from "eventemitter2";
import _ from "lodash";
import ROT from "rot-js";
import {
  makePlayer,
  makeCreatureAct
} from "logic/creatures";
import {
  enterNextLevel,
  enterPreviousLevel,
  makeMap,
  spawnEnemies
} from "logic/levels";

function makeSightMap() {
  let sightMap = {
    visibleTiles: {},
    setVisible(x, y) {
      sightMap.visibleTiles[`${x},${y}`] = true;
    },
    includes(x, y) {
      return sightMap.visibleTiles[`${x},${y}`];
    },
    combine(otherSightMap) {
      Object.assign(sightMap.visibleTiles, otherSightMap.visibleTiles);
    },
  };
  return sightMap;
}

export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.introScreenShown = false;
  gameState.playerDeath = false;

  gameState.playerWon = false;

  gameState.map = makeMap();
  gameState.player = makePlayer(gameState.map.initialPlayerPosition.x, gameState.map.initialPlayerPosition.y);

  gameState.map.creatures.push(gameState.player);

  function updatePlayerSightMap() {
    gameState.map.sightMap = calculateSightMap(gameState.player.x, gameState.player.y);

    if (!gameState.map.memorisedSightMap) gameState.map.memorisedSightMap = makeSightMap();

    gameState.map.memorisedSightMap.combine(gameState.map.sightMap);
  }

  updatePlayerSightMap();

  function calculateSightMap(playerPositionX, playerPositionY) {

    var lightPasses = function (x, y) {
      let tile = gameState.map.get(x, y);
      let opaqueTiles = ['wall'];
      /*returns true if tile.type is not in opaqueTiles list*/
      return !tile || opaqueTiles.indexOf(tile.type) === -1;
    };

    var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
    let sightMap = makeSightMap();

    fov.compute(playerPositionX, playerPositionY, 6, function (x, y, r, visibility) {
      if (visibility > 0) {
        sightMap.setVisible(x, y);
      }
    });

    return sightMap;
  }

  Object.assign(gameState, {
    updateCreaturePosition(creature, destination) {
      let { x, y } = _.defaults(destination, creature);
      let tileAtDestination = gameState.map.get(x, y);

      if (tileAtDestination && tileAtDestination.type === "wall") return;

      if (creature.type === "player") {
        if (tileAtDestination && tileAtDestination.type === "stairsUp") {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(creature), 1);
          gameState.map = enterNextLevel(gameState.map);
          creature.x = gameState.map.stairsDownPosition[0];
          creature.y = gameState.map.stairsDownPosition[1];
          gameState.map.creatures.push(gameState.player);
          return;
        }
        if (tileAtDestination && tileAtDestination.type === "stairsDown") {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(creature), 1);
          gameState.map = enterPreviousLevel(gameState.map);
          creature.x = gameState.map.stairsUpPosition[0];
          creature.y = gameState.map.stairsUpPosition[1];
          gameState.map.creatures.push(gameState.player);
          return;
        }
      }
      for (let i = 0; i < gameState.map.creatures.length; i++) {
        if (gameState.map.creatures[i].x === destination.x && gameState.map.creatures[i].y === destination.y) {
          gameState.makeCreatureAttack(creature, gameState.map.creatures[i]);
          return;
        }
      }

      creature.x = x;
      creature.y = y;
    },

    makeCreatureAttack(attacker, defender) {
      defender.health -= attacker.baseDamage;
      if (defender.health <= 0) {
        if (defender.type==="player") {
          console.log("playerDied");
          gameState.playerDeath = true;
        } else if (defender.type==="pestcontrol") {
          console.log("playerWon");
          gameState.playerWon = true;
        } else {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(defender), 1);
        }
        gameState.emit("change");
      }
    },

    switchFromIntroToDungeon() {
      gameState.introScreenShown = true;
      gameState.emit("change");
    },

    updatePlayerPosition(destination) {
      gameState.updateCreaturePosition(gameState.player, destination);
      gameState.allowCreaturesToAct();
      updatePlayerSightMap();

      gameState.emit("change");
    },

    allowCreaturesToAct() {
      gameState.map.creatures.forEach((creature) => {
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
