import '@material/mwc-icon-button-toggle';

const template = document.createElement('template');
template.innerHTML = `
  <mwc-icon-button-toggle offIcon="fullscreen" onIcon="fullscreen_exit"></mwc-icon-button-toggle>
`;

class EzraFullscreenToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('ezra-fullscreen-toggle', EzraFullscreenToggle);

module.exports = EzraFullscreenToggle;