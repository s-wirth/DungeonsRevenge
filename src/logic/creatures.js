import Creature from "logic/creatures/Creature";
import hashFromList from "util/hashFromList";
import Player from "logic/Player";
import { default as AI, huntPlayer, wander } from "logic/AI";

const CREATURE_TYPES = [
  Player,
  Creature.props({
    type: "mutantRat",
    typeName: "Mutant Rat",
    experienceLootOnKill: 2.78,
    maxHealth: 2,
    damage: 0.68,
    sightRadius: 8,
    description: `Rats that are abnormally big and agressive, due to the magical waste flushed down
      the sewer.`,
    ai: AI.props({ behaviors: [huntPlayer, wander] }),
  }),
  Creature.props({
    type: "minion",
    typeName: "Minion",
    experienceLootOnKill: 5.52,
    maxHealth: 3.12,
    damage: 2.50,
    sightRadius: 8,
    description: "Footsoldiers from the surface sent to control the denizens of the dungeon.",
    ai: AI.props({ behaviors: [huntPlayer, wander] }),
  }),
  Creature.props({
    type: "pestcontrol",
    typeName: "Pest Control",
    experienceLootOnKill: 100,
    maxHealth: 24.19,
    damage: 8.98,
    sightRadius: 8,
    description: "The Pest Control is a huge man in armor with a morning star.",
    ai: AI.props({ behaviors: [huntPlayer, wander] }),
  }),
];

const CREATURE_TYPES_HASH = hashFromList(CREATURE_TYPES, (stamp) => stamp.fixed.props.type);
export default CREATURE_TYPES_HASH;

export function makeCreatureAct(creature, gameState) {
  creature.ai.act(gameState);
}
