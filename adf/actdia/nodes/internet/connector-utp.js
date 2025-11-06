import ConnectorGeneric from './connector-generic.js';

export default class ConnectorUtp extends ConnectorGeneric {
  type = 'utp';
  accepts = [ 'in' ];
  multiple = false;
}
