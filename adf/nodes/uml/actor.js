import Node from '../../actdia/node.js';

export default class Actor extends Node {
  shape = {
    shapes: [
      {
        shape: 'circle',
        cx: 1.5,
        cy: 0.9,
        r: 0.5,
      },
      {
        shape: 'line',
        x1: 1.5,
        y1: 1.5,
        x2: 1.5,
        y2: 3.2,
      },
      {
        shape: 'line',
        x1: 0.4,
        y1: 2.1,
        x2: 2.6,
        y2: 2.1,
      },
      {
        shape: 'line',
        x1: 1.5,
        y1: 3.2,
        x2: 0.7,
        y2: 4.7,
      },
      {
        shape: 'line',
        x1: 1.5,
        y1: 3.2,
        x2: 2.3,
        y2: 4.7,
      },
    ],
  };

  box = {
    x: 0,
    y: 0,
    width: 3,
    height: 5,
  };

  connectors = [
    { name: '0', type: 'out', x: 3.5, y: 2.5, direction: 'right' },
  ];
}