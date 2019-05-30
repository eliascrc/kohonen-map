export default class CNode {
  
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.weights = [];
    for (let i = 0; i < 3; i++) {
      this.weights.push(Math.random());
    }
  }

  getDistance = (inputVector) => {
    let distance = 0;
    for (let i = 0; i < this.weights.length; i++) {
      distance += (inputVector[i] - this.weights[i]) * (inputVector[i] - this.weights[i]);
    }

    return Math.sqrt(distance);
  }

  adjustWeights = (inputVector, learningRate, distanceInfluence) => {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += learningRate * distanceInfluence * (inputVector[i] - this.weights[i]);
    }
  }

}