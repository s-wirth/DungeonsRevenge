let itemIdCounter = 0;

export function makeHealingPotion(x, y) {
  const id = itemIdCounter += 1;
  return {
    id,
    type: "healingPotion",
    name: "Healing Potion",
    x, y,
    healsOnConsume: 15,
  };
}
