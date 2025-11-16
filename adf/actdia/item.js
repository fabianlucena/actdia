import Element from './element.js';
import { isEqual } from './utils.js';

export default class Item extends Element {
  shapes = [];

  box = {
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  };

  #selected = false;

  get selected() {
    return this.#selected;
  }

  set selected(value) {
    if (this.#selected === value)
      return;

    this.#selected = value;
    this.svgElement?.classList.toggle('actdia-selected', value);
  }

  get skipExport() {
    return [
      'shape',
      'svgElement',
      'svgShape',
      'svgSelectionBox',
      'actdia',
      'status'
    ];
  }

  get coords() {
    return [this.x, this.y];
  }

  set coords(coords) {
    if (typeof coords === 'string') {
      coords = coords.replace(/\[|\]|\s/g, '').split(',').map(s => parseFloat(s));
    }
    
    if (Array.isArray(coords) && coords.length === 2) {
      const [x, y] = coords;
      if (!isNaN(x)) this.x = x;
      if (!isNaN(y)) this.y = y;
      this.updateTransform();
    }

    if (coords instanceof Object) {
      if (!isNaN(coords.x)) this.x = coords.x;
      if (!isNaN(coords.y)) this.y = coords.y;
      this.updateTransform();
    }
  }

  get reflection() {
    if (this.sx < 0) {
      if (this.sy < 0) {
        return [-1, -1];
      }
      return [-1, 1];
    }

    if (this.sy < 0) {
      return [1, -1];
    }

    return;
  }

  set reflection(scale) {
    if (typeof scale === 'string') {
      scale = scale.replace(/\[|\]|\s/g, '').split(',').map(s => parseFloat(s));
    }
    const [sx, sy] = scale;

    if (sx < 0) {
      if (isNaN(this.sx))
        this.sx = -1;
      else if (this.sx > 0)
        this.sx = -this.sx;
    } else if (sx > 0) {
      if (isNaN(this.sx))
        this.sx = 1;
      else if (this.sx < 0)
        this.sx = -this.sx;
    }

    if (sy < 0) {
      if (isNaN(this.sy))
        this.sy = -1;
      else if (this.sy > 0)
        this.sy = -this.sy;
    } else if (sy > 0) {
      if (isNaN(this.sy))
        this.sy = 1;
      else if (this.sy < 0)
        this.sy = -this.sy;
    }

    this.updateTransform();
  }

  get rotate() {
    return this._rotate || 0;
  }

  set rotate(angle) {
    this._rotate = angle;
    this.updateTransform();
  }

  init(options) {
    super.init(...arguments);
    this.id ??= crypto.randomUUID();
  }

  clone() {
    return new this.constructor(this);
  }

  getData(options = {}) {
    const elementClass = this.constructor.name;
    const data = {
      elementClass,
      url: this.getElementClassUrl(),
      id: this.id,
    };

    const defaultItem = this.getDefaultObject();
    for (const key in this) {
      if (this.skipExport.includes(key)
        || options.skip?.includes(key)
        || key === 'id'
        || key === 'elementClass'
      )
        continue;

      const value = this[key];
      const defaultValue = defaultItem[key];

      if (!isEqual(value, defaultValue)) {
        data[key] = value;
      }
    }

    return data;
  }

  removeReferencedItems(...items) {
    items.forEach(item => this.removeReferencedItem(item));
  }

  removeReferencedItem(item) {}

  removeReferences() {}

  setStatus(status, options = {}) {
    if (JSON.stringify(this.status) === JSON.stringify(status))
      return;

    this.status = status;
    this.statusUpdated(options);
  }

  setBackStatus(backStatus, options = {}) {
    if (JSON.stringify(this.backStatus) === JSON.stringify(backStatus))
      return;

    this.backStatus = backStatus;
    this.backStatusUpdated(options);
  }

  statusUpdated() {}

  backStatusUpdated() {}

  moveTo(to) {
    this.x = to.x;
    this.y = to.y;
    this.updateTransform();
  }

  updateTransform() {
    let transform = `translate(${this.x}, ${this.y})`;
    if (this.rotate) {
      transform += ` rotate(${this.rotate})`;
    }

    if ((!isNaN(this.sx) && this.sx) || (!isNaN(this.sy) && this.sy)) {
      transform += ` scale(${(this.sx) ?? 1}, ${(this.sy) ?? 1})`;
    }
    
    if (this.skewX) {
      transform += ` skewX(${this.skewX})`;
    }
    
    if (this.skewY) {
      transform += ` skewY(${this.skewY})`;
    }
    
    this.svgElement?.setAttribute('transform', transform.trim());
    this.connectors?.forEach(connector => {
      connector.connections.forEach(connection => connection.update());
    });
  }

  update(options = {}) {
    if (!options.skipNotification) {
      this.updateTransform();
      this.actdia?.updateItem(this);
    }
  }

  updateBackStatus(options = {}) {
    if (!options.skipNotification) {
      this.updateTransform();
      this.actdia?.updateItem(this);
    }
  }

  select(selectValue = true) {
    this.selected = selectValue;
  }
}
