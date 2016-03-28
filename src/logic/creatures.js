import stampit from "stampit";
import findPath from "logic/findPath";
import hashFromList from "util/hashFromList";

let creatureIdCounter = 0;
const MAX_INVENTORY_SIZE = 9;


const CREATURE_TYPES = [
  stampit({
    props: {
      type: "player",
      damage: 3,
      maxHealth: 0,
      sightRadius: 5,
      experience: 0,
    },
  }),
  stampit({
    props: {
      type: "mutantRat",
      typeName: "Mutant Rat",
      experienceLootOnKill: 2.78,
      maxHealth: 2,
      damage: 0.68,
      sightRadius: 8,
      description: `Rats that are abnormally big and agressive, due to the magical waste flushed
        down the sewer.`,
    },
  }),
  stampit({
    props: {
      type: "minion",
      typeName: "Minion",
      experienceLootOnKill: 5.52,
      maxHealth: 3.12,
      damage: 2.50,
      sightRadius: 8,
      description: "Footsoldiers from the surface sent to control the denizens of the dungeon.",
    },
  }),
  stampit({
    props: {
      type: "pestcontrol",
      typeName: "Pest Control",
      experienceLootOnKill: 100,
      maxHealth: 24.19,
      damage: 8.98,
      sightRadius: 8,
      description: "The Pest Control is a huge man in armor with a morning star.",
    },
  }),
];

const CREATURE_TYPES_HASH = hashFromList(CREATURE_TYPES, (stamp) => stamp.fixed.props.type);

export function makeCreature(type, { x, y }) {
  const id = creatureIdCounter += 1;
  const creatureType = CREATURE_TYPES_HASH[type];

  const creature = creatureType({
    id,
    type,
    x, y,
    health: creatureType.fixed.props.maxHealth,
    inventory: [],
    inventorySize: MAX_INVENTORY_SIZE,
  });

  function increaseHealth(amount) {
    creature.health += amount;
    if (creature.health > creature.maxHealth) {
      creature.health = creature.maxHealth;
    }
  }

  function removeFromInventory(item) {
    creature.inventory.splice(creature.inventory.indexOf(item), 1);
  }

  function addToInventory(item) {
    creature.inventory.push(item);
  }

  Object.assign(creature, {
    increaseHealth,
    removeFromInventory,
    addToInventory,
  });

  return creature;
}

function distanceBetween({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function makeCreatureAct(creature, gameState) {
  function canSeePlayer() {
    // We ignore obstacles between us and the player
    return distanceBetween(creature, gameState.player) < creature.sightRadius;
  }

  function moveRandomly() {
    const moveBy = [
      { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 },
    ][Math.round(Math.random() * 3)];
    gameState.updateCreaturePosition(creature, {
      x: creature.x + moveBy.x,
      y: creature.y + moveBy.y,
    });
  }

  function moveTowardsPlayer() {
    const player = gameState.player;
    const path = findPath(creature, player, gameState.isTilePassable);
    if (path.length > 0) {
      const firstStepFromOrigin = path[path.length - 2];
      gameState.updateCreaturePosition(creature, firstStepFromOrigin);
    } else {
      moveRandomly();
    }
  }

  if (canSeePlayer()) {
    moveTowardsPlayer();
  } else {
    moveRandomly();
  }
}
