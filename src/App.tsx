import React, { useState } from 'react';
import Matrix from './components/Matrix';
import { generateBlockingObjectCoordinates } from './assets/generateBlockingObjectCoordinates';
import { aStar } from './assets/aStar';

function App() {
  
  const [matrixSize, setMatrixSize] = useState<number>(parseInt(import.meta.env.VITE_APP_MATRIX_SIZE ?? '') || 5);
  const [BOn, setBOn] = useState<number>(parseInt(import.meta.env.VITE_APP_BO_NUMBER ?? '') || 1);
  const [path, setPath] = useState<Array<{ x: number; y: number }>>([]);
  const [movingObjectCoordinates, setMovingObjectCoordinates] = useState<{
    x: number;
    y: number;
  }>({
    x: parseInt(import.meta.env.VITE_APP_START_X_COORDS ?? '') || 0,
    y: parseInt(import.meta.env.VITE_APP_START_Y_COORDS ?? '') || 0,
  });
  // MAYBE TODO: make to be random position after react end cell
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({
    x: parseInt(import.meta.env.VITE_APP_START_X_COORDS ?? '') || 0,
    y: parseInt(import.meta.env.VITE_APP_START_Y_COORDS ?? '') || 0,
  });
  // RANDOM END POSITION
  // BUG: because it is random, end position can be same as start position
  const [endPosition, setEndPosition] = useState<{ x: number; y: number }>({
    x: Math.floor(Math.random() * matrixSize),
    y: Math.floor(Math.random() * matrixSize),
  });
  const [blockingObjectCoordinates, setBlockingObjectCoordinates] = useState<Array<{ x: number; y: number }>>(
    generateBlockingObjectCoordinates(movingObjectCoordinates, startPosition, endPosition, BOn, matrixSize),
  );
  const [animate, setAnimate] = useState<boolean>(false);
  
  if(animate) {
    
    // ASTAR ALGORITHM
    const pathAvailable = aStar(movingObjectCoordinates, endPosition, blockingObjectCoordinates, matrixSize.toString());
  
    if (pathAvailable === null) {
      // regenerate blockingObjectCoordinates again until path is available
      setBlockingObjectCoordinates(generateBlockingObjectCoordinates(movingObjectCoordinates, startPosition, endPosition, BOn, matrixSize))
      return null;
    }
    
    // if you came to end position
    if(endPosition.x === movingObjectCoordinates.x && endPosition.y === movingObjectCoordinates.y) {
      console.log('THE END')
      console.log('PATH:from the end ', path)
      
      setTimeout(() => {

        setMovingObjectCoordinates((prevVal) => startPosition)
        setEndPosition((prevVal) => ({
          x: Math.floor(Math.random() * matrixSize),
          y: Math.floor(Math.random() * matrixSize),
        }))
        setPath(prevVal => [...prevVal, movingObjectCoordinates])
        if(matrixSize === 5) {
          if(BOn === 1) setBOn(2)
          else if(BOn === 2) setBOn(3)
          else {
            setMatrixSize(10)
            setBOn(2)
          }
        } 
        else if(matrixSize === 10) {
          if(BOn === 2) setBOn(3)
          else if(BOn === 3) setBOn(4)
          else {
            setMatrixSize(20)
            setBOn(3)
          }
        } 
        else {
          if(BOn === 3) setBOn(4)
          else if(BOn === 4) setBOn(5)
          else setAnimate(false)
        }
      }, 2000)
    } else {
  
      // path is available here
      setTimeout(() => {
        setMovingObjectCoordinates(prevVal => pathAvailable[1])
        setBlockingObjectCoordinates(prevVal => generateBlockingObjectCoordinates(pathAvailable[1], startPosition, endPosition, BOn, matrixSize))
        setPath(prevVal => {
          const isObjInArray = prevVal.some(obj => {
            return JSON.stringify(obj) === JSON.stringify(pathAvailable[1])
          });
          if(isObjInArray) {
            return prevVal;
          }
          return [...prevVal, pathAvailable[1]]
        })
        // TODO: color visited cells
      }, 500)
    }
  }

  // EVENT LISTENERS
const handleChangeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
  setMatrixSize(prevVal => parseInt(e.target.value))
  // set new BO coordinates
  const BOcoordinates = generateBlockingObjectCoordinates(movingObjectCoordinates, startPosition, endPosition, BOn, parseInt(e.target.value))
  setBlockingObjectCoordinates(prevVal => BOcoordinates)
  }
  
  const handleBOn = (e: React.ChangeEvent<HTMLInputElement>) => {
  setBOn(parseInt(e.target.value))
  // set new BO coordinates
  const BOcoordinates = generateBlockingObjectCoordinates(movingObjectCoordinates, startPosition, endPosition, parseInt(e.target.value), matrixSize)
  setBlockingObjectCoordinates(prevVal => BOcoordinates)
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  }
  
  const handleStartAnimation = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  setAnimate(!animate)
  }
  
    return (
      <div className="App">
        <h1>My Matrix</h1>
        {/* form for changing size, start, end, BO number */}
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label>Matrix Size: </label>
              <input type="number" value={matrixSize} onChange={handleChangeSize} />
            </div>
            <div className="form-control">
              <label>Number Of Blocks: </label>
              <input type="number" value={BOn} onChange={handleBOn} />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>

        {/* animation button */}
        <button 
          className={animate === false ? 'btn-start':'btn-stop'}
          onClick={handleStartAnimation}>
            {animate === false ? 'Start animation':'Stop animation'}
        </button>
        
        {/* SHOW MATRIX */}
        <div className="matrix">
          <Matrix 
            size={matrixSize}
            MOcoords={movingObjectCoordinates}
            BOcoords={blockingObjectCoordinates}
            start={startPosition}
            end={endPosition}
          />
        </div>

      </div>
    );
  
}

export default App