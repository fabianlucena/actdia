export default function create({ Node }) {
  return class LabelOutput extends Node {
    static label = 'Label output';

    shape = {
      shapes: [
        {
          y: -.5,
          shape: 'path',
          d: 'M 0 0 H 4.5 L 5 .5 L 4.5 1 H 0 Z',
        },
        {
          shape: 'text',
          y: -.5,
          x: 0,
          width: 4.5,
          height: 1,
          text: 'No name name',
        }
      ],
    };

    name = 'No name 1';

    box = {
      x: 0,
      y: -.5,
      width: 5,
      height: 1,
    };

    update() {
      this.shape.shapes[1].text = this.name;
      this.actdia.tryUpdateShape(this, this.svgShape?.children?.[1], this.shape.shapes[1]);
    }

    connectors = [
      { name: 'o', type: 'out', x: 5, y: 0, direction: 'right', extends: 'tiny' },
    ];
 };
}