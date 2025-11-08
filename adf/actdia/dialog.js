import './dialog.css';
import { _ } from './locale.js';

export default class Dialog {
  constructor({ container }) {
    this.container = container;

    this.element = document.createElement('div');
    this.element.classList.add('dialog', 'draggable');
    this.element.style.display = 'none';
    this.element.style.position = 'fixed';
    this.container.appendChild(this.element);
    this.element.innerHTML = 
      `<div class="header">
        <div class="header-text"></div>
        <button type="button" class="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18" height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div class="content"></div>
      <div class="footer">
        <div class="actions">
          <button type="submit" class="submit">${_('Submit')}</button>
          <button type="button" class="cancel">${_('Cancel')}</button>
          <button type="button" class="close">${_('Close')}</button>
        </div>
      </div>`;

    this.headerElement = this.element.querySelector('.header');
    this.headerTextElement = this.element.querySelector('.header-text');
    this.contentElement = this.element.querySelector('.content');
    this.footerElement = this.element.querySelector('.footer');

    this.headerCloseButton = this.headerElement.querySelector('.close');
    this.closeButton = this.footerElement.querySelector('.close');
    this.cancelButton = this.footerElement.querySelector('.cancel');
    this.submitButton = this.footerElement.querySelector('.submit');

    this.element.addEventListener('submit', evt => this.submitHandler(evt));
    this.element.addEventListener('keydown', evt => evt.stopPropagation());
    this.cancelButton.addEventListener('click', evt => this.cancelHandler(evt));
    this.headerCloseButton.addEventListener('click', evt => this.closeHandler(evt));
    this.closeButton.addEventListener('click', evt => this.closeHandler(evt));
  }

  show(content, options) {
    options ??= {};

    if (typeof content === 'object' && content !== null) {
      options = { ...options, ...content };
      content = options.content || '';
    }

    if (options.header) {
      this.headerTextElement.innerHTML = options.header;
    }

    this.contentElement.innerHTML = content;

    this.element.className = 'dialog draggable';
    if (options.className) {
      this.element.classList.add(options.className);
    }

    if (options.closeButton === false) {
      this.closeButton.style.display = 'none';
      this.headerCloseButton.style.display = 'none';
    } else {
      this.closeButton.style.display = 'inline-block';
      this.closeButton.innerHTML = 
        typeof options.closeButton === 'string' ? options.closeButton : _('Close');

      this.headerCloseButton.style.display = '';
    }

    if (options.submitButton === false) {
      this.submitButton.style.display = 'none';
    } else {
      this.submitButton.style.display = 'inline-block';
      this.submitButton.innerHTML = 
        typeof options.submitButton === 'string' ? options.submitButton : _('Submit');
    }

    if (options.cancelButton === false) {
      this.cancelButton.style.display = 'none';
    } else {
      this.cancelButton.style.display = 'inline-block';
      this.cancelButton.innerHTML = 
        typeof options.cancelButton === 'string' ? options.cancelButton : _('Cancel');
    }

    this.element.style.display = 'block';

    if (typeof options.width !== 'undefined')
      this.element.style.width = options.width;
    else {
      this.element.style.width = '';
      const maxWidth = document.body.clientWidth * .8;
      if (this.element.offsetWidth > maxWidth)
        this.element.style.width = maxWidth + 'px';
    }

    if (typeof options.height !== 'undefined')
      this.element.style.height = options.height;
    else {
      this.element.style.height = '';
      const maxHeight = document.body.clientHeight * .8;
      if (this.element.offsetHeight > maxHeight)
        this.element.style.height = maxHeight + 'px';
    }

    if (typeof options.x !== 'undefined')
      this.element.style.left = options.x + 'px';
    else
      this.element.style.left = (document.body.clientWidth - this.element.offsetWidth) / 2 + 'px';

    if (typeof options.y !== 'undefined')
      this.element.style.top = options.y + 'px';
    else
      this.element.style.top = (document.body.clientHeight - this.element.offsetHeight) / 2 + 'px';

    this.onClick = options.onClick;
  }

  showError(content, options) {
    this.show(
      content,
      {
        className: 'error',
        header: _('Error'),
        submitButton: false,
        cancelButton: false,
      }
    );
  }
  
  close() {
    this.element.style.display = 'none';
  }

  closeHandler(evt) {
    evt.preventDefault();
    this.close();
  }

  submitHandler(evt) {
    evt.preventDefault();
    this.close();
  }

  cancelHandler(evt) {
    evt.preventDefault();
    this.close();
  }
}