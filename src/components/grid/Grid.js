import React, { Component } from 'react';

import './Grid.css';
import Square from '../square/Square';
import CNode from '../../model/CNode';
import { inputVectors } from './InputVectors.js';

let cycle = null;
let cNodeMatrix;
let maxRows;
let maxCols;
let numberOfIterations;
let iterationCount = 0;
let mapRadius;
let timeConstant;
let startLearningRate;

export default class Grid extends Component {

  constructor(props) {
    super(props);

    maxRows = 40;
    maxCols = 40;
    numberOfIterations = 1000;
    startLearningRate  = 0.1;

    mapRadius = ( maxRows > maxCols ? maxRows : maxCols ) / 2;
    timeConstant = numberOfIterations/Math.log(mapRadius);

    cNodeMatrix = [];
    for (let i = 0; i < maxRows; i++) {
      cNodeMatrix[i] = [];
      for (let j = 0; j < maxCols; j++) {
        cNodeMatrix[i][j] = new CNode(i, j);
      }
    }

    this.state = {
      statecNodeMatrix: cNodeMatrix
    }

    cycle = setInterval(() => this.epoch(), 1);
  }

  getBMU(inputVector) {
    let bmu = cNodeMatrix[0][0];
    for (let i = 0; i < cNodeMatrix.length; i++) {
      for (let j = 0; j < cNodeMatrix[i].length; j++) {
        bmu = bmu.getDistance(inputVector) > cNodeMatrix[i][j].getDistance(inputVector) ? cNodeMatrix[i][j] : bmu; 
      }
    }

    return bmu;
  }

  getNeighbourhoodRadius() {
    return mapRadius * Math.exp(-(iterationCount / timeConstant));
  }

  getLearningRate() {
    return startLearningRate * Math.exp(-(iterationCount / numberOfIterations));
  }

  epoch() {

    if (iterationCount < numberOfIterations) {

      const thisVector =  Math.floor(Math.random() * inputVectors.length);
      const winningNode = this.getBMU(inputVectors[thisVector]);

      const neighbourhoodRadius = this.getNeighbourhoodRadius();
      
      const learningRate = this.getLearningRate();

      for (let i = 0; i < cNodeMatrix.length; i++) {
        for (let j = 0; j < cNodeMatrix[i].length; j++) {
          const distanceToNodeSq =  (winningNode.x - cNodeMatrix[i][j].x) *
                                  (winningNode.x - cNodeMatrix[i][j].x) +
                                  (winningNode.y - cNodeMatrix[i][j].y) *
                                  (winningNode.y - cNodeMatrix[i][j].y);

          const neighbourhoodRadiusSq = neighbourhoodRadius * neighbourhoodRadius;

          if (distanceToNodeSq < neighbourhoodRadiusSq) {
            const distanceInfluence = Math.exp(-(distanceToNodeSq) / (2*neighbourhoodRadiusSq));

            cNodeMatrix[i][j].adjustWeights(inputVectors[thisVector], learningRate, distanceInfluence);
          }
        }
      }

      console.log(iterationCount);
      iterationCount += 1;

    } else {
      console.log("Done!!!")
      clearInterval(cycle);
      this.setState({ statecNodeMatrix: cNodeMatrix });
    }
  }

  render() {
    const { statecNodeMatrix } = this.state;

    return (
      <div className="grid">
        {statecNodeMatrix.map( (array, ikey) =>
          <div className="grid-column" key={ikey}>
            {array.map( (cNode, jkey) =>
              <Square 
                x={cNode.x}
                y={cNode.y}
                weights={cNode.weights}
                key={jkey}
              />
            )}
          </div>
        )}
      </div>
    )
  }
}
