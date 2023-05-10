import React from 'react';

interface Coords {
  x: number;
  y: number;
}

interface Props {
  size: number;
  MOcoords: Coords;
  BOcoords: Coords[];
  end: Coords;
  start: Coords;
}

function Matrix(props: Props): JSX.Element {
  const { size, MOcoords, BOcoords, end, start } = props;

  // THIS WILL CREATE MATRIX
  const rows = Array.from({ length: size }).map((_, rowIndex) => (
    <div className="row" key={`row-${rowIndex}`}>
      {Array.from({ length: size }).map((_, colIndex) => {
        let cellClass = "cell";

        // Check if cell is MO
        if (MOcoords.x === rowIndex && MOcoords.y === colIndex) {
          cellClass += " MO";
        }

        // Check if cell is BO
        if (
          BOcoords.some(
            (coord) => coord.x === rowIndex && coord.y === colIndex
          )
        ) {
          cellClass += " BO";
        }

        // Check if cell is start position
        if (start.x === rowIndex && start.y === colIndex) {
          cellClass += " start";
        }

        // Check if cell is end position
        if (end.x === rowIndex && end.y === colIndex) {
          cellClass += " end";
        }

        return <div className={cellClass} key={`cell-${rowIndex}-${colIndex}`}></div>;
      })}
    </div>
  ));

  return <>{rows}</>;
}

export default Matrix;

