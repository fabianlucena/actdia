export default function create({ Node, actdia }) {
  actdia.globalData ??= {};
  actdia.globalData.labeledStatus ??= {};

  return class LabelInput extends Node {
    static label = 'Label input';

    shape = {
      shapes: [
        {
          y: -.5,
          shape: 'path',
          d: 'M .5 0 H 5 V 1 H .5 L 0 .5 L 0.5 0',
        },
        {
          shape: 'text',
          y: -.5,
          x: .5,
          width: 4.5,
          height: 1,
          text: 'No name',
        }
      ],
    };

    name = 'No name';

    box = {
      x: 0,
      y: -.5,
      width: 5,
      height: 1,
    };

    connectors = [
      { name: 'i', type: 'in', x: 0, y: 0, direction: 'left', extends: 'tiny' },
    ];

    update() {
      this.shape.shapes[1].text = this.name;
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[1], this.shape.shapes[1]);
    }

    updateStatus(options = {}) {
      this.setStatus(this.connectors.find(c => c.type === 'in')?.status, options);
    }

    statusUpdated() {
      super.statusUpdated();
      actdia.globalData.labeledStatus[this.name] = this.status;
      actdia.globalData.labeledStatusUpdated?.(this.name);
    }
 };
}