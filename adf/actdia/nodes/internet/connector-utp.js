import Connector from '../../connector.js';

export default class ConnectorUtp extends Connector {
  type = 'utp';
  accepts = [ 'in' ];
  multiple = false;
}
