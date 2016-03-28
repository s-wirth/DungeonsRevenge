import stampit from "stampit";
import NoThis from "util/stamps/NoThis";
import distanceBetween from "util/distanceBetween";
import findPath from "logic/findPath";

export function wander(ai, { creature, world, actions }) {
  const MAX_ATTEMPTS = 10;
  for (let attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
    const moveBy = [
      { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 },
    ][Math.round(Math.random() * 3)];
    const newPosition = {
      x: creature.x + moveBy.x,
      y: creature.y + moveBy.y,
    };

    if (!world.creatureAt(newPosition)) {
      actions.updatePosition(newPosition);
      return;
    }
  }
}

export function huntPlayer(ai, { creature, world, actions }) {
  if (world.canSeePlayer()) {
    ai.lastSeenPlayerPosition = world.playerPosition();
  }

  const lastSeenPlayerPosition = ai.lastSeenPlayerPosition;
  if (!lastSeenPlayerPosition) return;

  const path = findPath(creature, lastSeenPlayerPosition, world.isTilePassable);
  if (path.length > 1) {
    const firstStepFromOrigin = path[path.length - 2];
    actions.updatePosition(firstStepFromOrigin);
  } else {
    ai.lastSeenPlayerPosition = null;
  }
}

const AI = stampit.compose(NoThis, stampit({
  methods: {
    act(instance, gameState) {
      const { creature, behaviors } = instance;
      const { player } = gameState;

      let completedTurn = false;
      const availableActions = {
        updatePosition(position) {
          if (completedTurn) return;
          completedTurn = true; // The turn is over even if the move fails
          gameState.updateCreaturePosition(creature, position);
        },
      };

      const observableWorld = {
        canSeePlayer() {
          // We ignore obstacles between the creature and the player
          return distanceBetween(creature, player) < creature.sightRadius;
        },

        isTilePassable: gameState.isTilePassable,

        playerPosition() {
          if (!observableWorld.canSeePlayer()) return null;
          return { x: player.x, y: player.y };
        },

        creatureAt(position) {
          return gameState.map.getCreatureAt(position);
        },
      };

      completedTurn = false;
      for (let i = 0; i < behaviors.length; i++) {
        const behavior = behaviors[i];
        if (completedTurn) return;
        behavior(instance, { creature, world: observableWorld, actions: availableActions });
      }
    },
  },
}));

export default AI;
