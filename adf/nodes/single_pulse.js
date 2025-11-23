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
          d: 'M 0.5 3 H 1 V 1 H 1.5',
        },
      ],
    };

    box = {
      x: 0,
      y: 0,
      width: 3,
      height: 4,
    };

    #delay = 300;

    connectors = [
      { name: 'o',  label: true, type: 'out', x: 3, y: 1, direction: 'right', extends: 'tiny' },
      { name: '!o', label: true, type: 'out', x: 3, y: 3, direction: 'right', extends: 'tiny' },
    ];

    init() {
      super.init(...arguments);

      this.setStatus(0);
      setTimeout(() => this.setStatus(1), this.#delay);
    }

    propagate() {
      const status = this.status >= 0.5 ? 1 : 0;
      this.connectors.find(c => c.name === 'o').setStatus(status);
      this.connectors.find(c => c.name === '!o').setStatus(1 - status);
    }
 };
}