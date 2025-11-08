import './dialog.css';
import { _ } from './locale.js';

export default class Dialog {
  onClose = null;
  onOk = null;
  onCancel = null;
  onNo = null;
  onYes = null;

  constructor({ container }) {
    this.container = container;

    this.element = document.createElement('div');
    this.element.classList.add('dialog', 'draggable');
    this.element.style.display = 'flex';
    this.element.style.position = 'fixed';
    this.element.style.flexDirection = 'column';
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
          <button type="button" class="ok">${_('OK')}</button>
          <button type="button" class="cancel">${_('Cancel')}</button>
          <button type="button" class="yes">${_('Yes')}</button>
          <button type="button" class="no">${_('No')}</button>
          <button type="button" class="close">${_('Close')}</button>
        </div>
      </div>`;

    this.headerElement = this.element.querySelector('.header');
    this.headerTextElement = this.element.querySelector('.header-text');
    this.contentElement = this.element.querySelector('.content');
    this.footerElement = this.element.querySelector('.footer');

    this.headerCloseButton = this.headerElement.querySelector('.close');
    this.closeButton = this.footerElement.querySelector('.close');
    this.okButton = this.footerElement.querySelector('.ok');
    this.cancelButton = this.footerElement.querySelector('.cancel');
    this.yesButton = this.footerElement.querySelector('.yes');
    this.noButton = this.footerElement.querySelector('.no');

    this.element.addEventListener('keydown', evt => evt.stopPropagation());
    this.cancelButton.addEventListener('click', evt => this.cancelHandler(evt));
    this.headerCloseButton.addEventListener('click', evt => this.closeHandler(evt));
    this.closeButton.addEventListener('click', evt => this.closeHandler(evt));
    this.okButton.addEventListener('click', evt => this.okHandler(evt));
    this.cancelButton.addEventListener('click', evt => this.cancelHandler(evt));
    this.yesButton.addEventListener('click', evt => this.yesHandler(evt));
    this.noButton.addEventListener('click', evt => this.noHandler(evt));
  }

  show(content, options) {
    options ??= {};

    if (typeof content === 'object' && content !== null) {
      options = { ...options, ...content };
      content = options.content;
    }

    if (options.header) {
      this.headerTextElement.innerHTML = options.header;
    }

    if (typeof content === 'string')
      this.contentElement.innerHTML = content;

    this.element.className = 'dialog draggable';
    if (options.className) {
      this.element.classList.add(options.className);
    }

    if (options.closeButton === false) {
      this.closeButton.style.display = 'none';
      this.headerCloseButton.style.display = 'none';
    } else {
      this.closeButton.style.display = '';
      this.closeButton.innerHTML = 
        typeof options.closeButton === 'string' ? options.closeButton : _('Close');

      this.headerCloseButton.style.display = '';
    }

    if (options.okButton === false) {
      this.okButton.style.display = 'none';
    } else {
      this.okButton.style.display = '';
      this.okButton.innerHTML = 
        typeof options.okButton === 'string' ? options.okButton : _('OK');
    }

    if (options.cancelButton === false) {
      this.cancelButton.style.display = 'none';
    } else {
      this.cancelButton.style.display = '';
      this.cancelButton.innerHTML = 
        typeof options.cancelButton === 'string' ? options.cancelButton : _('Cancel');
    }

    if (options.yesButton) {
      this.yesButton.style.display = '';
      this.yesButton.innerHTML =
        typeof options.yesButton === 'string' ? options.yesButton : _('Yes');
    } else {
      this.yesButton.style.display = 'none';
    }

    if (options.noButton) {
      this.noButton.style.display = '';
      this.noButton.innerHTML =
        typeof options.noButton === 'string' ? options.noButton : _('No');
    } else {
      this.noButton.style.display = 'none';
    }

    this.element.style.display = 'flex';

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
        okButton: false,
        cancelButton: false,
      }
    );
  }
  
  close() {
    this.element.style.display = 'none';
  }

  closeHandler(evt) {
    evt.preventDefault();
    this.onClose && this.onClose();
    this.close();
  }

  okHandler(evt) {
    evt.preventDefault();
    this.onOk && this.onOk();
    this.close();
  }

  cancelHandler(evt) {
    evt.preventDefault();
    this.onCancel && this.onCancel();
    this.close();
  }
  
  yesHandler(evt) {
    evt.preventDefault();
    this.onYes && this.onYes();
    this.close();
  }

  noHandler(evt) {
    evt.preventDefault();
    this.onNo && this.onNo();
    this.close();
  }
}