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

    static skipMatrix = ['matrix'];

    matrix = [];

    constructor(params) {
      super(params);
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

      const sy = 11 / status.length;
      const ssy = sy / 2;
      for (let i = 0; i < status.length; i++) {
        this.matrix[i] ??= [];
        this.matrix[i].push(status[i]);

        let shape = this.shape.shapes[2].shapes[i];
        if (!shape) {
          this.shape.shapes[2].shapes[i] = {
            shape: 'path',
            x: 0.5,
            fill: false,
            stroke: 'lime',
            strokeWidth: 1,
          };
          shape = this.shape.shapes[2].shapes[i];
        }
        shape.y = 1 + i * sy;

        let yy;
        shape.d = '';
        for (let k = 0; k < this.matrix[i].length; k++) {
          const x = k * 0.2;
          const y = (this.matrix[i][k] ?? 0) * ssy;
          if (x > 11) {
            this.matrix[i].shift();
            break;
          }

          if (k === 0) {
            shape.d += 'M';
          } else {
            shape.d += `L ${x} ${yy} L`;
          }
          shape.d += `${x} ${y} `;
          yy = y;
        }

        if (this.svgShape?.children?.[i]) {
          this.actdia.tryUpdateShape(
            this,
            svgElement?.children?.[i],
            shape
          );
        } else {
          this.update();
        }
      }
    }
  };
}