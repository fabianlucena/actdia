import Node from '../../node.js';

export default class Perceptron extends Node {
  shape = {
    shapes: [
      {
        shape: 'circle',
        x: 1,
        y: 1,
        r: 1,
      },
      {
        shape: 'text',
        text: 'Σ',
      },
    ],
  };

  box = {
    x: 0,
    y: 0,
    width: 2,
    height: 2,
  };

  connectors = [
    { name: 'o0', type: 'out', x: 2, y: 1, direction: 'right', extends: 'tiny' },
    { name: 'i0', type: 'in',  x: 0, y: 1, direction: 'left',  extends: 'tiny' },
  ];

  defaultConnector = {
    type: 'in',
    x: 0,
    y: 0,
    direction: 'left',
    extends: 'tiny',
    name: ({ index }) => `i${index}`,
  };

  formDefinition = [
    {
      name: 'inputsCount',
      type: 'number',
      min: 1,
      _label: 'Inputs count',
    },
  ];

  get inputsCount() {
    return this.connectors.filter(c => c.type === 'in').length;
  }

  set inputsCount(value) {
    const newInputsCount = this.inputsCount;
    if (value > newInputsCount) {
      for (let i = newInputsCount; i < value; i++) {
        this.addConnector();
      }
    } else if (value < newInputsCount) {
      for (let i = value; i < newInputsCount; i++) {
        this.removeLastInput();
      }
    }
  }

  getNewConnector(connector) {
    return super.getNewConnector({ index: this.inputsCount }, ...arguments);
  }

  update() {
    const inputs = this.connectors.filter(c => c.type === 'in'),
      l = inputs.length - 1,
      z = 15,
      n = l > z ? l : 1 + (z - 1) * Math.pow(l / z, 0.7),
      angleInc = (Math.PI * 2 * .8 ) / n,
      angleFrom = (Math.PI - angleInc * l) / 2;

    for (let i = 0, a = angleFrom; i < inputs.length; i++, a += angleInc) {
      const input = inputs[i];
      input.x = 1 - Math.sin(a);
      input.y = 1 - Math.cos(a);
    }

    super.update();
  }

  updateStatus(options = {}) {
    this.setStatus([...this.connectors.filter(c => c.type === 'in').map(c => c.status)], options);
  }
}