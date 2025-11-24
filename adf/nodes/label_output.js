export default function create({ Node, actdia }) {
  actdia.globalData ??= {};
  actdia.globalData.labeledStatus ??= {};
  actdia.globalData.labeledStatusUpdated ??= name => {
    const outputs = actdia.items
      .filter(i => i.elementClass === 'LabelOutput' && i.name === name);

    
    const status = actdia.globalData.labeledStatus[name];
    outputs.forEach(item => {
      item.updateStatus(status);
    });
  };

  return class LabelOutput extends Node {
    static label = 'Label output';

    shape = {
      shapes: [
        {
          y: -.5,
          shape: 'path',
          d: 'M 0 0 H 4.5 L 5 .5 L 4.5 1 H 0 Z',
        },
        {
          shape: 'text',
          y: -.5,
          x: 0,
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
      { name: 'o', type: 'out', x: 5, y: 0, direction: 'right', extends: 'tiny' },
    ];

    construct() {
      super.construct();
      window.labeledStatus[this.name] = null;
    }

    update() {
      this.shape.shapes[1].text = this.name;
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[1], this.shape.shapes[1]);
    }

    updateStatus(newStatus, options = {}) {
      this.setStatus(newStatus, options);
    }

    statusUpdated() {
      super.statusUpdated(...arguments);
      this.updateForStatus();
    }

    updateForStatus() {
      const shape = this.shape.shapes[0] ??= {};
      if (isNaN(this.status)) {
        shape.className = 'updated';
        setTimeout(() => {
          if (shape.className === 'updated') {
            shape.className = '';
            this.actdia?.tryUpdateShape(this, this.svgShape?.children?.[0], this.shape.shapes[0]);
          }
        }, 250);
      } else {
        if (this.status > 0.5) {
          shape.className = 'hi';
        } else {
          shape.className = 'lo';
        }
      }

      this.actdia?.tryUpdateShape(this, this.svgShape?.children?.[0], this.shape.shapes[0]);
    }
 };
}