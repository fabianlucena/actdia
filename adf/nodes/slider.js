export default function create({ Node }) {
  return class Slider extends Node {
    shape = {
      shapes: [
        {
          shape: 'rect',
          y: -.15,
          width: 6,
          height: .3,
          rx: .1,
          ry: .1,
        },
        {
          name: 'knob',
          shape: 'circle',
          x: 3,
          y: 0,
          r: .4,
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

    width = 5;
    status = 0;
    min = -1;
    max = 1;

    get range() {
      return this.max - this.min;
    }

    updateKnob() {
      const shape = this.shape.shapes[1] ??= {};
      shape.x = (this.status - this.min) / this.range * this.width + .5;
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[1], this.shape.shapes[1]);
    }

    onMouseClick({ evt, item, shape }) {
      if (!item.actdia
        || evt.button !== 0
        //|| evt.ctrlKey
        || evt.shiftKey
        || evt.altKey
        || item.shapes?.some(s => s.connector)
        || shape?.name !== 'knob'
      )
        return;

      let inc = this.range * .1,
        newStatus = this.status;
      if (evt.ctrlKey)
        newStatus = Math.max(this.min, this.status - inc);
      else
        newStatus = Math.min(this.max, this.status + inc);

      this.setStatus(newStatus);
      this.updateKnob();

      evt.preventDefault();
    }
  };
}