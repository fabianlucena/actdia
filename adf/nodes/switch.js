import Node from '../actdia/node.js';

export default class Switch extends Node {
  static label = 'Switch';

  shape = {
    shapes: [
      {
        shape: 'rect',
        x: 0,
        y: 0,
        width: 1,
        height: 2,
        rx: .2,
        ry: .2,
      },
      {
        shape: 'rect',
        x: 0.2,
        y: 0.4,
        width:  0.6,
        height: 1.2,
        rx: .3,
        ry: .3,
      },
      {
        name: 'knob',
        shape: 'circle',
        x: 0.5,
        y: 1.3,
        r: .4,
        fill: 'darkred',
        stroke: 'darkred',
      },
    ],
  };

  box = {
    x: 0,
    y: 0,
    width: 1,
    height: 2,
  };

  connectors = [
    { name: 'o0', type: 'out', x: 1, y: 1, direction: 'right', extends: 'tiny' },
  ];

  update() {
    const shape = this.shape.shapes[2] ??= {};
    if (this.status) {
      shape.fill = 'lightgreen';
      shape.stroke = 'darkgreen';
      shape.y = 0.7;
    } else {
      shape.fill = '#800000';
      shape.stroke = '#400000';
      shape.y = 1.3;
    }

    this.actdia.tryUpdateShape(this, this.svgShape?.children?.[2], this.shape.shapes[2]);
  }

  onClick({ evt, item, shape }) {
    if (!item.actdia
      || evt.button !== 0
      || evt.ctrlKey
      || evt.shiftKey
      || evt.altKey
      || item.shapes?.some(s => s.connector)
      || shape?.name !== 'knob'
    )
      return;

    this.setStatus(!this.status);
    evt.preventDefault();
  }
}