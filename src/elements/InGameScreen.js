import React from "react";
import Dungeon from "elements/Dungeon";
import "css/InGameScreen";
import Tween from "gsap";

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

function renderHealingPotions(potions, sightMap) {
  if (!potions) return null;
  return potions.map((potion) => {
    if (sightMap.includes(potion.x, potion.y)) {
      return (
        <div
          className="healingPotion"
          key={`${potion.id}`}
          style={{ left: potion.x * TILE_WIDTH, top: potion.y * TILE_WIDTH }}
        >
        </div>
      );
    }
    return null;
  });
}

function renderPlayerStats(map, player) {
  return (
    <div>
      Current Level: { map.id + 1 }
      <div className="playerHealth">
        <div
          className="playerHealth__remaining"
          style={{ width: `${player.health * 100 / player.maxHealth}%` }}
        />
      </div>
      Health: { player.health }
      <br />
      <div className="experienceNeeded">
        <div
          className="playerExperience"
          style={{ width: `${player.experience * 100 / player.experienceNeeded}%` }}
        />
      </div>
        Experience: { player.experience } / { player.experienceNeeded }
      <br />
        Strength: { player.strength }
    </div>
  );
}

function renderInstructions() {
  return (
    <div>
      <div className="movement">
        Move Up: ↑
        <br />
        Move Down: ↓
        <br />
        Move Right: →
        <br />
        Move Left: ←
        <br />
      </div>
      <div className="other">
        Skip Turn: .
        <br />
        Heal: walk on Potion
        <br />
        Kill Enemy: on contact
      </div>
    </div>
  );
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
      creatures, sightMap, memorisedSightMap, potions, map, player, movePlayerTo, skipTurn,
    } = this.props;
    return (
      <div className="gameContainer">
        <div className="scene" ref="scrollableContainer">
          <Dungeon {...{ map, sightMap, memorisedSightMap, movePlayerTo }} />
          { renderHealingPotions(potions, sightMap) }
          { renderPlayer(player, map.id, sightMap, skipTurn) }
          { renderCreatures(creatures, sightMap, movePlayerTo) }
        </div>
        <div className="infoBar">
          <div className="stats">
            { renderPlayerStats(map, player) }
          </div>
          <div className="eventLog">
          </div>
          <div className="items">
            { renderInstructions() }
          </div>
        </div>
      </div>
    );
  }
}

InGameScreen.propTypes = {
  creatures: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  sightMap: React.PropTypes.object.isRequired,
  memorisedSightMap: React.PropTypes.object.isRequired,
  potions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  map: React.PropTypes.object.isRequired,
  player: React.PropTypes.object.isRequired,
  movePlayerTo: React.PropTypes.func.isRequired,
  skipTurn: React.PropTypes.func.isRequired,
};

export default InGameScreen;
