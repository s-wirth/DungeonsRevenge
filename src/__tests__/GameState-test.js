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
      this.gameState.updatePlayerPosition({});
    });

    describe("when the destination tile is a wall tile", function() {
      beforeEach(function() {
        this.origin = { x: 1, y: 1 };
        this.destination = { x: 1, y: 2 };
        this.gameState.playerPosition.x = this.origin.x;
        this.gameState.playerPosition.y = this.origin.y;
        this.gameState.map.set(
          this.destination.x, this.destination.y, { type: "wall" }
        );
      });

      it("should not change the player's position", function() {
        this.gameState.updatePlayerPosition(this.destination);
        expect(this.gameState.playerPosition).toEqual(this.origin);
      });

      it("should not emit a change event", function() {
        spyOn(this.gameState, 'emit');
        this.gameState.updatePlayerPosition(this.destination);
        expect(this.gameState.emit).not.toHaveBeenCalled();
      });
    });
  });

});
