import Node from '../../../node.js';

export default class TFF_L extends Node {
  static label = 'T Flip-Flop (latch)';
  static description = 'T (Toggle) flip-flop (latch) circuit node. The output Q changes state when the clock input is high.';

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
        x: 0.4,
        y: 1,
        text: 'T',
        textAnchor: 'start',
        dominantBaseline: 'central',
        fontSize: 0.8,
      },
      {
        shape: 'text',
        x: 4.4,
        y: 1,
        text: 'Q',
        textAnchor: 'end',
        dominantBaseline: 'central',
        fontSize: 0.8,
      },
      {
        shape: 'text',
        x: 4.6,
        y: 5,
        text: 'Q',
        textAnchor: 'end',
        dominantBaseline: 'central',
        fontSize: 0.8,
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
    { name: 't',  type: 'in', x: 0, y: 1, direction: 'left', extends: 'tiny' },
    { name: 'clk', type: 'in', x: 0, y: 5, direction: 'left', extends: 'tiny' },
    { name: 'q',  type: 'out', x: 5, y: 1, direction: 'right', extends: 'tiny' },
    { name: '!q', type: 'out', x: 5, y: 5, direction: 'right', extends: 'tiny' },
  ];

  counter = 0;

  updateStatus(options = {}) {
    const clock = this.connectors.find(c => c.name === 'clk');
    if (clock.status < 0.5) {
      return;
    }
    
    const t = this.connectors.find(c => c.name === 't');
    if (t.status >= 0.5) {
      this.counter++;
      if (this.counter >= 2) {
        this.setStatus(this.status >= 0.5 ? 0 : 1, options);
        this.counter = 0;
      }
    } 
  }

  propagate(options = {}) {
    const outputs = this.connectors
      .filter(c => c.type === 'out');

    outputs[0].setStatus(this.status, options);
    outputs[1].setStatus(!this.status, options);
  }
}