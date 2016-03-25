import React from "react";
import ReactDOM from "react-dom";
import { mouseTrap } from "react-mousetrap";
import "css/InventoryScreen";
import potionSprite from "assets/sprites/items/potion.png";

function iconForItem(item) {
  if (item.type === "healingPotion") {
    return <img src={ potionSprite } width="16" height="16" />;
  }

  return null;
}

function renderItemList(inventory) {
  if (inventory.length === 0) {
    return (
      <div className="ItemList">
        <div className="ItemList__emptyMessage">Your inventory is empty</div>
      </div>
    );
  }

  return (
    <ul className="ItemList">
      {
        inventory.map((item) => (
          <li className="ItemList__item flex-list flex-list--horizontal flex-list--small-gutters">
            <div className="flex-list__item">
              { iconForItem(item) }
            </div>
            <div className="flex-list__item flex-lsit__item--expand">
              { item.name }
            </div>
          </li>
        ))
      }
    </ul>
  );
}

class InventoryScreen extends React.Component {
  componentDidMount() {
    const { bindShortcut, hideInventoryScreen } = this.props;
    bindShortcut("escape", hideInventoryScreen);
    ReactDOM.findDOMNode(this).focus();
  }

  render() {
    const { inventory } = this.props;

    return (
      <div className="InventoryScreen" tabIndex="0">
        <div className="InventoryScreen__content">
          <h2>Inventory</h2>
          { renderItemList(inventory) }
        </div>
      </div>
    );
  }
}
InventoryScreen.propTypes = {
  bindShortcut: React.PropTypes.func.isRequired,
  hideInventoryScreen: React.PropTypes.func.isRequired,
  inventory: React.PropTypes.array.isRequired,
};

export default mouseTrap(InventoryScreen);
