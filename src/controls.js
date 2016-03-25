import Mousetrap from "mousetrap";
import GameState from "GameState";

Mousetrap.bind("up", (event) => {
  event.preventDefault();
  GameState.updatePlayerPosition({
    y: GameState.player.y - 1,
  });
});

Mousetrap.bind("right", (event) => {
  event.preventDefault();
  GameState.updatePlayerPosition({
    x: GameState.player.x + 1,
  });
});

Mousetrap.bind("down", (event) => {
  event.preventDefault();
  GameState.updatePlayerPosition({
    y: GameState.player.y + 1,
  });
});

Mousetrap.bind("left", (event) => {
  event.preventDefault();
  GameState.updatePlayerPosition({
    x: GameState.player.x - 1,
  });
});

Mousetrap.bind(".", (event) => {
  event.preventDefault();
  GameState.skipPlayerTurn();
});

Mousetrap.bind("i", (event) => {
  event.preventDefault();
  GameState.showInventoryScreen();
});
