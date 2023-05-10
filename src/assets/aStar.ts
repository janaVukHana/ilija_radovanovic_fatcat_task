// import { type } from "os";

interface Coordinates {
  x: number;
  y: number;
}

export function aStar(
  start: Coordinates,
  end: Coordinates,
  blockingObjectCoordinates: Coordinates[],
  sizee: string
): Coordinates[] | null {
  const size = parseInt(sizee);

  if (!size || typeof size !== "number") {
    throw new Error("Invalid size");
  }

  const openSet: Coordinates[] = [start];
  const closedSet: Coordinates[] = [];
  const gScore: number[][] = Array(size)
    .fill()
    .map(() => Array(size).fill(Infinity));
  const fScore: number[][] = Array(size)
    .fill()
    .map(() => Array(size).fill(Infinity));
  const cameFrom: Record<string, Coordinates> = {};

  gScore[start.x][start.y] = 0;
  fScore[start.x][start.y] = heuristic(start, end);

  while (openSet.length > 0) {
    let current = getLowestFScore(openSet, fScore);
    if (current.x === end.x && current.y === end.y) {
      // reconstruct path and return it
      let path = [end];
      let node = end;
      while (node.x !== start.x || node.y !== start.y) {
        node = cameFrom[`${node.x},${node.y}`];
        path.push(node);
      }
      return path.reverse();
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);

    const neighbors = getNeighbors(current, size);
    for (const neighbor of neighbors) {
      if (
        closedSet.some(
          (coord) => coord.x === neighbor.x && coord.y === neighbor.y
        )
      ) {
        continue;
      }

      if (
        blockingObjectCoordinates.some(
          (coord) => coord.x === neighbor.x && coord.y === neighbor.y
        )
      ) {
        continue;
      }

      const tentativeGScore = gScore[current.x][current.y] + 1;
      if (
        !openSet.some(
          (coord) => coord.x === neighbor.x && coord.y === neighbor.y
        )
      ) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore[neighbor.x][neighbor.y]) {
        continue;
      }

      cameFrom[`${neighbor.x},${neighbor.y}`] = current;
      gScore[neighbor.x][neighbor.y] = tentativeGScore;
      fScore[neighbor.x][neighbor.y] =
        gScore[neighbor.x][neighbor.y] + heuristic(neighbor, end);
    }
  }

  // no path found
  return null;
}

function heuristic(current: Coordinates, end: Coordinates): number {
  return Math.abs(current.x - end.x) + Math.abs(current.y - end.y);
}

function getLowestFScore(openSet: Coordinates[], fScore: number[][]): Coordinates {
  let lowest = openSet[0];
  for (const coord of openSet) {
    if (fScore[coord.x][coord.y] < fScore[lowest.x][lowest.y]) {
      lowest = coord;
    }
  }

  return lowest;
}

function getNeighbors(coord: Coordinates, size: number): Coordinates[] {
  const neighbors: Coordinates[] = [];
  
    if (coord.x > 0) {
      neighbors.push({ x: coord.x - 1, y: coord.y });
    }
  
    if (coord.y > 0) {
      neighbors.push({ x: coord.x, y: coord.y - 1 });
    }
  
    if (coord.x < size - 1) {
      neighbors.push({ x: coord.x + 1, y: coord.y });
    }
  
    if (coord.y < size - 1) {
      neighbors.push({ x: coord.x, y: coord.y + 1 });
    }
  
    return neighbors;
  }
  