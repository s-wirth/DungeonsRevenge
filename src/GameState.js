import EventEmitter from "eventemitter2";
import _ from "lodash";
import {
  makePlayer,
  spawnEnemies,
  makeCreatureAct,
  makeCreatureAttack
} from "logic/creatures";
import {makeMap} from "logic/levels";

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
