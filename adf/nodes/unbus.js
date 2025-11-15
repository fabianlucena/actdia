export default function create({ Node }) {
  return class Unbus extends Node {
    static _label = 'Unbus';

    shape = {
      shape: 'rect',
      x: 0.2,
      y: 0.5,
      width: 0.6,
      height: 2,
      rx: .2,
      ry: .2,
    };

    box = {
      x: 0,
      y: 0.5,
      width: 1,
      height: 2,
    };

    connectors = [
      { name: 'i0', type: 'in', x: 0, y: 1, direction: 'left', extends: 'tiny' },
      { name: 'o0', type: 'out', x: 1, y: 1, direction: 'right', extends: 'tiny' },
      { name: 'o1', type: 'out', x: 1, y: 2, direction: 'right', extends: 'tiny' },
    ];

    defaultConnector = {
      type: 'out',
      x: 1,
      direction: 'right',
      extends: 'tiny',
    };

    formDefinition = [
      {
        name: 'length',
        type: 'number',
        min: 1,
        _label: 'Length',
      },
    ];

    get length() {
      return this.connectors.filter(c => c.type === 'out').length;
    }

    set length(value) {
      const newLength = this.length;
      if (value > newLength) {
        for (let i = newLength; i < value; i++) {
          this.addConnector();
        }
      } else if (value < newLength) {
        for (let i = value; i < newLength; i++) {
          this.removeLastOutput();
        }
      }
    }

    update() {
      const height = Math.max(this.length, 1);
      this.box.height = height;
      this.shape.height = height;
      super.update();
    }

    getNewConnector(connector) {
      const newConnector = super.getNewConnector(connector);
      newConnector.y ??= newConnector.index + 1;
      newConnector.name ??= `o${newConnector.index}`;
      return newConnector;
    }

    updateStatus(options = {}) {
      this.setStatus(this.connectors.find(c => c.type === 'in')?.status, options);
    }

    propagate(options = {}) {
      this.connectors
        .filter(c => c.type === 'out')
        .forEach((c, i) => c.setStatus(this.status[i], options));
    }
  };
}