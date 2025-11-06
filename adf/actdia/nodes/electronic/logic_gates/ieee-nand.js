import Nand from './nand.js';

export default class IEEENand extends Nand {
  static label = 'IEEE Nand';

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
        text: '&',
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