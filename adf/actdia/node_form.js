import Form from './form.js';
import { isNode } from './node.js';
import { _ } from './locale.js';
import { getValueByPath, setValueByPath, deletePropertyByPath } from './utils.js';

export default class NodeForm extends Form {
  showForNode(node, options) {
    if (!isNode(node)) {
      this.node = null;
      this.showError(_('The provided object is not a Node.'));
      return;
    }

    this.node = node;
    this.updateFormDefinition();
    options.header ??= _('Node Properties');

    super.show(options);
  }

  updateFormDefinition() {
    this.formDefinition = JSON.parse(JSON.stringify([
      {
        name: 'id',
        _label: 'ID',
        disabled: true,
      },
      {
        name: 'name',
        _label: 'Name',
      },
      {
        name: 'description',
        _label: 'Description',
      },
      {
        name: 'style.fill',
        type: 'color',
        _label: 'Fill color',
        nullable: true,
      },
      {
        name: 'style.stroke',
        type: 'color',
        _label: 'Stroke color',
        nullable: true,
      },
      {
        name: 'style.strokeWidth',
        type: 'number',
        _label: 'Line width',
        nullable: true,
      },
      {
        name: 'style.dash',
        type: 'text',
        _label: 'Dash',
        nullable: true,
      },
      ...this.node.formDefinition || []
    ]));    
  }

  getValue(field) {
    return getValueByPath(this.node, field.name);
  }

  setValue(field, value) {
    if (typeof value === 'undefined') {
      deletePropertyByPath(this.node, field.name);
      return;
    }

    if (field.type === 'number') {
      setValueByPath(this.node, field.name, value ? parseFloat(value) : null);
      return;
    }
    
    if (field.type === 'text' && field.name === 'style.dash') {
      value = value? value
        .split(/[, ]/)
        .map(v => parseFloat(v.trim()))
        .filter(v => !isNaN(v)) : [];

      setValueByPath(this.node, field.name, value);
    }

    setValueByPath(this.node, field.name, value);
    this.node.update();
  }
}