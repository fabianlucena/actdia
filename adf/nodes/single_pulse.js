export default function create({ Node }) {
  return class SinglePulse extends Node {
    static label = 'Single pulse';

    rotationX = 1.5;
    rotationY = 1.5;

    shape = {
      shapes: [
        {
          shape: 'rect',
          x: 0,
          y: 0,
          width: 3,
          height: 4,
        },
        {
          shape: 'path',
          d: 'M 0.5 3 H .8 V .9 H 1.0 V 3 H 1.5',
        },
      ],
    };

    box = {
      x: 0,
      y: 0,
      width: 3,
      height: 4,
    };

    #delay = 200;
    #pulseWidth = 100;
    #pulsed = false;

    connectors = [
      { name: 'q',  label: true, type: 'out', x: 3, y: 1, direction: 'right', extends: 'tiny' },
      { name: '!q', label: true, type: 'out', x: 3, y: 3, direction: 'right', extends: 'tiny' },
    ];

    init() {
      super.init(...arguments);
      if (!this.#pulsed) {
        this.pulse();
      }
    }

    pulse() {
      this.#pulsed = true;
      this.setStatus(0);
      setTimeout(() => {
        this.setStatus(1);
        setTimeout(() => {
          this.setStatus(0);
        }, this.#pulseWidth);
      }, this.#delay);
    }

    propagate() {
      const status = this.status >= 0.5 ? 1 : 0;
      this.connectors.find(c => c.name === 'q').setStatus(status);
      this.connectors.find(c => c.name === '!q').setStatus(1 - status);
    }
 };
}