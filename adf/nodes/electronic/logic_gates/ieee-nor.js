import Nor from './nor.js';

export default class IEEENor extends Nor {
  static label = 'IEEE Nor';

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
        text: '≥1',
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