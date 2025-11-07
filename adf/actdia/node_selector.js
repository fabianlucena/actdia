import './node-selector.css';
import Item from './item.js';
import { _, loadLocale } from './locale.js';

let actdia;
let container;
let breadcrumbs = [];
let categories = [];
let nodesClasses = [];
let breadcrumbsContainer;
let categoriesContainer;
let classesContainer;

export default function nodeSelector(actdiaInstance) {
  actdia = actdiaInstance;
  actdia.showDialog('<div class="actdia-node-selector-breadcrumbs" ></div>'
    + '<div class="actdia-node-selector-categories" ></div>'
    + '<div class="actdia-node-selector-classes" ></div>'
  );
  container = actdia.dialog.contentElement;
  breadcrumbsContainer = container.querySelector('.actdia-node-selector-breadcrumbs');
  categoriesContainer = container.querySelector('.actdia-node-selector-categories');
  classesContainer = container.querySelector('.actdia-node-selector-classes');

  breadcrumbsContainer.addEventListener('click', evt => {
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

  categoriesContainer.addEventListener('click', evt => {
    evt.stopPropagation();
    evt.preventDefault();

    const categoryDiv = evt.target.closest('.actdia-node-category');
    if (categoryDiv?.dataset?.url) {
      loadCategory({
        path: categoryDiv.dataset.url,
        previousBreadcrumbs: [...breadcrumbs],
        namespace: categoryDiv.dataset.namespace + '.',
      });
    }
  });

  loadCategory({ path: './nodes', namespace: 'nodes.' });
}

async function loadCategory({ path, previousBreadcrumbs = [], namespace = '' }) {
  const categoriesData = (await import(`${path}/categories.js`)).default;
  await loadLocale(path, ...categoriesData.locale);

  breadcrumbs = [
    ...previousBreadcrumbs,
    {
      _label: categoriesData._label,
      url: path,
      namespace,
    }
  ];

  categories = categoriesData.categories;
  nodesClasses = categoriesData.nodesClasses;

  update({ path, namespace });
}

async function update({ path, namespace }) {
  breadcrumbsContainer.innerHTML = breadcrumbs
    .map(b => '<div'
        + ` class="actdia-node-breadcrumb"`
        + ` data-url="${b.url}"`
      + ` >${_(b._label)}</div>`)
    .join('');

  categoriesContainer.innerHTML = categories
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

  const urls = nodesClasses.map(c => `${path}/${c}`);
  const clasesInfo = await Item.importAsync(...urls);

  classesContainer.innerHTML = clasesInfo
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
            ${actdia.getItemSVG(item, itemOptions)}
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
