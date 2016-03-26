let itemIdCounter = 0;

const ITEM_TYPES = {
  healingPotion: {
    type: "healingPotion",
    typeName: "Healing Potion",
    healsOnConsume: 5,
  },
};
export default ITEM_TYPES;

export function makeItem(type, { x, y }) {
  const id = itemIdCounter += 1;
  return Object.assign(Object.create(ITEM_TYPES[type]), {
    id,
    x, y,
  });
}
