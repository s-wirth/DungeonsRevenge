/* eslint-disable */
import { makeGameState } from "GameState";

// TODO: move to a central test support location
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10;

describe("GameState", () => {
  let gameState;

  beforeEach(() => {
    gameState = makeGameState();
  });

  it("should initially set the player's position to a passable tile", () => {
    let player = gameState.player;
    expect(gameState.map.tiles.get(player.x, player.y).type).not.toEqual("wall");
  });

  describe(".updatePlayerPosition()", () => {

    it("should change the player's position", () => {
      let destination = { x: 1, y: 2 };
      gameState.map.tiles.set(destination.x, destination.y, { type: "floor" });
      gameState.updatePlayerPosition(destination);
      expect(gameState.player).toEqual(destination);
    });

    it("should emit a 'change' event", (done) => {
      gameState.on('change', done);
      let destination = { x: 1, y: 2 };
      gameState.map.tiles.set(destination.x, destination.y, { type: "floor" });
      gameState.updatePlayerPosition(destination);
    });

    describe("when the destination tile is a wall tile", () => {
      let origin;
      let destination;

      beforeEach(() => {
        origin = { x: gameState.player.x, y: gameState.player.y };
        destination = { x: origin.x, y: origin.y + 1 };
        gameState.map.tiles.set(
          destination.x, destination.y, { type: "wall" }
        );
      });

      it("should not change the player's position", () => {
        gameState.updatePlayerPosition(destination);
        expect(gameState.player).toEqual(jasmine.objectContaining(origin));
      });
    });
  });

});
