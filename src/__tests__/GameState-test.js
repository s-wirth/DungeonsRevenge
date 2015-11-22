/* eslint-disable */
import { makeGameState } from "GameState";

// TODO: move to a central test support location
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10;

describe("GameState", function() {
  beforeEach(function() {
    this.gameState = makeGameState();
  });

  it("should initially set the player's position to (0, 0)", function() {
    expect(this.gameState.playerPosition).toEqual({ x: 0, y: 0 });
  });

  describe(".updatePlayerPosition()", function() {

    it("should change the player's position", function() {
      this.gameState.updatePlayerPosition({ x: 123, y: 456 });
      expect(this.gameState.playerPosition).toEqual({ x: 123, y: 456 });
    });

    it("should emit a 'change' event", function(done) {
      this.gameState.on('change', done);
      this.gameState.updatePlayerPosition();
    });

    describe("when the destination tile is a wall tile", function() {
      it("should not change the player's position", function() {

      });

      it("should not emit a change event");
    });
  });

});
