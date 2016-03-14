import EventEmitter from "eventemitter2";
import _ from "lodash";
import ROT from "rot-js";
import {
  makeSightMap
} from "logic/SightMap";
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


export function makeGameState() {
  let gameState = new EventEmitter();

  gameState.introScreenShown = false;
  gameState.playerDeath = false;

  gameState.playerWon = false;

  gameState.map = makeMap();
  gameState.player = makePlayer(gameState.map.initialPlayerPosition.x, gameState.map.initialPlayerPosition.y);

  gameState.map.creatures.push(gameState.player);

  function updatePlayerSightMap() {
    let map = gameState.map;
    let player = gameState.player;
    map.sightMap = calculateSightMap(player);

    if (!map.memorisedSightMap) {
      map.memorisedSightMap = makeSightMap(map.width, map.height);
    }

    map.memorisedSightMap = map.memorisedSightMap.combine(map.sightMap);
  }

  updatePlayerSightMap();

  function calculateSightMap(creature) {
    let map = gameState.map;

    var lightPasses = function (x, y) {
      if (creature.x === x && creature.y === y) {
        return true;
      }
      let tile = gameState.map.get(x, y);
      let opaqueTiles = ['wall', 'door'];
      /*returns true if tile.type is not in opaqueTiles list*/
      return !tile || opaqueTiles.indexOf(tile.type) === -1;
    };

    var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
    let sightMap = makeSightMap(map.width, map.height);

    fov.compute(creature.x, creature.y, creature.sightRadius, function (x, y, r, visibility) {
      if (visibility > 0) {
        sightMap.setVisible(x, y);
      }
    });

    return sightMap;
  }

  function getCreatureAt(x, y) {
    let creatures = gameState.map.creatures;
    for (let i = 0; i < creatures.length; i++) {
      let creature = creatures[i];
      if (creature.x === x && creature.y === y) return creatures[i];
    }
  }

  function itemAtPosition(x, y) {
    let potions = gameState.map.potions;
    for (let i = 0; i < potions.length; i++) {
      let potion = potions[i];
      if (potion.x === x && potion.y === y) return potions[i];
    }
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
        let itemAtDestinedPlayerPosition = itemAtPosition(x, y);
        if (itemAtDestinedPlayerPosition && (gameState.player.health != gameState.player.maxHealth)) {
          gameState.player.health += itemAtDestinedPlayerPosition.healsOnConsume;
          if (gameState.player.health > gameState.player.maxHealth) gameState.player.health = gameState.player.maxHealth;
          gameState.map.potions.splice(gameState.map.potions.indexOf(itemAtDestinedPlayerPosition), 1);
        }
      }

      let creatureAtDestination = getCreatureAt(destination.x, destination.y);
      if (creatureAtDestination) {
        gameState.makeCreatureAttack(creature, creatureAtDestination);
        return;
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
      let attackerActualDamage = attacker.baseDamage + attacker.strength;
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
      gameState.updateCreaturePosition(gameState.player, destination);
      gameState.allowCreaturesToAct();
      updatePlayerSightMap();
      gameState.emit("change");
    },

    skipPlayerTurn() {
      gameState.allowCreaturesToAct();
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

    isTilePassable(x, y) {
      let tile = gameState.map.get(x, y);
      return tile && tile.type !== 'wall' && !getCreatureAt(x, y);
    }
  });

  return gameState;
}

const defaultGameState = makeGameState();

export default defaultGameState;
