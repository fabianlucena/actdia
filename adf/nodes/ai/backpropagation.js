import Node from '../../actdia/node.js';

export default class Backpropagation extends Node {
  shape = {
    shapes: [
      {
        shape: 'circle',
        x: 1,
        y: 1,
        r: 1,
      },
      {
        shape: 'path',
        sx: .66,
        sy: .66,
        d: `M 1.5,0.5
          A 1,1 0 1,1 0.5, 1.5
          M 1.5,0.5 H 1.2
          M 1.2,0.5 L 1.6, 0.3
          M 1.2,0.5 L 1.6, 0.7`,
        fill: false
      },
    ],
  };

  box = {
    x: 0,
    y: 0,
    width: 2,
    height: 2,
  };

  connectors = [
    { name: 'i', type: 'in', x: 0, y: 1, direction: 'left',  extends: 'tiny' },
  ];

  updateStatus(options = {}) {
    const inputs = this.connectors
      .filter(c => c.type === 'in')
      .map(i => i.status);

    let status = inputs[1] - inputs[0];

    this.setStatus(status, options);
  }
}