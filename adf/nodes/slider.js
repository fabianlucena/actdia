export default function create({ Node }) {
  return class Slider extends Node {
    shape = {
      shapes: [
        {
          shape: 'rect',
          y: -.5,
          width: 6,
          height: 1,
          rx: .1,
          ry: .1,
        },
        {
          shape: 'rect',
          x: .5,
          y: -.15,
          width: 5,
          height: .3,
          rx: .1,
          ry: .1,
        },
        {
          name: 'knob',
          shape: 'rect',
          x: 3,
          y: -.8,
          width: .4,
          height: 1.6,
          rx: .15,
          ry: .15,
        },
      ],
    };

    box = {
      x: 0,
      y: -.5,
      width: 6,
      height: 1,
    };

    connectors = [
      { name: 'o0', type: 'out', x: 6, y: 0, direction: 'right', extends: 'tiny' },
    ];

    formDefinition = [
      {
        name: 'size',
        type: 'number',
        _label: 'Size',
      },
      {
        name: 'status',
        type: 'number',
        _label: 'Status',
        min: this.min,
        max: this.max,
      },
    ];

    #size = 6;
    min = 0;
    max = 1;

    get size() {
      return this.#size;
    }

    set size(value) {
      this.#size = value;
      this.box.width = value;
      this.shape.shapes[0].width = value;
      this.shape.shapes[1].width = value - 1;
      this.connectors[0].x = value;
      this.update();
    }

    get range() {
      return this.max - this.min;
    }

    statusUpdated() {
      this.updateKnob();
      super.statusUpdated();
    }

    update() {
      super.update();
      this.updateKnob();
    }

    updateKnob() {
      const shape = this.shape.shapes.find(s => s.name === 'knob') ?? {};
      if (this.draggingKnob) {
        shape.fill = 'lightblue';
      } else {
        shape.fill = null;
      }

      shape.x = (this.status - this.min) / this.range * (this.size - 1) + .2;
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[2], shape);
    }

    onMouseClick({ evt, item, shape }) {
      if (!item.actdia
        || evt.buttons !== 1
        || evt.ctrlKey
        || evt.shiftKey
        || evt.altKey
        || item.shapes?.some(s => s.connector)
        || shape?.name !== 'knob'
      )
        return;

      evt.preventDefault();
    }

    onMouseDown({ evt, item, shape, mouse }) {
      if (!item.actdia
        || evt.buttons !== 1
        || evt.ctrlKey
        || evt.shiftKey
        || evt.altKey
        || item.shapes?.some(s => s.connector)
        || shape?.name !== 'knob'
      ) {
        this.draggingKnob = false;
        this.updateKnob();
        return;
      }

      evt.preventDefault();
      this.draggingKnob = true;
      this.draggingFrom = {
        x: mouse.x - (isNaN(shape.x)? 0 : (shape.x ?? 0)),
        y: mouse.y - (isNaN(shape.y)? 0 : (shape.y ?? 0)),
      };
      this.updateKnob();
    }

    onMouseUp({ evt, item, shape }) {
      this.draggingKnob = false;
      this.updateKnob();
    }

    onMouseMove({ evt, item, shape, mouse }) {
      if (!this.draggingKnob)
        return;

      if (!item.actdia
        || evt.buttons !== 1
        || evt.ctrlKey
        || evt.shiftKey
        || evt.altKey
        || item.shapes?.some(s => s.connector)
      ) {
        this.draggingKnob = false;
        this.updateKnob();
        return;
      }

      evt.preventDefault();

      const delta = (mouse.x - this.draggingFrom.x - .2) / (this.size - 1);
      let newStatus = this.min + delta * this.range;
      if (newStatus < this.min)
        newStatus = this.min;
      if (newStatus > this.max)
        newStatus = this.max;
      
      this.setStatus(newStatus);
    }
  };
}