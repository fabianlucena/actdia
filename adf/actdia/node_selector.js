import './node-selector.css';
import Item from './item.js';
import Dialog from './dialog.js';
import { _, loadLocale } from './locale.js';

export default class NodeSelector extends Dialog {
  breadcrumbsContainer = null;
  categoriesContainer = null;
  classesContainer = null;

  breadcrumbs = [];
  categories = [];
  nodesClasses = [];

  constructor({ container, actdia }) {
    super(...arguments);
    this.actdia = actdia;

    this.contentElement.innerHTML = '<div class="actdia-node-selector-breadcrumbs" ></div>'
      + '<div class="actdia-node-selector-categories" ></div>'
      + '<div class="actdia-node-selector-classes" ></div>';

    this.breadcrumbsContainer = this.contentElement.querySelector('.actdia-node-selector-breadcrumbs');
    this.categoriesContainer = this.contentElement.querySelector('.actdia-node-selector-categories');
    this.classesContainer = this.contentElement.querySelector('.actdia-node-selector-classes');

    this.breadcrumbsContainer.addEventListener('click', evt => {
      evt.stopPropagation();
      evt.preventDefault();

      const breadcrumbDiv = evt.target.closest('.actdia-node-breadcrumb');
      if (breadcrumbDiv?.dataset?.url) {
        loadCategory({
          path: breadcrumbDiv.dataset.url,
          previousBreadcrumbs: breadcrumbs.filter(b => b.url.length < breadcrumbDiv.dataset.url.length),
          namespace: breadcrumbDiv.dataset.namespace + '.',
        });
      }
    });

    this.categoriesContainer.addEventListener('click', evt => {
      evt.stopPropagation();
      evt.preventDefault();

      const categoryDiv = evt.target.closest('.actdia-node-category');
      if (categoryDiv?.dataset?.url) {
        this.loadCategory({
          path: categoryDiv.dataset.url,
          previousBreadcrumbs: [...this.breadcrumbs],
          namespace: categoryDiv.dataset.namespace + '.',
        });
      }
    });

    this.classesContainer.addEventListener('click', evt => this.classesClickHandler(evt));
  }

  show(options) {
    this.x = options.x;
    this.y = options.y;
    super.show(
      {
        header: _('Add node'),
        okButton: false,
        cancelButton: false,
        closeButton: true,
      },
      ...arguments
    );
    this.loadCategory({ path: './nodes', namespace: 'nodes.' });
  }

  async loadCategory({ path, previousBreadcrumbs = [], namespace = '' }) {
    const categoriesData = (await import(`${path}/categories.js`)).default;
    await loadLocale(path, ...categoriesData.locale);

    this.breadcrumbs = [
      ...previousBreadcrumbs,
      {
        _label: categoriesData._label,
        url: path,
        namespace,
      }
    ];

    this.categories = categoriesData.categories;
    this.nodesClasses = categoriesData.nodesClasses;

    this.update({ path, namespace });
  }

  async update({ path, namespace }) {
    this.breadcrumbsContainer.innerHTML = this.breadcrumbs
      .map(b => '<div'
          + ` class="actdia-node-breadcrumb"`
          + ` data-url="${b.url}"`
        + ` >${_(b._label)}</div>`)
      .join('');

    this.categoriesContainer.innerHTML = this.categories
      ?.map(c => '<div'
          + ` class="actdia-node-category"`
          + ` data-url="${path}/${c.url}"`
          + ` data-namespace="${namespace + (c.namespace || c.url)}"`
        + ` >${_(c._label)}</div>`)
      .join('') || '';

    const options = {
      width: 170,
      height: 90,
      padding: 10,
    };

    const urls = this.nodesClasses.map(c => `${path}/${c}`);
    const clasesInfo = await Item.importAsync(...urls);

    this.classesContainer.innerHTML = clasesInfo
      .map(classInfo => {
        const itemOptions = {};
        const item = Item.create(classInfo);

        itemOptions.sx = Math.min(
          (options.width -  options.padding * 2) / item.box.width,
          (options.height - options.padding * 2) / item.box.height,
        );
        itemOptions.sx *= 1;
        itemOptions.sy = itemOptions.sx;
        item.x = (options.width /  (2 * itemOptions.sx) - (item.box.x + item.box.width  / 2));
        item.y = (options.height / (2 * itemOptions.sy) - (item.box.y + item.box.height / 2));

        let html = `<div
            class="actdia-node-class"
            data-fqcn="${classInfo.fqcn}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}">
              ${this.actdia.getItemSVG(item, itemOptions)}
            </svg>
            <div
              class="actdia-node-class-name"
            >
              ${_(classInfo._label)}
            </div>
          </div>`;
        return html;
      })
      .filter(html => html)
      .join('');
  }

  classesClickHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const classDiv = evt.target.closest('.actdia-node-class');
    const fqcn = classDiv?.dataset?.fqcn;
    if (fqcn) {
      this.actdia.addItem({
        fqcn,
        x: this.x,
        y: this.y,
      });
    }
    this.close();
  }
}