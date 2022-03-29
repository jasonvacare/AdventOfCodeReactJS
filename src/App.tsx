import React, { useState } from 'react';
import './App.css';
import text from './input';

function App() {
    const [step, nextStep] = useState({
      count: 0,
      moves: 0,
      matrix: textToMatrix(text)
    });
  
    const canMove = step.moves > 0 || step.count === 0;
    const stepClass = canMove ? "CanMove" : "CannotMove";
  
    return (
      <div className="App">
        <p>Displaying step: <span className={ stepClass }>{ step.count }</span></p>
        <p>Moves made: { step.moves }</p>
        <button onClick={ () => nextStep(getNextResult(step.count, step.matrix, false)) }>Next Step</button>
        <button onClick={ () => nextStep(getNextResult(step.count, step.matrix, true)) }>Skip to End</button>
        <p className="Raw">{ matrixToHtml(step.matrix) }</p>
      </div>
    );
  }
  
  function getNextResult(count: number, oldMatrix: string[][], recurse: boolean): {
    count: number,
    moves: number,
    matrix: string[][]
  } {
    const newMatrix = oldMatrix;
    const height = newMatrix.length;
    const width = height > 0 ? newMatrix[0].length : 0;
    let newMoves = 0;

    // east movers
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (newMatrix[row][col] === '>') {
          const newCol = getTargetCol(col, width);
          if (oldMatrix[row][newCol] === '.') {
            newMoves++;
            newMatrix[row][col] = '.';
            newMatrix[row][newCol] = '>';
            col++; // skip the mover
          }
        }
      }
    }

    // south movers
    for (let col = 0; col < width; col++) {
      for (let row = 0; row < height; row++) {      
        if (newMatrix[row][col] === 'v') {
          const newRow = getTargetRow(row, height);
          if (oldMatrix[newRow][col] === '.') {
            newMoves++;
            newMatrix[row][col] = '.';
            newMatrix[newRow][col] = 'v';
            row++; // skip the mover
          }
        }
      }
    }

    const newCount = newMoves === 0 ? count : count + 1;

    if (recurse && newMoves > 0) {
      return getNextResult(newCount, newMatrix, true);
    }
    return {
      count: newCount,
      matrix: newMatrix,
      moves: newMoves
    };
  }
  
  function getTargetRow(row: number, height: number): number {
    return (row + 1) % height;
  }

  function getTargetCol(col: number, width: number): number {
    return (col + 1) % width;
  }

  function textToMatrix(text: string): string[][] {
    return text
      .split(/\r?\n/)
      .map((x) => { return x.split('') });
  }
  
  function matrixToHtml(matrix: string[][]): string {
    return matrix.map((item) => {
      const row = item;
      return row.join('');
    }).join('\n');
  }
  
  export default App;