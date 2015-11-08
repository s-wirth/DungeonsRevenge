/* eslint-disable */
import GameState from "GameState";
import { updatePlayerPosition } from "GameState";

// TODO: move to a central test support location
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10;

describe("GameState", function() {

  it("should initially set the player's position to (0, 0)", function() {
    expect(GameState.playerPosition).toEqual({ x: 0, y: 0 });
  });

  describe(".updatePlayerPosition()", function() {

    it("should change the player's position", function() {
      updatePlayerPosition({ x: 123, y: 456 });
      expect(GameState.playerPosition).toEqual({ x: 123, y: 456 });
    });

    it("should emit a 'change' event", function(done) {
      GameState.on('change', done);
      updatePlayerPosition();
    });

  });

});
