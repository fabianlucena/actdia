export default function create({ Node }) {
  return class Oscillograph extends Node {
    shape = {
      shapes: [
        {
          shape: 'rect',
          x: 0,
          y: 0,
          width: 12,
          height: 12,
          rx: .2,
          ry: .2,
        },
        {
          shape: 'rect',
          x: 0.5,
          y: 0.5,
          width: 11,
          height: 11,
          rx: .2,
          ry: .2,
          fill: 'black',
        },
        {
          x: 0.5,
          y: 0.5,
          shapes: [],
        }
      ],
    };

    box = {
      x: 0,
      y: 0,
      width: 12,
      height: 12,
    };

    connectors = [
      { name: 'i0', type: 'in', x: 0, y: 2, direction: 'left' },
    ];

    static skipExport = ['matrix'];

    matrix = [];
    #height = 6;
    #width = 20;

    constructor(params) {
      super(params);
    }

    update() {
      this.box.width = this.#width;
      this.box.height = this.#height;

      this.shape.shapes[0].width = this.#width;
      this.shape.shapes[0].height = this.#height;
      this.shape.shapes[1].width = this.#width - 1;
      this.shape.shapes[1].height = this.#height - 1;

      super.update();
    }

    updateStatus() {
      let status = this.connectors[0].status;
      if (!Array.isArray(status)) {
        status = [status];
      }

      while (this.shape.shapes[2].shapes.length > status.length) {
        this.shape.shapes[2].shapes.pop();
      }

      const svgElement = this.svgShape?.children?.[2];
      while (svgElement?.children?.length > status.length) {
        svgElement.removeChild(svgElement.children[svgElement.children.length - 1]);
      }

      const sy = (this.#height - 1) / status.length;
      const ssy = sy * .9;
      for (let i = 0; i < status.length; i++) {
        this.matrix[i] ??= [];
        this.matrix[i].push(status[i]);

        let shape = this.shape.shapes[2].shapes[i];
        if (!shape) {
          this.shape.shapes[2].shapes[i] = {
            shape: 'path',
            fill: false,
            stroke: 'lime',
            strokeWidth: 1,
          };
          shape = this.shape.shapes[2].shapes[i];
        }
        shape.y = i * sy + .1;

        shape.d = '';
        for (let k = 0; k < this.matrix[i].length; k++) {
          let value = this.matrix[i][k];
          if (value === true)
            value = 1;
          else if (value === false)
            value = 0;

          const x = k * 0.5;
          const y = value * ssy;
          if (x > this.#width - 1) {
            this.matrix[i].shift();
            break;
          }

          if (k === 0) {
            shape.d += `M ${x} ${y}`;
          } else {
            shape.d += ` H ${x} V ${y}`;
          }
        }

        if (this.svgShape?.children?.[1].children?.[i]) {
          this.actdia.tryUpdateShape(
            this,
            svgElement?.children?.[1].children?.[i],
            shape
          );
        } else {
          this.update();
        }
      }
    }
  };
}