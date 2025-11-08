import Element from './element.js';
import { isEqual } from './utils.js';

export function isItem(item) {
  return item instanceof Item || item.constructor.name === 'Item';
}

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
    this.update(options);
  }

  statusUpdated() {}

  moveTo(to) {
    this.x = to.x;
    this.y = to.y;

    this.svgElement?.setAttribute('transform', `translate(${to.x * this.actdia.style.sx} ${to.y * this.actdia.style.sy})`);
  }

  update(options = {}) {
    if (!options.skipNotification)
      this.actdia?.updateItem(this);
  }

  select(selectValue = true) {
    this.selected = selectValue;
  }
}
