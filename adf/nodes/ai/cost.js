import Node from '../../actdia/node.js';

export default class Cost extends Node {
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
        x: .5,
        y: .5,
        d: `M0.5,0.9 
            L0.5,0.2 
            M0.3,0.2 L0.7,0.2 
            M0.3,0.2 
            L0.2,0.5 
            L0.4,0.5 
            Z
            M0.7,0.2 
            L0.6,0.5 
            L0.8,0.5 
            Z
            M0.45,0.9 
            L0.55,0.9 
            L0.55,0.95 
            L0.45,0.95 
            Z`
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
    { name: 'i0', type: 'in',  x: 0.293, y: 0.293, direction:  135,  extends: 'tiny' },
    { name: 'i1', type: 'in',  x: 0.293, y: 1.707, direction: -135,  extends: 'tiny' },
    { name: 'o0', type: 'out', x: 2, y: 1, direction: 'right', extends: 'tiny' },
  ];

  updateStatus(options = {}) {
    const inputs = this.connectors
      .filter(c => c.type === 'in')
      .map(i => i.status);

    let p = inputs[1] - inputs[0];
    let status = p * p;

    this.setStatus(status, options);
  }
}