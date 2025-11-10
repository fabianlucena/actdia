import Item from './item.js';

export function isConnection(item) {
  return item instanceof Connection || item.constructor.name === 'Connection';
}

export default class Connection extends Item {
  draggable = false;

  shape = {
    shape: 'path',
    d: 'M0 0 L1 1',
    fill: 'none',
  };

  noSelectionBox = true;
  noNameText = true;

  init({ from, to, items, ...rest } = {}) {
    from && this.setFrom(from, items);
    to && this.setTo(to, items);

    super.init(rest);

    this.update();
  }

  setFrom(from, items) {
    if (!from?.item)
      throw new Error('Connection "from" item is required');

    if (typeof from.item === 'string') {
      from.item = items.find(i => i.id === from.item);
      if (!from.item)
        throw new Error('Connection "from" item not found');
    }

    if (typeof from.connector === 'string') {
      from.connector = from.item.getConnectorFromId(from.connector);
      if (!from.connector)
        throw new Error('Connector "from" not found');
    }

    from.connector.addConnection(this);

    this.from = from;
  }

  setTo(to, items) {
    if (!to?.item && to !== 'mouse')
      throw new Error('Connection "to" item, or "mouse" is required');

    if (to !== 'mouse') {
      if (typeof to.item === 'string') {
        to.item = items.find(i => i.id === to.item);
        if (!to.item)
          throw new Error('Connection "to" item not found');
      }

      if (typeof to.connector === 'string') {
        to.connector = to.item.getConnectorFromId(to.connector);
        if (!to.connector)
          throw new Error('Connector "to" not found');
      }

      to.type ??= to.connector.type;
      to.index ??= to.connector.index;
      to.connector.addConnection(this);
    }

    this.to = to;
  }

  removeReferencedItem(item) {
    if (this.from && this.from.item === item) {
      this.from.connector.removeConnection(this);
      this.from = null;
    }

    if (this.to && this.to.item === item) {
      this.to.connector.removeConnection(this);
      this.to = null;
    }
  }

  removeReferences() {
    if (this.from && this.from.item) {
      this.from.connector.removeConnection(this);
      this.from = null;
    }

    if (this.to && this.to.item) {
      this.to.connector.removeConnection(this);
      this.to = null;
    }
  }

  getData() {
    const elementClass = this.constructor.name;
    return {
      elementClass,
      url: this.getElementClassUrl(),
      id: this.id,
      from: {
        connector: this.from.connector.id,
        item: this.from.item.id,
      },
      to: {
        connector: this.to.connector.id,
        item: this.to.item?.id,
      },
    };
  }

  update({ mouse } = {}) {
    this.x = 0;
    this.y = 0;

    if (!this.from || !this.to || this.to === 'mouse' && !mouse) {
      return;
    }

    if (!this.from.item.svgElement.getCTM) {
      return;
    }

    const 
      fromCtm = this.from.item.svgElement.getCTM?.(),
      fx = fromCtm.e / this.actdia.style.sx + this.from.connector.x,
      fy = fromCtm.f / this.actdia.style.sy + this.from.connector.y;
    if (isNaN(fx) || isNaN(fy)) {
      this.shape = {};
      return; 
    }

    const isMouse = this.to === 'mouse';
    let tx, ty;
    if (isMouse) {
      tx = mouse.x;
      ty = mouse.y;
    } else {
      const toCtm = this.to.item.svgElement.getCTM();
      tx = toCtm.e / this.actdia.style.sx + (this.to.connector.x ?? 0);
      ty = toCtm.f / this.actdia.style.sy + (this.to.connector.y ?? 0);
    }
    if (isNaN(tx) || isNaN(ty)) {
      this.shape = {};
      return; 
    }

    const
      dx = tx - fx,
      dy = ty - fy,
      dd = Math.pow(dx * dx + dy * dy, 1 / 2) / 3,
      x1 = fx + dd * Math.cos(this.from.connector.direction / 180 * Math.PI),
      y1 = fy - dd * Math.sin(this.from.connector.direction / 180 * Math.PI);

    let d;
    if (isMouse) {
      d = `M ${fx} ${fy} Q ${x1} ${y1} ${tx} ${ty}`;
    } else {
      const
        x2 = tx + dd * Math.cos(this.to.connector.direction / 180 * Math.PI),
        y2 = ty - dd * Math.sin(this.to.connector.direction / 180 * Math.PI);
      d = `M ${fx} ${fy} C ${x1} ${y1} ${x2} ${y2} ${tx} ${ty}`;
    }

    this.shape = {
      shape: 'path',
      d,
    };

    this.actdia.tryUpdateShape(this, this.svgElement?.children[0], this.shape);
  }

  setStatus(status, options) {
    if (!options.connectors.has(this.from.connector)) {
      this.from.connector.setStatus(status, options);
    }

    if (!options.connectors.has(this.to.connector) && this.to !== 'mouse') {
      this.to.connector.setStatus(status, options);
    }
  }
}
