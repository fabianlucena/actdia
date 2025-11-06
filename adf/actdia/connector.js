import ConnectorGeneric from './connector-generic.js';
import ConnectorIn from './connector-in.js';
import ConnectorOut from './connector-out.js';

export default class Connector {
  static create(options) {
    let type;
    for (let i = arguments.length - 1; i >= 0; i--) {
      const element = arguments[i];
      if (element?.time) {
        type = element.type;
        break;
      }
    }

    [...arguments].forEach(element => type = element?.type || type);
    let creator;
    switch (type) {
      case 'in':
        creator = ConnectorIn;
        break;

      case 'out':
        creator = ConnectorOut;
        break;

      default:
        creator = ConnectorGeneric;
        break;
    }
    
    return new creator(...arguments);
  }
}
