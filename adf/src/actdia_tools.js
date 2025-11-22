import Item from '../actdia/item.js';
import { escapeHTML } from '../actdia/utils.js';
import Dialog from './dialog.js';
import { _ } from '../actdia/locale.js';
import { pushNotification } from './notistack.js';

export default class ActDiaTools {
  tools = [
    new Item({
      type: 'tool',
      name: _('Menu'),
      position: 'fixed',
      classList: ['full-filled'],
      shape: {
        shapes: [
          {
            shape: 'rect',
            width: 1,
            height: .2,
            rx: .1,
            ry: .1,
            stroke: false,
          },
          {
            shape: 'rect',
            y: .4,
            width: 1,
            height: .2,
            rx: .1,
            ry: .1,
            stroke: false,
          },
          {
            shape: 'rect',
            y: .8,
            width: 1,
            height: .2,
            rx: .1,
            ry: .1,
            stroke: false,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => {
        this.tools
          .filter(i => i.type === 'tool' && i.name !== 'Menu')
          .forEach(i => i.visible = !i.visible);
      },
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('Save'),
      description: _('Saves the diagram.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'path',
            d: `
              M0 0 H1 V1 H0 Z
              M0.15 0 V0.35 H0.85 V0
              M0.3 0 V0.2 H0.7 V0
              M0.15 0.6 H0.85 V1 H0.15 Z`,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.save(),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('Copy JSON to clipboard'),
      description: _('Copies the diagram data to the clipboard in JSON format.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'rect',
            x: 0.3,
            y: 0.1,
            width: 0.7,
            height: 0.8,
            fill: '#666',
            stroke: '#333',
            strokeWidth: 0.02,
          },
          {
            shape: 'rect',
            x: 0.1,
            y: 0.2,
            width: 0.7,
            height: 0.8,
            fill: '#444',
            stroke: '#666',
            strokeWidth: 0.02,
          },
          {
            shape: 'text',
            text: 'JSON',
            textAnchor: 'right',
            dominantBaseline: 'bottom',
            fill: '#fff',
            fontSize: 0.3,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.copyJSONToClipboard(),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('Copy SVG to clipboard'),
      description: _('Copies the diagram image to the clipboard in SVG format.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'rect',
            x: 0.3,
            y: 0.1,
            width: 0.7,
            height: 0.8,
            fill: '#666',
            stroke: '#333',
            strokeWidth: 0.02,
          },
          {
            shape: 'rect',
            x: 0.1,
            y: 0.2,
            width: 0.7,
            height: 0.8,
            fill: '#444',
            stroke: '#666',
            strokeWidth: 0.02,
          },
          {
            shape: 'text',
            text: 'SVG',
            textAnchor: 'right',
            dominantBaseline: 'bottom',
            fill: '#fff',
            fontSize: 0.3,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.copySVGToClipboard(),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('Download JSON'),
      description: _('Download the diagram as a JSON file.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'path',
            d: `M 0.5 0.1 V 0.6
              M 0.35 0.45 L 0.5 0.6 L 0.65 0.45
              M 0.2 0.75 H 0.8 V 0.85 H 0.2 Z`,
            fill: false,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.downloadJson({ selected: true}),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('Upload'),
      description: _('Upload a diagram as a JSON file.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'path',
            d: `M 0.5 0.6 V 0.1
              M 0.35 0.25 L 0.5 0.1 L 0.65 0.25
              M 0.2 0.75 H 0.8 V 0.85 H 0.2 Z`,
            fill: false,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.uploadJson(),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('Share'),
      description: _('Share the diagram as a URL.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'line',
            x1: 0.2, y1: 0.2,
            x2: 0.8, y2: 0.5,
          },
          {
            shape: 'line',
            x1: 0.2, y1: 0.8,
            x2: 0.8, y2: 0.5,
          },
          {
            shape: 'circle',
            cx: 0.2, cy: 0.2, r: 0.12,
          },
          {
            shape: 'circle',
            cx: 0.2, cy: 0.8, r: 0.12,
          },
          {
            shape: 'circle',
            cx: 0.8, cy: 0.5, r: 0.12,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.share(),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('Download SVG'),
      description: _('Download the diagram as a SVG image.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'path',
            d: 'M0.1 0.1 H0.9 V0.7 H0.1 Z',
            fill: '#555',
            stroke: '#333',
          },
          {
            shape: 'circle',
            cx: 0.2,
            cy: 0.2,
            r: 0.1,
            fill: '#ff0',
            stroke: false,
          },
          {
            shape: 'path',
            d: 'M0.15 0.7 L0.4 0.4 L0.6 0.6 L0.85 0.3 L0.9 0.7 Z',
            fill: '#666',
          },
          {
            shape: 'path',
            d: `M 0.5 0.4 V .95
              M 0.35 0.8 L 0.5 .95 L 0.65 0.8`,
          },
        ],
      },
      box: null,
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.downloadSvg({ selected: true}),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('View'),
      description: _('View the diagram as a JSON data.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'path',
            d: `
              M0.1 0.5 Q0.5 0.1 0.9 0.5 Q0.5 0.9 0.1 0.5 Z
              M0.5 0.5 m-0.1 0 a0.1 0.1 0 1 0 0.2 0 a0.1 0.1 0 1 0 -0.2 0`,
          },
        ],
      },
      box: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
      draggable: false,
      exportable: false,
      onMouseClick: () => this.view({ selected: true}),
    }),

    new Item({
      type: 'tool',
      visible: false,
      name: _('View in console'),
      description: _('View the diagram in the browser\'s console.'),
      position: 'fixed',
      shape: {
        shapes: [
          {
            shape: 'path',
            d: 'M 0.05 0.05 H0.95 V0.95 H0.05 Z',
            fill: '#222',
          },
          {
            shape: 'path',
            d: 'M 0.1 0.1 H0.9 V0.6 H0.1 Z',
            fill: '#111',
          },
          {
            shape: 'path',
            d: 'M 0.15 0.65 L 0.3 0.8 L 0.15 0.95',
            stroke: '#0f0',
          },
        ],
      },
      box: {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
      selectable: false,
      draggable: false,
      exportable: false,
      onMouseClick: () => this.viewInConsole({ selected: true}),
    }),
  ];

  constructor({ container, actdia }) {
    this.container = container;
    this.actdia = actdia;
    this.create();
  }

  create() {
    this.toolsElement = document.createElement('div');
    this.toolsElement.classList.add('actdia-tools');
    this.container.appendChild(this.toolsElement);

    const options = { sx: 18, sy: 18 };
    const svgList = this.tools.map(tool => 
      '<div'
        + ` id="${escapeHTML(tool.id)}"`
        + ' class="button actdia-tool-button"'
        + ` data-id="${escapeHTML(tool.id)}"`
        + ` title="${tool.description ? tool.name + ':\n' + tool.description : tool.name}"`
      + '>'
        + '<svg xmlns="http://www.w3.org/2000/svg"'
          + ' width="100%"'
          + ' height="100%"'
          + ' viewBox="0 0 20 20"'
        + '>'
          + this.actdia.getItemSVG(tool, options)
        + '</svg>'
      + '</div>'
    );

    this.toolsElement.innerHTML = svgList.join('');

    this.tools.forEach(tool => {
      const toolSVG = this.toolsElement.querySelector(`#${CSS.escape(tool.id)}`);
      tool.svgElement = toolSVG;
      tool.divElement = toolSVG.closest('.button');
    });
    this.updateTools();

    this.toolsElement.addEventListener('click', evt => {
      const id = evt.target?.closest('.actdia-tool-button')?.dataset?.id;
      if (!id)
        return;

      const tool = this.tools.find(t => t.id === id);
      if (!tool)
        return;

      const onMouseClick = tool?.onMouseClick;
      if (onMouseClick) {
        onMouseClick();
        this.updateTools();
      }
    });
  }

  updateTools() {
    this.tools.forEach(tool => {
      tool.divElement.style.display = tool.visible === false ? 'none' : 'block';
    });
  }

  getExportableItems(options) {
    return this.actdia.getExportableItems(options);
  }

  getData(options) {
    return this.actdia.getData(options);
  }

  save() {
    const data = this.getData();
    localStorage.setItem('actdia', JSON.stringify(data));
    pushNotification(_('Diagram saved.'), 'success');
  }

  async copyJSONToClipboard(options) {
    const exportable = this.getExportableItems(options);
    const jsonText = JSON.stringify(this.getData(exportable), null, 2);
    const json = new ClipboardItem({ 'text/plain': new Blob([jsonText], { type: 'application/json' })});
    await navigator.clipboard.write([json]);
    pushNotification(_('JSON data copied to the clipboard.'), 'success');
  }

  async copySVGToClipboard(options) {
    const exportable = this.getExportableItems(options);
    const svgText = await this.actdia.getSVG(exportable);
    const svg = new ClipboardItem({ 'text/plain': new Blob([svgText], { type: 'image/svg+xml' })});
    await navigator.clipboard.write([svg]);
    pushNotification(_('SVG image copied to the clipboard.'), 'success');
 }

  downloadJson(options) {
    const exportable = this.getExportableItems(options);
    const jsonText = JSON.stringify(this.getData(exportable), null, 2);
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'actdia.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  uploadJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file)
        return;

      const reader = new FileReader();
      reader.onload = async evt => {
        try {
          const json = JSON.parse(evt.target.result);
          await this.actdia.load(json, { skipNotification: true });
          pushNotification(_('Diagram loaded from JSON file.'), 'success');
        } catch (err) {
          console.error(err);
          pushNotification(_('Invalid JSON file.'), 'error');
        }
      };
      reader.readAsText(file);
    });

    input.click();
  }

  share(options) {
    const exportable = this.getExportableItems(options);
    const data = this.getData(exportable);
    const url = new URL(window.location.href);
    url.hash = '#' + encodeURIComponent(JSON.stringify(data));
    navigator.clipboard.writeText(url.toString())
      .then(() => pushNotification(_('URL copied to clipboard.'), 'success'))
      .catch(err => pushNotification(_('Error to copy: %s', err), 'error'));
  }
  
  async downloadSvg(options) {
    const exportable = this.getExportableItems(options);
    const svgText = await this.actdia.getSVG(exportable);
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'actdia.svg';
    a.click();
  }

  viewInConsole(options) {
    const exportable = this.getExportableItems(options);
    const data = this.getData(exportable);
    console.log(data);
  }

  view(options) {
    const exportable = this.getExportableItems(options);
    const data = this.getData(exportable);
    new Dialog({
      container: this.container,
      content: '<pre>' + JSON.stringify(data, '', 2) + '</pre>',
      header: _('JSON data'),
    });
  }
}