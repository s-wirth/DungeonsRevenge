import EventEmitter from "eventemitter2";
import _ from "lodash";
import ROT from "rot-js";
import {
  makeSightMap,
} from "logic/SightMap";
import {
  makePlayer,
  makeCreatureAct,
} from "logic/creatures";
import {
  enterNextLevel,
  enterPreviousLevel,
  makeMap,
} from "logic/levels";
import findPath from "logic/findPath";

export function makeGameState() {
  const gameState = new EventEmitter();

  gameState.introScreenShown = false;
  gameState.playerDeath = false;

  gameState.playerWon = false;

  gameState.map = makeMap();
  gameState.player = makePlayer(
    gameState.map.initialPlayerPosition.x,
    gameState.map.initialPlayerPosition.y
  );

  gameState.map.creatures.push(gameState.player);

  function calculateSightMap(creature) {
    const map = gameState.map;

    function lightPasses(x, y) {
      if (creature.x === x && creature.y === y) {
        return true;
      }
      const tile = gameState.map.get(x, y);
      const opaqueTiles = ["wall", "door"];
      /* returns true if tile.type is not in opaqueTiles list*/
      return !tile || opaqueTiles.indexOf(tile.type) === -1;
    }

    const fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
    const sightMap = makeSightMap(map.width, map.height);

    fov.compute(creature.x, creature.y, creature.sightRadius, (x, y, r, visibility) => {
      if (visibility > 0) {
        sightMap.setVisible(x, y);
      }
    });

    return sightMap;
  }

  function updatePlayerSightMap() {
    const map = gameState.map;
    const player = gameState.player;
    map.sightMap = calculateSightMap(player);

    if (!map.memorisedSightMap) {
      map.memorisedSightMap = makeSightMap(map.width, map.height);
    }

    map.memorisedSightMap = map.memorisedSightMap.combine(map.sightMap);
  }

  updatePlayerSightMap();

  function getCreatureAt(x, y) {
    const creatures = gameState.map.creatures;
    for (let i = 0; i < creatures.length; i++) {
      const creature = creatures[i];
      if (creature.x === x && creature.y === y) return creatures[i];
    }
    return null;
  }

  function itemAtPosition(x, y) {
    const potions = gameState.map.potions;
    if (potions) {
      for (let i = 0; i < potions.length; i++) {
        const potion = potions[i];
        if (potion.x === x && potion.y === y) return potions[i];
      }
    }
    return null;
  }

  function updatePlayerPosition(destination) {
    const { x: originalX, y: originalY } = gameState.player;
    gameState.updateCreaturePosition(gameState.player, destination);

    const playerDidntMove = originalX === gameState.player.x && gameState.player.y === originalY;
    if (playerDidntMove) return;

    gameState.allowCreaturesToAct();
    updatePlayerSightMap();
    gameState.emit("change");
  }

  let playerMoveTimeoutID;
  function abortMovement() {
    clearTimeout(playerMoveTimeoutID);
    playerMoveTimeoutID = null;
  }

  function movePlayerTo({ x, y }) {
    const STEP_INTERVAL = 200;

    function queueNextStep(takeNextStep) {
      playerMoveTimeoutID = setTimeout(() => {
        abortMovement();
        takeNextStep();
      }, STEP_INTERVAL);
    }

    function movementInProgress() {
      return !!playerMoveTimeoutID;
    }

    function takeStep() {
      const player = gameState.player;
      const path = findPath(player, { x, y }, gameState.isTilePassable);
      const haveReachedDestination = player.x === x && player.y === y;
      const canReachDestination = path.length > 0;

      abortMovement();
      if (haveReachedDestination || !canReachDestination) return;

      const firstStepFromOrigin = path[path.length - 2];
      const creatureAtDestination = getCreatureAt(firstStepFromOrigin.x, firstStepFromOrigin.y);
      updatePlayerPosition(firstStepFromOrigin);
      if (!creatureAtDestination) {
        queueNextStep(takeStep);
      }
    }

    if (movementInProgress()) {
      abortMovement();
    } else {
      takeStep();
    }
  }

  Object.assign(gameState, {
    updateCreaturePosition(creature, destination) {
      /* eslint no-param-reassign:0 */
      const { x, y } = _.defaults(destination, creature);
      const tileAtDestination = gameState.map.get(x, y);

      if (tileAtDestination && tileAtDestination.type === "wall") return;

      const creatureAtDestination = getCreatureAt(destination.x, destination.y);
      if (creatureAtDestination) {
        gameState.makeCreatureAttack(creature, creatureAtDestination);
        return;
      }

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
        const itemAtDestination = itemAtPosition(x, y);
        const player = gameState.player;
        if (itemAtDestination && (player.health !== player.maxHealth)) {
          player.health += itemAtDestination.healsOnConsume;
          if (player.health > player.maxHealth) player.health = player.maxHealth;
          gameState.map.potions.splice(gameState.map.potions.indexOf(itemAtDestination), 1);
        }
      }

      creature.x = x;
      creature.y = y;
    },

    calculateExperienceAndStrength(experience) {
      gameState.player.experience += experience;
      if (gameState.player.experience >= gameState.player.experienceNeeded) {
        gameState.player.experience = 0;
        gameState.player.experienceNeeded += 5;
        gameState.player.maxHealth += 3;
        gameState.player.health += 3;
        gameState.player.strength += 1;
      }
    },

    makeCreatureAttack(attacker, defender) {
      const attackerActualDamage = attacker.baseDamage + attacker.strength;
      defender.health -= attackerActualDamage;
      if (defender.health <= 0) {
        if (defender.type === "player") {
          gameState.playerDeath = true;
        } else if (defender.type === "pestcontrol") {
          gameState.playerWon = true;
        } else {
          gameState.calculateExperienceAndStrength(defender.experienceLootOnKill);
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
      abortMovement();
      updatePlayerPosition(destination);
    },

    movePlayerTo,

    skipPlayerTurn() {
      gameState.allowCreaturesToAct();
      gameState.emit("change");
    },

    allowCreaturesToAct() {
      gameState.map.creatures.forEach((creature) => {
        if (creature.type === "player") {
          return;
        }
        makeCreatureAct(creature, gameState);
      });
    },

    isTilePassable({ x, y }) {
      const tile = gameState.map.get(x, y);
      return tile && tile.type !== "wall" && !getCreatureAt(x, y);
    },
  });

  return gameState;
}

const defaultGameState = makeGameState();

export default defaultGameState;
