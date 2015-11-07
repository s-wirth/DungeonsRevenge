// import css from "main.css";
/* eslint no-console:0 */
import Mousetrap from "mousetrap";

let playerPosition = {
  x: 0,
  y: 0,
};

Mousetrap.bind("up", () => {
  playerPosition.y += 1;
  console.log("playerPosition =", playerPosition);
});

Mousetrap.bind("right", () => {
  playerPosition.x += 1;
  console.log("playerPosition =", playerPosition);
});

Mousetrap.bind("down", () => {
  playerPosition.y -= 1;
  console.log("playerPosition =", playerPosition);
});

Mousetrap.bind("left", () => {
  playerPosition.x -= 1;
  console.log("playerPosition =", playerPosition);
});
