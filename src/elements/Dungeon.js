import React from "react";
import classnames from "classnames";
import Immutable from "immutable";

/* eslint react/no-multi-comp:0 */

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

class DungeonMapRegion extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { sightMap, leftBoundary, topBoundary } = this.props;
    const sightMapDivision = sightMap.getDivision(leftBoundary, topBoundary);

    const {
      sightMap: nextSightMap, leftBoundary: nextLeftBoundary, topBoundary: nextTopBoundary,
    } = nextProps;
    const nextSightMapDivision = nextSightMap.getDivision(nextLeftBoundary, nextTopBoundary);

    return !Immutable.is(sightMapDivision, nextSightMapDivision);
  }

  render() {
    const {
      map, sightMap, remembered,
      leftBoundary, rightBoundary,
      topBoundary, bottomBoundary,
     } = this.props;

    if (!map) return null;

    function renderTiles() {
      const result = [];

      for (let x = leftBoundary; x < rightBoundary; x++) {
        for (let y = topBoundary; y < bottomBoundary; y++) {
          const mapTile = map.get(x, y);
          if (mapTile && sightMap.includes(x, y)) {
            result.push(
              <div
                className={ classnames(`${mapTile.type}-tile`, {
                  "fog-of-war": remembered,
                }) }
                key={`${x}-${y}`}
                style={{ left: x * TILE_WIDTH, top: y * TILE_WIDTH }}
              />
            );
          }
        }
      }

      return result;
    }

    return (
      <div>
        { renderTiles() }
      </div>
    );
  }
}
DungeonMapRegion.propTypes = {
  sightMap: React.PropTypes.object.isRequired,
  leftBoundary: React.PropTypes.number.isRequired,
  rightBoundary: React.PropTypes.number.isRequired,
  topBoundary: React.PropTypes.number.isRequired,
  bottomBoundary: React.PropTypes.number.isRequired,
  map: React.PropTypes.object.isRequired,
  remembered: React.PropTypes.bool.isRequired,
};

function SubdividedDungeonMap({ map, sightMap, remembered }) {
  const divisions = sightMap.divisions;
  const result = [];
  const width = map.shape[0];
  const height = map.shape[1];

  for (let x = 0; x < divisions; x++) {
    for (let y = 0; y < divisions; y++) {
      const leftBoundary = Math.round(width / divisions * x);
      const rightBoundary = Math.round(width / divisions * (x + 1));
      const topBoundary = Math.round(height / divisions * y);
      const bottomBoundary = Math.round(height / divisions * (y + 1));

      result.push(
        <DungeonMapRegion key={ `${x}-${y}-division` }
          {...{
            map, sightMap, remembered, leftBoundary, rightBoundary, topBoundary, bottomBoundary,
          }}
        />
      );
    }
  }

  return (
    <div>
      { result }
    </div>
  );
}
SubdividedDungeonMap.propTypes = {
  map: React.PropTypes.object.isRequired,
  sightMap: React.PropTypes.object.isRequired,
  remembered: React.PropTypes.bool.isRequired,
};

class Dungeon extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.map !== this.props.map || nextProps.sightMap !== this.props.sightMap;
  }

  render() {
    const { map, sightMap, memorisedSightMap } = this.props;

    return (
      <div>
        <SubdividedDungeonMap map={map} sightMap={memorisedSightMap} remembered />
        <SubdividedDungeonMap map={map} sightMap={sightMap} />
      </div>
    );
  }
}
Dungeon.propTypes = {
  map: React.PropTypes.object.isRequired,
  sightMap: React.PropTypes.object.isRequired,
  memorisedSightMap: React.PropTypes.object.isRequired,
  remembered: React.PropTypes.bool.isRequired,
};

export default Dungeon;
