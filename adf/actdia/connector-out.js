import ConnectorGeneric from './connector-generic.js';

export default class ConnectorOut extends ConnectorGeneric {
  type = 'out';
  accepts = [ 'in' ];
}
