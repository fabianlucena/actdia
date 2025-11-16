import ActDia from './actdia/actdia.js';
import NodeSelector from './src/node_selector.js';
import NodeForm from './src/node_form.js';
import { _, loadLocale } from './actdia/locale.js';
import { createNotificationContainer, pushNotification } from './src/notistack.js';
import './src/drag.js';
import { getPath } from './actdia/utils.js';
import ActDiaTools from './src/actdia_tools.js';

let container = null,
  actdia = null,
  nodeSelector = null,
  mouseSelectOn;

window.addEventListener('DOMContentLoaded', async () => {
  createNotificationContainer();

  await loadLocale(getPath(import.meta.url) + '/src', 'es');

  container = document.querySelector('#actdia');
  actdia = new ActDia({ container, editable: true });

  nodeSelector = new NodeSelector({ actdia, container });
  nodeSelector.onSelectNode = onSelectNode;

  actdia.onPushNotification = pushNotification;

  new ActDiaTools({ container, actdia });

  actdia.addEventListener('dblclick', dblClickHandler);
  actdia.addEventListener('item:dblclick', itemDblClickHandler);
  actdia.addEventListener('keydown', keyDownHandler, true);
  actdia.addEventListener('keyup', keyUpHandler);
});

function dblClickHandler(evt) {
  if (!actdia.editable)
    return;

  mouseSelectOn = actdia.getUntransformedPosition(actdia.mouse);
  nodeSelector.show({ defaultPath: '../nodes' });
}

function itemDblClickHandler(evt) {
  const { item } = evt.detail;
  if (item) {
    const { mouse } = evt.detail;
    const nodeForm = new NodeForm({ container });
    nodeForm.showForNode(item, { x: mouse.x, y: mouse.y });
    evt.preventDefault();
    evt.stopPropagation();
  }
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

function keyDownHandler(evt) {
  switch (evt.key) {
    case 'Escape': return escapeDefaultHandler(evt);
    case 'Delete': return deleteDefaultHandler(evt);
    case 'Backspace': return backspaceDefaultHandler(evt);
  }
}

function escapeDefaultHandler(evt) {
  actdia.cancelCaptureItem();
  actdia.cancelDrag();
}

function deleteDefaultHandler(evt) {
  actdia.deleteSelected();
}

function backspaceDefaultHandler(evt) {
  actdia.deleteSelected();
}

function keyUpHandler(evt) {
  switch (evt.key) {
    case 'c': if (evt.ctrlKey || evt.metaKey)
      copyJSONToClipboard(evt);
  }
}

async function copyJSONToClipboard(options) {
  const exportable = actdia.getExportableItems({ selected: true, ...options });
  const jsonText = JSON.stringify(actdia.getData(exportable), null, 2);
  const json = new ClipboardItem({ 'text/plain': new Blob([jsonText], { type: 'application/json' })});
  await navigator.clipboard.write([json]);
  pushNotification(_('JSON data copied to the clipboard.'), 'success');
}