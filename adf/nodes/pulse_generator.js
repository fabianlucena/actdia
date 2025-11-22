export default function create({ Node }) {
  return class PulseGenerator extends Node {
    static label = 'Pulse generator';

    rotationX = 1.5;
    rotationY = 1.5;

    shape = {
      shapes: [
        {
          shape: 'rect',
          x: 0,
          y: 0,
          width: 3,
          height: 3,
        },
        {
          shape: 'path',
          d: 'M 0.5 1.5 L 1 1.5 L 1 0.5 L 1.5 0.5 L 1.5 1.5 L 2 1.5 L 2 0.5 L 2.5 0.5',
        },
        {
          name: 'start',
          shape: 'path',
          x: 0.6,
          y: 2,
          width: .5,
          height: .5,
          d: 'M 0 0 L 0.5 .4 L 0 0.8 Z',
          fill: '#00800001',
        },
        {
          name: 'stop',
          shape: 'rect',
          x: 1.6,
          y: 2,
          width: .8,
          height: .8,
          stroke: false,
        },
        {
          name: 'stop',
          shape: 'path',
          x: 1.6,
          y: 2,
          width: .5,
          height: .5,
          shape: 'path',
          d: 'M 0 0 L 0.25 0 L 0.25 0.8 L 0 0.8 Z'
            + ' M 0.5 0 L 0.75 0 L 0.75 0.8 L 0.5 0.8 Z',
          fill: '#800000FF',
        }
      ],
    };

    box = {
      x: 0,
      y: 0,
      width: 3,
      height: 3,
    };

    connectors = [
      { name: 'o0', type: 'out', x: 3, y: 1, direction: 'right', extends: 'tiny' },
    ];

    rate = 0.3;
    #interval = null;

    constructor(...args) {
      super(...args);
      this.active = false;
    }

    init() {
      super.init(...arguments);
      if (this.shape && this.actdia) {
        this.updateButtons();
      }
    }

    updateButtons() {
      if (this.active && this.rate) {
        this.shape.shapes[2].fill = '#40FF40FF';
        this.shape.shapes[4].fill = '#80808001';

        if (!this.#interval) {
          this.#interval = setInterval(() => {
            this.setStatus(!this.status);
          }, this.rate * 1000);
        }
      } else {
        if (this.shape.shapes[2])
          this.shape.shapes[2].fill = '#80808001';

        if (this.shape.shapes[3])
          this.shape.shapes[4].fill = '#800000FF';

        if (this.#interval) {
          clearInterval(this.#interval);
          this.#interval = null;
        }
      }

      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[2], this.shape.shapes[2]);
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[4], this.shape.shapes[4]);
    }

    onMouseClick({ evt, item, shape }) {
      if (!item.actdia
        || evt.buttons !== 1
        || evt.ctrlKey
        || evt.shiftKey
        || evt.altKey
        || !item.connectors?.some(c => c.connections.length > 0)
        || !shape?.name
      )
        return;

      if (shape.name === 'start') {
        this.active = true;
        this.updateButtons();
        evt.preventDefault();
      } else if (shape.name === 'stop') {
        this.active = false;
        this.updateButtons();
        evt.preventDefault();
      }
    }
  };
}