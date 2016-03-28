import Item from "logic/items/Item";
import hashFromList from "util/hashFromList";

function restoreFullHealth(item, activatingCreature) {
  activatingCreature.increaseHealth(activatingCreature.maxHealth);
}

function consumeItem(item, activatingCreature) {
  activatingCreature.removeFromInventory(item);
}

const ITEM_TYPES = [
  Item.props({
    type: "healingPotion",
    name: "healing potion",
    effects: [restoreFullHealth, consumeItem],
  }),
];

const ITEM_TYPES_HASH = hashFromList(ITEM_TYPES, (stamp) => stamp.fixed.props.type);
export default ITEM_TYPES_HASH;
