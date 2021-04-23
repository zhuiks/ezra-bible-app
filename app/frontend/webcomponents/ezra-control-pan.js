import '@material/mwc-button';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  .wrapper {
    position: absolute;
    top: 0;
    right: 0;
    min-height: 2em;
    min-width: 2em;
    background: gray;
    z-index: 100;
  }
  </style>
  <div class="wrapper">
    <mwc-button raised label="Contained Button"></mwc-button>
  </div>`;

  class EzraControlPan extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

// Define the new element
customElements.define('ezra-control-pan', EzraControlPan);

module.exports = EzraControlPan;