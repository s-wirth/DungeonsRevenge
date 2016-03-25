import React from "react";
import ReactDOM from "react-dom";
import "css/InventoryScreen";
import potionSprite from "assets/sprites/items/potion.png";
import Mousetrap from "mousetrap";
import classnames from "classnames";

function iconForItem(item) {
  if (item.type === "healingPotion") {
    return <img src={ potionSprite } width="16" height="16" />;
  }

  return null;
}

function renderItemList(inventory, focusIndex) {
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
        inventory.map((item, index) => (
          <li
            key={ item.id }
            className={ classnames(
              "ItemList__item flex-list flex-list--horizontal flex-list--small-gutters",
              {
                "ItemList__item--has-focus": index === focusIndex,
              }
            )}
          >
            <div className="flex-list__item">
              { iconForItem(item) }
            </div>
            <div className="flex-list__item flex-list__item--expand">
              { item.name }
            </div>
          </li>
        ))
      }
    </ul>
  );
}

class InventoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusIndex: 0,
    };
    this.highlightNextItem = this.highlightNextItem.bind(this);
    this.highlightPreviousItem = this.highlightPreviousItem.bind(this);
    this.activateFocusedItem = this.activateFocusedItem.bind(this);
  }

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);
    this.bindControls();
    domNode.focus();
  }

  componentWillUnmount() {
    this.unbindControls();
  }

  bindControls() {
    const { hideInventoryScreen } = this.props;
    const domNode = ReactDOM.findDOMNode(this);
    this.mousetrap = Mousetrap(domNode);
    this.mousetrap.bind(["escape", "i"], hideInventoryScreen);
    this.mousetrap.bind(["down", "j"], this.highlightNextItem);
    this.mousetrap.bind(["up", "k"], this.highlightPreviousItem);
    this.mousetrap.bind(["enter"], this.activateFocusedItem);
  }

  activateFocusedItem() {
    const { activateItem, inventory, hideInventoryScreen } = this.props;
    const { focusIndex } = this.state;
    const focusedItem = inventory[focusIndex];
    activateItem(focusedItem);
    hideInventoryScreen();
  }

  unbindControls() {
    this.mousetrap.reset();
  }

  highlightNextItem() {
    const { inventorySize } = this.props;
    let { focusIndex } = this.state;
    focusIndex += 1;
    if (focusIndex > inventorySize) focusIndex = inventorySize;
    this.setState({
      focusIndex,
    });
  }

  highlightPreviousItem() {
    let { focusIndex } = this.state;
    focusIndex -= 1;
    if (focusIndex < 0) focusIndex = 0;
    this.setState({
      focusIndex,
    });
  }

  render() {
    const { inventory } = this.props;
    const { focusIndex } = this.state;

    return (
      <div className="InventoryScreen" tabIndex="0">
        <div className="InventoryScreen__content">
          <h2>Inventory</h2>
          { renderItemList(inventory, focusIndex) }
        </div>
      </div>
    );
  }
}
InventoryScreen.propTypes = {
  hideInventoryScreen: React.PropTypes.func.isRequired,
  inventory: React.PropTypes.array.isRequired,
  inventorySize: React.PropTypes.number.isRequired,
  activateItem: React.PropTypes.func.isRequired,
};

export default InventoryScreen;
