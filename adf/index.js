import ActDia from './actdia/actdia.js';
import NodeSelector from './src/node_selector.js';
import Dialog from './src/dialog.js';
import { _ } from './actdia/locale.js';

let container = null;
let actdia = null;
let nodeSelector = null;
let mouseSelectOn;

window.addEventListener('DOMContentLoaded', async () => {
  container = document.querySelector('#actdia');
  actdia = new ActDia({
    container,
    onView: onView,
  });

  nodeSelector = new NodeSelector({ actdia, container });
  nodeSelector.onSelectNode = onSelectNode;

  actdia.onDblClick = dblClickHandler;
});

function dblClickHandler(evt) {
  mouseSelectOn = actdia.getUntransformedPosition(actdia.mouse);
  nodeSelector.show({ path: '../actdia/nodes' });
}

function onSelectNode({ evt, fqcn, }) {
  evt.stopPropagation();
  evt.preventDefault();

  const { x, y } = mouseSelectOn;
  actdia.addItem({
    fqcn,
    x,
    y,
  });

  nodeSelector.close();
}

function onView(options) {
  const exportable = actdia.getExportableItems(options);
  const data = actdia.getData(exportable);
  new Dialog({
    container,
    content: '<pre>' + JSON.stringify(data, '', 2) + '</pre>',
    header: _('Exported Data'),
  });
}