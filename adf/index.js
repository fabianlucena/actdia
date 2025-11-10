import ActDia from './actdia/actdia.js';
import NodeSelector from './src/node_selector.js';
import Dialog from './src/dialog.js';
import NodeForm from './src/node_form.js';
import { _ } from './actdia/locale.js';
import { createNotificationContainer, pushNotification } from './src/notistack.js';
import './src/drag.js';

let container = null;
let actdia = null;
let nodeSelector = null;
let mouseSelectOn;

window.addEventListener('DOMContentLoaded', async () => {
  createNotificationContainer();

  container = document.querySelector('#actdia');
  actdia = new ActDia({
    container,
    onView: onView,
  });

  nodeSelector = new NodeSelector({ actdia, container });
  nodeSelector.onSelectNode = onSelectNode;

  actdia.onDblClick = dblClickHandler;
  actdia.onItemDblClick = itemDblClickHandler;
  actdia.pushNotification = pushNotification;
});

function dblClickHandler(evt) {
  mouseSelectOn = actdia.getUntransformedPosition(actdia.mouse);
  nodeSelector.show({ path: '../actdia/nodes' });
}

function itemDblClickHandler({ actdia, item, evt }) {
  const nodeForm = new NodeForm({ container: this.container });
  nodeForm.showForNode(item, { x: this.mouse.x, y: this.mouse.y });
  evt.preventDefault();
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