import ROT from "rot-js";
import Map from "logic/Map";
import {
  makeItem,
} from "logic/items";
import {
  makeCreature,
} from "logic/creatures";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;

function randomPositionIn(room) {
  return [
    Math.floor(room.getLeft() + (room.getRight() - room.getLeft()) * Math.random()),
    Math.floor(room.getTop() + (room.getBottom() - room.getTop()) * Math.random()),
  ];
}

export function spawnEnemies(rooms) {
  return rooms.map((room) => {
    const position = randomPositionIn(room);
    return makeCreature("mutantRat", { x: position[0], y: position[1] });
  });
}

export default function SewerLevel(id) {
  const map = Map.create({ id, width: MAP_WIDTH, height: MAP_HEIGHT });

  function makeDoors(x, y) {
    map.setTile("door", { x, y });
  }

  function getDoors(rooms) {
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      room.getDoors(makeDoors);
    }
  }

  function healingItemsOnLevel(rooms) {
    const amount = Math.floor(Math.random() * 2) + 1;
    const potions = [];
    for (let i = 0; i <= amount; i++) {
      const randomRoom = Math.floor(Math.random() * rooms.length);
      const position = randomPositionIn(rooms[randomRoom]);
      potions.push(makeItem("healingPotion", { x: position[0], y: position[1] }));
    }
    const position = randomPositionIn(rooms[0]);
    potions.push(makeItem("healingPotion", { x: position[0], y: position[1] }));
    map.items = potions;
  }

  const rotMap = new ROT.Map.Digger(MAP_WIDTH, MAP_HEIGHT, {
    roomWidth: [7, 12],
    roomHeight: [7, 13],
    dugPercentage: 0.5,
  });

  rotMap.create((x, y, wall) => {
    if (wall) {
      map.setTile("wall", { x, y });
    } else {
      map.setTile("floor", { x, y });
    }
  });

  const rooms = rotMap.getRooms();

  if (map.id !== 0) {
    map.setStairs(rooms[0].getCenter(), rooms[rooms.length - 1].getCenter());
  } else {
    map.setStairs(null, rooms[rooms.length - 1].getCenter());
  }

  map.setInitialPlayerPosition(rooms[0].getCenter()[0], rooms[0].getCenter()[1]);
  getDoors(rooms);
  healingItemsOnLevel(rooms);

  map.creatures = spawnEnemies(rooms);
  return map;
}
