import Mousetrap from "mousetrap";
import GameState from "GameState";

Mousetrap.bind("up", () => {
  GameState.updatePlayerPosition({
    y: GameState.playerPosition.y - 1,
  });
});

Mousetrap.bind("right", () => {
  GameState.updatePlayerPosition({
    x: GameState.playerPosition.x + 1,
  });
});

Mousetrap.bind("down", () => {
  GameState.updatePlayerPosition({
    y: GameState.playerPosition.y + 1,
  });
});

Mousetrap.bind("left", () => {
  GameState.updatePlayerPosition({
    x: GameState.playerPosition.x - 1,
  });
});
