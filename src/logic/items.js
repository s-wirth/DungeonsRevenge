let itemIdCounter = 0;

export function makeHealingPotion(x, y) {
  let id = itemIdCounter += 1;
  return {
    id,
    type: "healingPotion",
    x, y,
    healsOnConsume: 15,
  };
}