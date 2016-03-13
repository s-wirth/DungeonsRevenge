import Mousetrap from "mousetrap";
import GameState from "GameState";

Mousetrap.bind("up", () => {
  GameState.updatePlayerPosition({
    y: GameState.player.y - 1,
  });
});

Mousetrap.bind("right", () => {
  GameState.updatePlayerPosition({
    x: GameState.player.x + 1,
  });
});

Mousetrap.bind("down", () => {
  GameState.updatePlayerPosition({
    y: GameState.player.y + 1,
  });
});

Mousetrap.bind("left", () => {
  GameState.updatePlayerPosition({
    x: GameState.player.x - 1,
  });
});

Mousetrap.bind(".", () => {
  GameState.skipPlayerTurn();
});
