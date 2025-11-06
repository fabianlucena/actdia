import Not from './not.js';

export default class IEEENot extends Not {
  static label = 'IEEE Not';

  shape = {
    shapes: [
      {
        shape: 'rect',
        x: 0,
        width: 1.2,
        height: 2,
      },
      {
        shape: 'text',
        x: 0,
        width: 1.2,
        height: 2,
        text: '1',
      },
      {
        shape: 'circle',
        x: 1.6,
        y: 1,
        r: .4,
      },
    ],
  };
}