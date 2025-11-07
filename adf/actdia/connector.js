import Element from './element.js';
import { _ } from './locale.js';
import { doesExtend } from './utils.js';

const PI_0 = 0;
const PI_1_2 = Math.PI * 1 / 2;
const PI = Math.PI;
const PI_3_2 = Math.PI * 3 / 2;

export const DIRECTIONS = {
  RIGHT: PI_0,
  DOWN: PI_3_2,
  LEFT: PI,
  UP: PI_1_2,
};

export default class Connector extends Element {
  static connectorsClassesInfo = {};

  static create(options) {
    let type;
    for (let i = arguments.length - 1; i >= 0; i--) {
      const argument = arguments[i];
      if (argument?.type) {
        type = argument.type;
        break;
      }
    }

    let classInfo = Connector.connectorsClassesInfo[type];
    if (!classInfo) {
      const registeredClasses = Element.getRegisteredClassesInfo();
      for (const thisClassInfo of registeredClasses) {
        if (doesExtend(thisClassInfo.classRef, Connector)) {
          const classType = new thisClassInfo.classRef().type;
          if (classType === type) {
            classInfo = thisClassInfo;
            Connector.connectorsClassesInfo[type] = thisClassInfo;
            break;
          }
        }
      }

      if (!classInfo) {
        throw new Error(_('No Connector class registered for type: %s.', type));
      }
    }

    return Element.create(classInfo, ...arguments);
  }

  connections = [];

  init(options) {
    super.init(...arguments);
    this.id ??= crypto.randomUUID();
    this.direction = this.getDirection(this.direction, 'left');
    if (typeof this.name === 'function') {
      this.name = this.name(this);
    }
  }

  getDirection(direction, defaultDirection) {
    if (typeof direction === 'number') {
      if (isNaN(direction) || !isFinite(direction))
          return this.getDirection(defaultDirection, PI_1_2);

      return direction;
    }

    if (typeof direction === 'function')
      return direction();

    if (typeof direction === 'string') {
      switch (direction) {
        case 'right': return PI_0;
        case 'bottom':
        case 'down': return PI_3_2;
        case 'left': return PI;
        case 'top':
        case 'up': return PI_1_2;
      }
    }

    return this.getDirection(defaultDirection, PI_1_2);
  }

  addConnection(item) {
    this.connections ||= [];
    this.connections.push(item);
  }

  removeConnection(item) {
    this.connections = (this.connections || []).filter(i => i !== item);
  }

  setStatus(status, options = {}) {
    if (JSON.stringify(this.status) === JSON.stringify(status))
      return;

    this.status = status;
    if (this.type === 'in' && this.item)
      this.item.updateStatus(options);

    this.propagate(options);
  }

  propagate(options = {}) {
    options ??= {};
    const connectors = new Set([...options.connectors || []]);
    if (connectors?.has(this)) {
      this.actdia.pushNotification(_('Circular propagation detected, stopping.'), 'warning');
      return;
    }

    this.connections.forEach(connection => {
      options.connectors = new Set([...connectors, this]);
      connection.setStatus(this.status, options);
    });
  }
}
