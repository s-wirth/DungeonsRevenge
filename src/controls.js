import Mousetrap from "mousetrap";
import GameState from "GameState";
import { updatePlayerPosition } from "GameState";

Mousetrap.bind("up", () => {
  updatePlayerPosition({
    y: GameState.playerPosition.y + 1,
  });
});

Mousetrap.bind("right", () => {
  updatePlayerPosition({
    x: GameState.playerPosition.x + 1,
  });
});

Mousetrap.bind("down", () => {
  updatePlayerPosition({
    y: GameState.playerPosition.y - 1,
  });
});

Mousetrap.bind("left", () => {
  updatePlayerPosition({
    x: GameState.playerPosition.x - 1,
  });
});
