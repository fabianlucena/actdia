import Xnor from './xnor.js';

export default class IEEEXnor extends Xnor {
  static label = 'IEEE Xnor';

  shape = {
    shapes: [
      {
        shape: 'rect',
        x: 0,
        width: 3.2, 
        height: 4,
      },
      {
        shape: 'text',
        x: 0,
        width: 3.2,
        height: 4,
        text: '=1',
      },
      {
        shape: 'circle',
        x: 3.6,
        y: 2,
        r: .4,
      },
    ],
  };
}