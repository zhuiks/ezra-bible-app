import '@material/mwc-button';
// import 'material-design-icons';

const template = document.createElement('template');
template.innerHTML = `
  <mwc-button raised label="Fullscreen Button"></mwc-button>
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