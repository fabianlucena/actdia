import Node from '../node.js';
import { _ } from '../locale.js';

export default class Selector extends Node {
  shape = {
    shapes: [
      {
        shape: 'rect',
        x: 0,
        y: 0,
        width: 4,
        height: 4,
        rx: .2,
        ry: .2,
      },
      {
        shape: 'text',
        x: 0,
        width: 4,
        height: 4,
        text: '',
        fontSize: .8,
      },
    ],
  };

  box = {
    x: 0,
    y: 0,
    width: 4,
    height: 4,
  };

  connectors = [
    { name: 'i0', type: 'in', x: 0, y: 2, direction: 'left' },
    { name: 'i1', type: 'in', x: 2, y: 4, direction: 'bottom' },
    { name: 'o0', type: 'out', x: 4, y: 2, direction: 'right' },
  ];

  index = 0;

  updateStatus() {
    const data = this.connectors[0].status;
    if (!data || !Array.isArray(data)) {
      this.shape.shapes[1].text = _('No data');
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[1], this.shape.shapes[1]);
      return;
    }

    this.index ??= 0;
    this.index++;
    if (this.index >= data.length)
      this.index = 0;

    this.setStatus(data[this.index]);

    this.shape.shapes[1].text = `${this.index} / ${data.length}`;
    this.actdia.tryUpdateShape(this, this.svgShape?.children?.[1], this.shape.shapes[1]);
  }
}