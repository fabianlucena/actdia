import Xor from './xor.js';

export default class IEEEXor extends Xor {
  static label = 'IEEE Xor';

  shape = {
    shapes: [
      {
        shape: 'rect',
        x: 0,
        width: 4, 
        height: 4,
      },
      {
        shape: 'text',
        x: 0,
        width: 4,
        height: 4,
        text: '=1',
      },
    ],
  };
}