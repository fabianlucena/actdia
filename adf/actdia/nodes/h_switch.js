import Node from '../node.js';

export default class HSwitch extends Node {
  static label = 'Horizontal switch';

  shape = {
    y: 0.5,
    shapes: [
      {
        shape: 'rect',
        x: 0,
        y: 0,
        width: 2,
        height: 1,
        rx: .2,
        ry: .2,
      },
      {
        shape: 'rect',
        x: 0.4,
        y: 0.2,
        width:  1.2,
        height: 0.6,
        rx: .3,
        ry: .3,
      },
      {
        shape: 'circle',
        x: 0.6,
        y: 0.5,
        r: .4,
        fill: 'darkred',
        stroke: 'darkred',
      },
    ],
  };

  box = {
    x: 0,
    y: 0.5,
    width: 2,
    height: 1,
  };

  connectors = [
    { name: 'o0', type: 'out', x: 2, y: 1, direction: 'right', extends: 'tiny' },
  ];

  update() {
    const shape = this.shape.shapes[2] ??= {};
    if (this.status) {
      shape.fill = 'lightgreen';
      shape.stroke = 'darkgreen';
      shape.x = 1.4;
    } else {
      shape.fill = '#800000';
      shape.stroke = '#400000';
      shape.x = 0.6;
    }

    this.actdia.tryUpdateShape(this, this.svgShape?.children?.[2], this.shape.shapes[2]);
  }

  onClick(evt, detail) {
    if (!detail.actdia
      || evt.button !== 0
      || evt.ctrlKey
      || evt.shiftKey
      || evt.altKey
      || detail.shapes?.some(s => s.connector)
    )
      return;

    this.setStatus(!this.status);

    return false;
  }
}