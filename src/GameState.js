import EventEmitter from "eventemitter2";
import _ from "lodash";
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

export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.map = makeMap();

  gameState.player = makePlayer(gameState.map.rotMap.getRooms()[0].getCenter()[0], gameState.map.rotMap.getRooms()[0].getCenter()[1]);

  gameState.map.creatures = spawnEnemies(gameState.map);
  gameState.creatures = gameState.map.creatures;
  gameState.creatures.push(gameState.player);

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
          gameState.emit("change");
          return;
        }
        if (tileAtDestination && tileAtDestination.type === "stairsDown") {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(creature), 1);
          gameState.map = enterPreviousLevel(gameState.map);
          creature.x = gameState.map.stairsUpPosition[0];
          creature.y = gameState.map.stairsUpPosition[1];
          gameState.creatures = gameState.map.creatures;
          gameState.creatures.push(gameState.player);
          gameState.emit("change");
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
