import And from './and.js';

export default class IEEEAnd extends And {
  static label = 'IEEE And';

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
        text: '&',
      },
    ],
  };
}