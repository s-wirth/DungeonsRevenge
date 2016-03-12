import React from 'react';

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

const Dungeon = React.createClass({
  shouldComponentUpdate(nextProps) {
    return nextProps.map !== this.props.map || nextProps.sightMap !== this.props.sightMap;
  },

  render() {
    let { map, sightMap, memorisedSightMap } = this.props;

    function renderTiles() {
      if (!map) return null;

      let width = map.shape[0];
      let height = map.shape[1];
      let result = [];

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let mapTile = map.get(x, y);
          if (mapTile) {
            if (sightMap.includes(x, y)) {
              result.push(
                <div className={ `${mapTile.type}-tile` } key={`${x}-${y}`}
                     style={{ left: x * TILE_WIDTH, top: y * TILE_WIDTH }}/>
              );
            } else if (memorisedSightMap.includes(x, y)) {
              result.push(
                <div className={ `${mapTile.type}-tile fog-of-war` } key={`${x}-${y}`}
                     style={{ left: x * TILE_WIDTH, top: y * TILE_WIDTH }}/>
              );
            }
          }
        }
      }

      return result;
    }

    return <div>{ renderTiles() }</div>;
  },
});

export default Dungeon;