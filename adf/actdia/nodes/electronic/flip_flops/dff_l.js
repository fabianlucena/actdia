import Node from '../../../node.js';

export default class DFF_L extends Node {
  static label = 'D Flip-Flop (Latch)';

  shape = {
    shapes: [
      {
        shape: 'rect',
        x: 0,
        y: 0,
        width: 5,
        height: 6,
      },
      {
        shape: 'text',
        x: .4,
        y: 1,
        text: 'D',
        textAnchor: 'start',
        dominantBaseline: 'central',
        fontSize: .8,
      },
      {
        shape: 'text',
        x: 4.6,
        y: 1,
        text: 'Q',
        textAnchor: 'end',
        dominantBaseline: 'central',
        fontSize: .8,
      },
      {
        shape: 'text',
        x: 4.6,
        y: 5,
        text: 'Q',
        textAnchor: 'end',
        dominantBaseline: 'central',
        fontSize: .8,
      },
      {
        shape: 'path',
        d: 'M 3.9 4.4 H 4.5',
      },
      {
        shape: 'text',
        x: .4,
        y: 5,
        text: 'CLK',
        textAnchor: 'start',
        dominantBaseline: 'central',
        fontSize: .8,
      },
    ],
  };

  box = {
    x: 0,
    y: 0,
    width: 5,
    height: 6,
  };

  connectors = [
    { name: 'd',   type: 'in', x: 0, y: 1, direction: 'left', extends: 'tiny' },
    { name: 'clk', type: 'in', x: 0, y: 5, direction: 'left', extends: 'tiny' },
    { name: 'q',   type: 'out', x: 5, y: 1, direction: 'right', extends: 'tiny' },
    { name: '!q',  type: 'out', x: 5, y: 5, direction: 'right', extends: 'tiny' },
  ];

  updateStatus(options = {}) {
    const clock = this.connectors.find(c => c.name === 'clk');
    if (clock.status < 0.5) {
      return;
    }

    const d = this.connectors.find(c => c.name === 'd');
    const status = d.status >= 0.5 ? 1 : 0;
    this.setStatus(status, options);
  }

  propagate(options = {}) {
    const outputs = this.connectors
      .filter(c => c.type === 'out');

    outputs[0].setStatus(this.status, options);
    outputs[1].setStatus(!this.status, options);
  }
}