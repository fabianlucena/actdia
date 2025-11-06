
const registry = {};

export default class Element {
  static registerClass(info) {
    const elementClass = info.elementClass;
    let namespace = info.classRef.namespace || '';
    const classInfo = { ...info, namespace };
    classInfo._label ??= info.classRef._label ?? info.classRef.label ?? elementClass;

    if (namespace)
      namespace += '.';

    registry[namespace + elementClass] = classInfo;

    return namespace + elementClass;
  }

  static getRegisteredClassesInfo() {
    return Object.values(registry);
  }

  static async importAsync(...urls) {
    const result = await Promise.all(urls.map(async url => {
      const module = await import(url);
      if (typeof module.default === 'function') {
        const classRef = module.default;
        const elementClass = classRef.name;
        return this.registerClass({
          elementClass,
          classRef,
          url,
        });
      }
    }));

    return result;
  }

  static async importForDataAsync(data) {
    let classRef = registry[data.elementClass]?.classRef;
    if (!classRef) {
      if (data.url) {
        await this.importAsync(data.url);
      }
    }

    return classRef;
  }

  static getElementClassInfo(elementClass) {
    let classInfo = registry[elementClass];
    if (classInfo) {
      return classInfo;
    }

    const ref = { elementClass: this };

    classInfo ??= {};
    registry[elementClass] = classInfo;

    classInfo.elementClass ??= elementClass;
    classInfo.classRef ??= ref.elementClass;

    return classInfo;
  }

  static getElementClassRef(elementClass) {
    const classInfo = this.getElementClassInfo(elementClass);
    return classInfo?.classRef;
  }

  static create(data) {
    if (typeof data === 'string') {
      data = { elementClass: data };
    }

    const classRef = data.elementClass ?
      Element.getElementClassRef(data.elementClass) : Element;

    if (!classRef) {
      throw new Error(`Element class ${data.elementClass} not found`);
    }

    const obj = new classRef();
    obj.init(data, ...[...arguments].slice(1));

    return obj;
  }

  static async loadAndCreateAsync(data) {
    await Element.importForDataAsync(data);
    return Element.create(data);
  }

  static getDefaultObject(elementClass) {
    const classInfo = this.getElementClassInfo(elementClass);
    if (!classInfo.defaultItem) {
      classInfo.defaultItem = new classInfo.classRef();
    }

    return classInfo.defaultItem;
  }

  constructor(options) {
    this.init(...arguments);
  }

  init(options) {
    Object.assign(this, ...arguments);
  }

  getElementClass() {
    return this.constructor.name;
  }

  isElementClass(elementClass) {
    return elementClass === this.getElementClass();
  }

  getElementClassInfo() {
    return Element.getElementClassInfo(this.getElementClass());
  }

  getElementClassRef() {
    return this.getElementClassInfo()?.classRef;
  }

  getElementClassUrl() {
    return this.getElementClassInfo()?.url;
  }

  getDefaultObject() {
    return Element.getDefaultObject(this.getElementClass());
  }
}