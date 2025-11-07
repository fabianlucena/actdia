import { _ } from './locale.js';

export default class Dialog {
  constructor({ container }) {
    this.container = container;

    this.element = document.createElement('form');
    this.element.classList.add('dialog', 'draggable');
    this.element.style.display = 'none';
    this.element.style.position = 'absolute';
    this.container.appendChild(this.element);
    this.element.innerHTML = 
      `<div class="dialog-header-content">
        <div class="dialog-header"></div>
        <button type="button" class="header-close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="dialog-content"></div>
      <div class="dialog-actions">
        <button type="submit">${_('Submit')}</button>
        <button type="button" class="cancel-button">${_('Cancel')}</button>
        <button type="button" class="close-button">${_('Close')}</button>
      </div>`;
    this.element.addEventListener('mousedown', evt => this.mouseDownHandler(evt));
    this.element.addEventListener('mouseup', evt => this.mouseUpHandler(evt));
    this.element.addEventListener('submit', evt => this.submitHandler(evt));
    this.element.addEventListener('input', evt => this.inputHandler(evt));
    this.element.addEventListener('click', evt => this.clickHandler(evt));
    this.element.addEventListener('keydown', evt => evt.stopPropagation());
    this.element.querySelector('.cancel-button').addEventListener('click', evt => this.cancelHandler(evt));
    this.element.querySelector('.close-button').addEventListener('click', evt => this.closeHandler(evt));
    this.element.querySelector('.header-close-button').addEventListener('click', evt => this.closeHandler(evt));
    this.headerElementContainer = this.element.querySelector('.dialog-header-container');
    this.headerElement = this.element.querySelector('.dialog-header');
    this.contentElement = this.element.querySelector('.dialog-content');
  }

  show(content, options) {
    options ??= {};

    if (options.header) {
      this.headerElement.innerHTML = options.header;
    }

    this.contentElement.innerHTML = content;

    if (options.closeButton === false) {
      this.element.querySelector('.close-button').style.display = 'none';
      this.element.querySelector('.header-close-button').style.display = 'none';
    } else {
      this.element.querySelector('.close-button').style.display = 'inline-block';
      this.element.querySelector('.close-button').innerHTML = 
        typeof options.closeButton === 'string' ? options.closeButton : _('Close');

      this.element.querySelector('.header-close-button').style.display = '';
    }

    if (options.submitButton === false) {
      this.element.querySelector('button[type="submit"]').style.display = 'none';
    } else {
      this.element.querySelector('button[type="submit"]').style.display = 'inline-block';
      this.element.querySelector('button[type="submit"]').innerHTML = 
        typeof options.submitButton === 'string' ? options.submitButton : _('Submit');
    }

    if (options.cancelButton === false) {
      this.element.querySelector('.cancel-button').style.display = 'none';
    } else {
      this.element.querySelector('.cancel-button').style.display = 'inline-block';
      this.element.querySelector('.cancel-button').innerHTML = 
        typeof options.cancelButton === 'string' ? options.cancelButton : _('Cancel');
    }

    this.element.style.display = 'block';

    if (typeof options.x !== 'undefined')
      this.element.style.left = options.x + 'px';
    else
      this.element.style.left = '0';

    if (typeof options.y !== 'undefined')
      this.element.style.top = options.y + 'px';
    else
      this.element.style.top = '0';

    if (typeof options.width !== 'undefined')
      this.element.style.width = options.width;
    else
      this.element.style.width = '';

    this.onClick = options.onClick;
  }

  close() {
    this.element.style.display = 'none';
  }

  closeHandler(evt) {
    this.close();
  }

  inputHandler(evt) {
    const name = evt.target.name;
    let field = this.formDefinition.find(f => f.name === name);
    let value;
    if (field) {
      value = evt.target.type === 'checkbox' ?
        evt.target.checked :
        evt.target.value;

      if (field.nullable) {
        const nullifier = this.element.querySelector('#' + field.id.replace('.', '\\.') + '_nullifier');
        if (nullifier && !nullifier.checked) {
          nullifier.checked = true;
        }
      }
    } else {
      field = this.formDefinition.find(f => (f.name + '_nullifier') === name);
      if (!field) {
        return;
      }

      if (evt.target.checked) {
        var element = this.element.querySelector('#' + field.id.replace('.', '\\.'));
        value = element.type === 'checkbox' ?
          element.checked :
          element.value;
      } else {
        value = undefined;
      }
    }

    this.setItemFieldValue(this.formItem, field, value);
    this.formItem.update();
  }

  clickHandler(evt) {
    return this.onClick?.(evt);
  }

  submitHandler(evt) {
    evt.preventDefault();
    const formData = new FormData(this.element);
    let value;
    this.formDefinition?.forEach(field => {
      if (field.disabled || field.readOnly)
        return;

      if (field.nullable && formData.get(field.name + '_nullifier') !== 'on') {
        value = undefined;
      } else {
        value = formData.get(field.name);
      }

      this.setItemFieldValue(this.formItem, field, value);
    });

    this.element.style.display = 'none';
  }

  cancelHandler(evt) {
    this.element.style.display = 'none';
    this.formDefinition.forEach(field =>
      this.setItemFieldValue(this.formItem, field, field.previousValue));
  }

  mouseDownHandler(evt) {
  }

  mouseUpHandler(evt) {
  }
}