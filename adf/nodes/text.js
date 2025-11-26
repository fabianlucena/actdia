export default function create({ Node }) {
  return class Text extends Node {
    shape = {
      shapes: [
        {
          shape: 'rect',
          rx: .2,
          ry: .2,
        },
        {
          shape: 'text',
          text: '¡Hola mundo!',
          lineSpacing: 1.0,
          y: 1,
        },
      ],
    };

    box = {
      x: 0,
      y: 0,
      width: 10,
      height: 2,
    };

    connectors = [];

    formDefinition = [
      {
        name: 'text',
        type: 'textarea',
        _label: 'Text',
      },
      {
        name: 'autoSize',
        type: 'checkbox',
        _label: 'Auto size',
      },
      {
        name: 'shapes[0].rx',
        type: 'number',
        step: 0.1,
        _label: 'Border radius x',
      },
      {
        name: 'shapes[0].ry',
        type: 'number',
        step: 0.1,
        _label: 'Border radius y',
      },
      {
        name: 'padding.top',
        type: 'number',
        step: 0.1,
        _label: 'Padding top',
      },
      {
        name: 'padding.right',
        type: 'number',
        step: 0.1,
        _label: 'Padding right',
      },
      {
        name: 'padding.bottom',
        type: 'number',
        step: 0.1,
        _label: 'Padding bottom',
      },
      {
        name: 'padding.left',
        type: 'number',
        step: 0.1,
        _label: 'Padding left',
      },
    ];

    _autoSize = true;
    _padding = {
      top: 0.5,
      right: 0.5,
      bottom: 0.5,
      left: 0.5,
    };

    get autoSize() {
      return this._autoSize;
    }
    
    set autoSize(value) {
      if (this._autoSize !== value) {
        this._autoSize = value
        this.update();
      }
    }

    get text() {
      return this.shape.shapes[1].text;
    }
    
    set text(value) {
      if (this.shape.shapes[1].text !== value) {
        this.shape.shapes[1].text = value;
        this.update();
      }
    }

    get padding() {
      return this._padding;
    }

    set padding(value) {
      if (this._padding !== value) {
        this._padding = value;
        this.update();
      }
    }

    update() {
      super.update();

      if (this.autoSize && this.svgShape) {
        const bbox = this.svgShape.children[1].getBBox();
        this.box.width = bbox.width / this.actdia.style.sx + this.padding.right + this.padding.left;
        this.box.height = bbox.height / this.actdia.style.sy + this.padding.top + this.padding.bottom;
        this.shape.shapes[0].width = this.box.width;
        this.shape.shapes[0].height = this.box.height;
      }
    }
  };
}
