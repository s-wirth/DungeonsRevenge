import React from "react";
import Dungeon from "elements/Dungeon";
import "css/InGameScreen";
import Tween from "gsap";
import InfoBar from "elements/InGameScreen/InfoBar";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

function HealthBar({ health, maxHealth }) {
  const width = health * 100 / maxHealth;
  return (
    <div className="health">
      <div className="health__remaining" style={{ width: `${width}%` }} />
    </div>
  );
}
HealthBar.propTypes = {
  health: React.PropTypes.number.isRequired,
  maxHealth: React.PropTypes.number.isRequired,
};

function Creature({ creature, onClick, showHealthBar }) {
  function onClickHandler() {
    onClick(creature);
  }

  return (
    <div
      className={ `creature ${creature.type}-creature` }
      style={{ left: creature.x * TILE_WIDTH, top: creature.y * TILE_WIDTH }}
      onClick={ onClickHandler }
    >
      {
        showHealthBar ?
        <HealthBar health={ creature.health } maxHealth={ creature.maxHealth } /> :
        null
      }
    </div>
  );
}
Creature.propTypes = {
  creature: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func.isRequired,
  showHealthBar: React.PropTypes.bool,
};

function renderCreatures(creatures, sightMap, movePlayerTo) {
  if (!creatures) return null;

  return creatures.map((creature) => {
    if (creature.type !== "player" && sightMap.includes(creature.x, creature.y)) {
      return (
        <Creature
          key={`creature-${creature.id}`}
          creature={ creature }
          onClick={ movePlayerTo }
          showHealthBar
        />
      );
    }
    return null;
  });
}

function renderPlayer(player, level, sightMap, skipTurn) {
  return (
    <Creature
      key={ `player-${level}` }
      creature={ player }
      onClick={ skipTurn }
    />
  );
}

function renderItems(items, sightMap) {
  if (!items) return null;
  return items.map((item) => {
    if (sightMap.includes(item.x, item.y)) {
      return (
        <div
          className={ item.type }
          key={`${item.id}`}
          style={{ left: item.x * TILE_WIDTH, top: item.y * TILE_WIDTH }}
        >
        </div>
      );
    }
    return null;
  });
}

class InGameScreen extends React.Component {
  componentDidMount() {
    this.scrollPlayerIntoView({ animate: false });
  }

  componentDidUpdate() {
    this.scrollPlayerIntoView();
  }

  scrollPlayerIntoView({ animate } = { animate: true }) {
    const { player } = this.props;
    const container = this.refs.scrollableContainer;
    const playerLeftOffset = player.x * TILE_WIDTH;
    const playerTopOffset = player.y * TILE_WIDTH;
    setTimeout(() => {
      let scrollTop = playerTopOffset - (container.clientHeight / 2);
      const scrollTopMax = container.scrollHeight - container.clientHeight;
      if (scrollTop < 0) scrollTop = 0;
      if (scrollTop > scrollTopMax) scrollTop = scrollTopMax;

      let scrollLeft = playerLeftOffset - (container.clientWidth / 2);
      const scrollLeftMax = container.scrollWidth - container.clientWidth;
      if (scrollLeft < 0) scrollLeft = 0;
      if (scrollLeft > scrollLeftMax) scrollLeft = scrollLeftMax;

      if (animate) {
        Tween.to(container, 1.0, { scrollTop, scrollLeft });
      } else {
        container.scrollTop = scrollTop;
        container.scrollLeft = scrollLeft;
      }
    }, 100);
  }

  render() {
    const {
      creatures, sightMap, memorisedSightMap, items, map, player, movePlayerTo, skipTurn,
    } = this.props;
    return (
      <div className="InGameScreen">
        <div className="InGameScreen__Dungeon" ref="scrollableContainer">
          <Dungeon {...{ map, sightMap, memorisedSightMap, movePlayerTo }} />
          { renderItems(items, sightMap) }
          { renderPlayer(player, map.id, sightMap, skipTurn) }
          { renderCreatures(creatures, sightMap, movePlayerTo) }
        </div>
        <InfoBar className="InGameScreen__InfoBar" {...{ map, player }} />
      </div>
    );
  }
}

InGameScreen.propTypes = {
  creatures: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  sightMap: React.PropTypes.object.isRequired,
  memorisedSightMap: React.PropTypes.object.isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  map: React.PropTypes.object.isRequired,
  player: React.PropTypes.object.isRequired,
  movePlayerTo: React.PropTypes.func.isRequired,
  skipTurn: React.PropTypes.func.isRequired,
};

export default InGameScreen;
