import Node from '../../../node.js';

export default class JKFF_E extends Node {
  static label = 'JK Flip-Flop (edge triggered)';
  static description = 'JK flip-flop (edge triggered) circuit node. The J and K inputs control the state of the output Q on the rising edge of the clock input.';

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
        text: 'J',
        textAnchor: 'start',
        dominantBaseline: 'central',
        fontSize: 0.8,
      },
      {
        shape: 'text',
        x: .4,
        y: 5,
        text: 'K',
        textAnchor: 'start',
        dominantBaseline: 'central',
        fontSize: 0.8,
      },
      {
        shape: 'text',
        x: 4.6,
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
        x: .8,
        y: 3,
        text: 'CLK',
        textAnchor: 'start',
        dominantBaseline: 'central',
        fontSize: .8,
      },
      {
        shape: 'path',
        x: 0,
        y: 2.5,
        d: `M 0 0 L 0.6 0.5 L 0 1`,
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
    { name: 'j', type: 'in', x: 0, y: 1, direction: 'left', extends: 'tiny' },
    { name: 'k', type: 'in', x: 0, y: 5, direction: 'left', extends: 'tiny' },
    { name: 'clk', type: 'in', x: 0, y: 3, direction: 'left', extends: 'tiny' },
    { name: 'q', type: 'out', x: 5, y: 1, direction: 'right', extends: 'tiny' },
    { name: '!q', type: 'out', x: 5, y: 5, direction: 'right', extends: 'tiny' },
  ];

  previousClockStatus = 0;

  updateStatus(options = {}) {
    const clock = this.connectors.find(c => c.name === 'clk');
    if (clock.status < 0.5) {
      this.previousClockStatus = 0;
      return;
    }

    if (this.previousClockStatus >= 0.5) {
      this.previousClockStatus = 1;
      return;
    }

    this.previousClockStatus = 1; 
    
    const j = this.connectors.find(c => c.name === 'j');
    const k = this.connectors.find(c => c.name === 'k');

    if (j.status >= 0.5) {
      if (k.status >= 0.5) {
        this.setStatus(this.status >= 0.5 ? 0 : 1, options);
      } else {
        this.setStatus(1, options);
      }
    } else {
      if (k.status >= 0.5) {
        this.setStatus(0, options);
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