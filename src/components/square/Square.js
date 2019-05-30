import React, { Component } from 'react';

import './Square.css';

export default class Square extends Component {

  render() {
    const { weights } = this.props; 
    const red = 255 * weights[0];
    const green = 255 * weights[1];
    const blue = 255 * weights[2];

    return (
      <div className="square" style={{background: `rgb(${red},${green},${blue})`}}>
        
      </div>
    )
  }
}
