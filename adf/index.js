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
  mouseSelectOn,
  tools;

window.addEventListener('DOMContentLoaded', async () => {
  createNotificationContainer();

  await loadLocale(getPath(import.meta.url) + '/src', 'es');

  container = document.querySelector('#actdia');
  actdia = new ActDia({ container });

  nodeSelector = new NodeSelector({ actdia, container });
  nodeSelector.onSelectNode = onSelectNode;

  actdia.onDblClick = dblClickHandler;
  actdia.onItemDblClick = itemDblClickHandler;
  actdia.pushNotification = pushNotification;

  tools = new ActDiaTools({ container, actdia });
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