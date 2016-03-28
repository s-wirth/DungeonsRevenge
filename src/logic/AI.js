import stampit from "stampit";
import NoThis from "util/stamps/NoThis";
import distanceBetween from "util/distanceBetween";
import findPath from "logic/findPath";

export function wander(ai, { creature, actions }) {
  const moveBy = [
    { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 },
  ][Math.round(Math.random() * 3)];
  actions.updatePosition({
    x: creature.x + moveBy.x,
    y: creature.y + moveBy.y,
  });
}

export function huntPlayer(ai, { creature, world, actions }) {
  if (!world.canSeePlayer()) return;

  const path = findPath(creature, world.playerPosition(), world.isTilePassable);
  if (path.length > 0) {
    const firstStepFromOrigin = path[path.length - 2];
    actions.updatePosition(firstStepFromOrigin);
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
