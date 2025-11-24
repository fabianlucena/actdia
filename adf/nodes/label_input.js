export default function create({ Node }) {
  return class LabelInput extends Node {
    static label = 'Label input';

    shape = {
      shapes: [
        {
          y: -.5,
          shape: 'path',
          d: 'M .5 0 H 5 V 1 H .5 L 0 .5 L 0.5 0',
        },
        {
          shape: 'text',
          y: -.5,
          x: .5,
          width: 4.5,
          height: 1,
          text: 'No name',
        }
      ],
    };

    name = 'No name';

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
      { name: 'i', type: 'in', x: 0, y: 0, direction: 'left', extends: 'tiny' },
    ];
 };
}