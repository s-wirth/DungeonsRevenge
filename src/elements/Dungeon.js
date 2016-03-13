import React from "react";
import classnames from "classnames";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

const DungeonMapRegion = React.createClass({
  shouldComponentUpdate(nextProps) {
    return !this.props.sightMap.equals(nextProps.sightMap);
  },

  render() {
    let {
      map, sightMap, remembered,
      leftBoundary, rightBoundary,
      topBoundary, bottomBoundary,
     } = this.props;

    if (!map) return null;

    function renderTiles() {
      let result = [];

      for (let x = leftBoundary; x < rightBoundary; x++) {
        for (let y = topBoundary; y < bottomBoundary; y++) {
          let mapTile = map.get(x, y);
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
        <div
          style={{
            position: "absolute",
            left: leftBoundary * TILE_WIDTH, top: topBoundary * TILE_WIDTH,
            width: (rightBoundary - leftBoundary) * TILE_WIDTH, height: (bottomBoundary - topBoundary) * TILE_WIDTH,
            border: "1px solid red",
          }}
        />
      </div>
    );
  },
});

const SubdividedDungeonMap = React.createClass({
  render() {
    let { map, sightMap, remembered, divisions } = this.props;
    let result = [];
    let width = map.shape[0];
    let height = map.shape[1];

    for (let x = 0; x < divisions; x++ ) {
      for (let y = 0; y < divisions; y++ ) {
        let leftBoundary = Math.round(width / divisions * x);
        let rightBoundary = Math.round(width / divisions * (x + 1));
        let topBoundary = Math.round(height / divisions * y);
        let bottomBoundary = Math.round(height / divisions * (y + 1));

        result.push(
          <DungeonMapRegion
            {...{ map, sightMap, remembered, leftBoundary, rightBoundary, topBoundary, bottomBoundary }}
          />
        );
      }
    }

    return (
      <div>
        { result }
      </div>
    );
  },
});

const Dungeon = React.createClass({
  shouldComponentUpdate(nextProps) {
    return nextProps.map !== this.props.map || nextProps.sightMap !== this.props.sightMap;
  },

  render() {
    let { map, sightMap, memorisedSightMap } = this.props;
    let width = map.shape[0];
    let height = map.shape[1];

    return (
      <div>
        <SubdividedDungeonMap map={map} sightMap={memorisedSightMap} remembered divisions={6} />

        <DungeonMapRegion
          map={ map } sightMap={ sightMap }
          leftBoundary={0} rightBoundary={width}
          topBoundary={0} bottomBoundary={height}
        />
      </div>
    );
  },
});

export default Dungeon;
