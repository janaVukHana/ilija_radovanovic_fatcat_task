interface Point {
  x: number;
  y: number;
}

export function generateBlockingObjectCoordinates(
  movingObjectCoordinates: Point,
  startPosition: Point,
  endPosition: Point,
  BOn: number,
  size: number
): Point[] {
  let blockingObjectCoordinates: Point[] = [];
  
  while (blockingObjectCoordinates.length < BOn) {
    let row = Math.floor(Math.random() * size);
    let col = Math.floor(Math.random() * size);
    // Check if BO is not same as MO, start and end positions
    if (
      (row !== movingObjectCoordinates.x || col !== movingObjectCoordinates.y) &&
      (row !== startPosition.x || col !== startPosition.y) &&
      (row !== endPosition.x || col !== endPosition.y)
    ) {
      // Check if BO coordinates are unique
      if (!blockingObjectCoordinates.some(coord => coord.x === row && coord.y === col)) {
        blockingObjectCoordinates.push({ x: row, y: col });
      }
    }
  }
  
  return blockingObjectCoordinates;
}
