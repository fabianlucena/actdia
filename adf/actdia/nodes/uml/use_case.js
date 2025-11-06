import Node from '../../node.js';

export default class UseCase extends Node {
  shape = {
    shape: 'ellipse',
    x: 5,
    y: 2,
    rx: 5,
    ry: 2,
  };

  box = {
    x: 0,
    y: 0,
    width: 10,
    height: 4,
  };

  connectors = [
    { name: '0', type: 'in', x: 0, y: 2, direction: 'left' },
  ];
}