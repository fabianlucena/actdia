import ConnectorGeneric from './connector-generic.js';

export default class ConnectorIn extends ConnectorGeneric {
  type = 'in';
  accepts = [ 'out' ];
  multiple = false;
}
