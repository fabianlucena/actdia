import Node from '../../node.js';
import { _ } from '../../locale.js';

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
    {
      name: 'activationFunction',
      type: 'string',
      _label: 'Activation function',
      options: [
        { value: 'x => Math.max(0, x)', label: _('ReLU'), title: _('Rectified Linear Unit: f(x) = x for x > 0, else 0') },
        { value: 'x => 1 / (1 + Math.exp(-x))', label: _('Sigmoid'), title: _('Sigmoid function: f(x) = 1 / (1 + e^(-x))') },
        { value: 'x => (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x))', label: _('Tanh'), title: _('Hyperbolic Tangent: f(x) = (e^x - e^(-x)) / (e^x + e^(-x))') },
        { value: 'x => x', label: _('Identity'), title: _('Identity function: f(x) = x') },
        { value: 'x => x >= 0 ? 1 : 0', label: _('Step'), title: _('Step function: f(x) = 1 for x >= 0, else 0') },
        { value: 'x => Math.exp(x) / Math.sum(Math.exp(x))', label: _('Softmax'), title: _('Softmax function: f(x) = e^(x_i) / Σ e^(x_j) for all j') },
        { value: 'x => x < 0 ? 0 : x > 1 ? 1 : x', label: _('Clamped'), title: _('Clamped function: f(x) = 0 for x < 0, f(x) = 1 for x > 1, else f(x) = x') },
        { value: 'x => Math.max(-1, Math.min(1, x))', label: _('Clamped Symmetric'), title: _('Clamped Symmetric function: f(x) = -1 for x < -1, f(x) = 1 for x > 1, else f(x) = x') },
        { value: 'x => x > 0 ? x : 0.01 * x', label: _('Leaky ReLU'), title: _('Leaky Rectified Linear Unit: f(x) = x for x > 0, else 0.01 * x') },
        { value: 'x => x >= 0 ? x : (Math.exp(x) - 1)', label: _('ELU'), title: _('Exponential Linear Unit: f(x) = x for x >= 0, else e^x - 1') },
        { value: 'x => x >= 0 ? 1.0507 * x : 1.0507 * (Math.exp(x) - 1)', label: _('SELU'), title: _('Scaled Exponential Linear Unit: f(x) = 1.0507 * x for x >= 0, else 1.0507 * (e^x - 1)') },
        { value: 'x => x / (1 + Math.exp(-x))', label: _('Swish / SiLU'), title: _('Swish / Sigmoid Linear Unit: f(x) = x / (1 + e^(-x))') },
        { value: 'x => 0.5 * x * (1 + Math.tanh(0.5 * x))', label: _('GELU'), title: _('Gaussian Error Linear Unit: f(x) = 0.5 * x * (1 + tanh(0.5 * x))') },
        { value: 'x => x * (1 - x)', label: _('Derivative of Sigmoid'), title: _('Derivative of Sigmoid function: f(x) = x * (1 - x)') },
        { value: 'x => 1 - x * x', label: _('Derivative of Tanh'), title: _('Derivative of Tanh function: f(x) = 1 - x^2') },
        { value: 'x => 1 - Math.pow(x, 2)', label: _('Derivative of Clamped'), title: _('Derivative of Clamped function: f(x) = 1 - x^2') },
        { value: 'x => (x >= 0 && x <= 1) ? 1 : 0', label: _('Derivative of Step'), title: _('Derivative of Step function: f(x) = 0 for all x except at x = 0 where it is undefined') },
      ],
    },
    {
      name: 'bias',
      type: 'number',
      _label: 'Bias',
      step: 'any',
    },
    {
      name: 'weights',
      type: 'list',
      _label: 'Weights',
      item: {
        type: 'number',
        step: 'any',
      },
    }
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

  weights = [];
  #activationFunction = x => Math.max(0, x);

  set activationFunction(func) {
    if (typeof func === 'string') {
      func = eval(func);
    }

    this.#activationFunction = func;
  }

  get activationFunction() {
    return this.#activationFunction;
  }

  getData() {
    return {
      ...super.getData(),
      activationFunction: this.activationFunction.toString(),
    };
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
      input.direction = a + Math.PI / 2;

      input.connections?.forEach(conn => conn.update());
    }

    this.weights ??= [];
    this.weights = this.weights?.slice(0, inputs.length);
    if (this.weights.length < inputs.length) {
      for (let i = this.weights.length; i < inputs.length; i++) {
        this.weights.push(Math.random() * 10 - 5);
      }
    }

    super.update();
  }

  updateStatus(options = {}) {
    const status = this.connectors.filter(c => c.type === 'in')
      .map((c, index) => (c.status ?? 0) * (this.weights[index] ?? 0))
      .reduce((a, b) => a + b, 0) + (this.bias ?? 0);

    this.setStatus(status, options);
  }
}