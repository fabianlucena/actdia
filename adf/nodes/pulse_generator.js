export default function create({ Node }) {
  return class PulseGenerator extends Node {
    static label = 'Pulse generator';

    rotationX = 2;
    rotationY = 2;

    shape = {
      shapes: [
        {
          shape: 'rect',
          x: 0,
          y: 0,
          width: 4,
          height: 4,
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
      width: 4,
      height: 4,
    };

    connectors = [
      { name: 'q',  label: true, type: 'out', x: 4, y: 1, direction: 'right',  extends: 'tiny' },
      { name: '!q', label: true, type: 'out', x: 4, y: 3, direction: 'right',  extends: 'tiny' },
      { name: 'x',  label: true, type: 'in',  x: 1, y: 4, direction: 'bottom', extends: 'tiny' },
    ];

    rate = 1;
    #interval = null;
    #factor = 1;

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
      if (this.active && this.rate && this.factor) {
        this.shape.shapes[2].fill = '#40FF40FF';
        this.shape.shapes[4].fill = '#80808001';

        if (!this.#interval) {
          this.updateInterval();
        }
      } else {
        if (this.shape.shapes[2])
          this.shape.shapes[2].fill = '#80808001';

        if (this.shape.shapes[3])
          this.shape.shapes[4].fill = '#800000FF';

        this.clearInterval(this.#interval);
      }

      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[2], this.shape.shapes[2]);
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[4], this.shape.shapes[4]);
    }

    onMouseClick({ evt, item, shape }) {
      if (!item.actdia
        || evt.button !== 0
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

    clearInterval() {
      if (this.#interval) {
        clearInterval(this.#interval);
        this.#interval = null;
      }
    }

    updateInterval() {
      this.clearInterval();
      if (this.#interval) {
        clearInterval(this.#interval);
      }

      const rate = this.rate * 2 * this.#factor;
      if (rate > 0) {
        this.#interval = setInterval(() => {
          this.setStatus(!this.status);
        }, 1000 / rate);
      }
    }

    updateStatus() {
      this.#factor = this.connectors.find(c => c.name === 'x').status;
      this.updateInterval();
      super.updateStatus(...arguments);
    }
  };
}