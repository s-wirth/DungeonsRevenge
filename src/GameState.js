import EventEmitter from "eventemitter2";
import _ from "lodash";
import ROT from "rot-js";
import {
  makeSightMap,
} from "logic/SightMap";
import {
  makeCreatureAct,
} from "logic/creatures";
import { makePlayer } from "logic/Player";
import {
  enterNextLevel,
  enterPreviousLevel,
} from "logic/levels";
import findPath from "logic/findPath";
import Immutable from "immutable";

const LOG_MESSAGE_DELAY = 2000;

function makeLog() {
  let messages = Immutable.List();
  let messageId = 0;

  const log = {
    getMessages() {
      return messages;
    },
    addMessage({ type, description }) {
      messageId += 1;
      const message = Immutable.fromJS({ id: messageId, type, description });
      messages = messages.push(message);
      return message;
    },
    removeMessage(message) {
      messages = messages.filter((m) => m.get("id") !== message.get("id"));
    },
  };

  return log;
}

function isPlayer(creature) {
  return creature.type === "player";
}

export function makeGameState() {
  const gameState = new EventEmitter();

  function logMessage({ type, description }) {
    const message = gameState.log.addMessage({ type, description });
    setTimeout(() => {
      gameState.log.removeMessage(message);
      gameState.emit("change");
    }, LOG_MESSAGE_DELAY);
    gameState.emit("change");
  }

  function calculateSightMap(creature) {
    const map = gameState.map;

    function lightPasses(x, y) {
      if (creature.x === x && creature.y === y) {
        return true;
      }
      const tile = map.tiles.get(x, y);
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

  function itemAtPosition(x, y) {
    const items = gameState.map.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.x === x && item.y === y) return items[i];
      }
    }
    return null;
  }

  function updatePlayerPosition(destination) {
    gameState.updateCreaturePosition(gameState.player, destination);
    updatePlayerSightMap();
    gameState.allowCreaturesToAct();

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
      const map = gameState.map;

      abortMovement();
      if (haveReachedDestination || !canReachDestination) return;

      const firstStepFromOrigin = path[path.length - 2];
      const creatureAtDestination = map.getCreatureAt(firstStepFromOrigin);
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

  function addItemToInventory(item, creature) {
    if (creature.inventory.length === creature.inventorySize) {
      if (isPlayer(creature)) {
        logMessage({ type: "danger", description: `You can't carry the ${item.name}` });
      }
      return;
    }

    if (isPlayer(creature)) {
      logMessage({ type: "success", description: `You picked up the ${item.name}` });
    }
    const items = gameState.map.items;
    creature.addToInventory(item);
    items.splice(items.indexOf(item), 1);
  }

  function activateItem(item, activatingCreature) {
    item.activate(activatingCreature);
    gameState.emit("change");
  }

  function dropItem(item, creature) {
    creature.removeFromInventory(item);
    item.x = creature.x;
    item.y = creature.y;
    gameState.map.items.push(item);
    gameState.emit("change");
  }

  Object.assign(gameState, {
    updateCreaturePosition(creature, destination) {
      const { x, y } = _.defaults(destination, creature);
      const tileAtDestination = gameState.map.tiles.get(x, y);

      if (tileAtDestination && tileAtDestination.type === "wall") return;

      const creatureAtDestination = gameState.map.getCreatureAt(destination);
      if (creatureAtDestination) {
        gameState.makeCreatureAttack(creature, creatureAtDestination);
        return;
      }

      if (creature.type === "player") {
        if (tileAtDestination && tileAtDestination.type === "stairsUp") {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(creature), 1);
          gameState.map = enterNextLevel(gameState.map);
          creature.x = gameState.map.stairsDownPosition.x;
          creature.y = gameState.map.stairsDownPosition.y;
          gameState.map.creatures.push(gameState.player);
          return;
        }
        if (tileAtDestination && tileAtDestination.type === "stairsDown") {
          gameState.map.creatures.splice(gameState.map.creatures.indexOf(creature), 1);
          gameState.map = enterPreviousLevel(gameState.map);
          creature.x = gameState.map.stairsUpPosition.x;
          creature.y = gameState.map.stairsUpPosition.y;
          gameState.map.creatures.push(gameState.player);
          return;
        }
        const itemAtDestination = itemAtPosition(x, y);
        const player = gameState.player;
        if (itemAtDestination) {
          addItemToInventory(itemAtDestination, player);
        }
      }

      creature.x = x;
      creature.y = y;
    },

    makeCreatureAttack(attacker, defender) {
      const attackerActualDamage = attacker.damage;

      defender.health -= attackerActualDamage;

      if (defender.health <= 0) {
        if (defender.type === "player") {
          logMessage({ type: "danger", description: `You were killed by a ${attacker.typeName}` });
          gameState.visibleScreen = "death";
        } else if (defender.type === "pestcontrol") {
          logMessage({ type: "success", description: "Congratulations, you win!" });
          gameState.visibleScreen = "win";
        } else if (isPlayer(attacker)) {
          logMessage({ type: "success", description: `You killed the ${defender.typeName}` });
          gameState.player.gainExperience(defender.experienceLootOnKill);
        }
        gameState.map.creatures.splice(gameState.map.creatures.indexOf(defender), 1);
      } else {
        if (defender.type === "player") {
          logMessage({ type: "danger", description: `The ${attacker.typeName} hit you!` });
        } else if (attacker.type === "player") {
          logMessage({ type: "danger", description: `You hit the ${defender.typeName}` });
        }
      }
      gameState.emit("change");
    },

    switchFromIntroToDungeon() {
      gameState.visibleScreen = "inGame";
      logMessage({ description: "Welcome to Dungeon's Revenge" });
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
      const map = gameState.map;
      const tile = map.tiles.get(x, y);
      return tile && tile.type !== "wall" && !map.getCreatureAt({ x, y });
    },

    showInventoryScreen() {
      gameState.visibleScreen = "inventory";
      gameState.emit("change");
    },

    hideInventoryScreen() {
      gameState.visibleScreen = "inGame";
      gameState.emit("change");
    },

    activateItem,
    dropItem,
  });

  function init() {
    gameState.log = makeLog();
    gameState.visibleScreen = "intro";

    gameState.map = enterNextLevel();
    gameState.player = makePlayer(
      gameState.map.initialPlayerPosition.x,
      gameState.map.initialPlayerPosition.y
    );

    gameState.map.creatures.push(gameState.player);

    updatePlayerSightMap();
  }

  init();
  return gameState;
}

const defaultGameState = makeGameState();

export default defaultGameState;
