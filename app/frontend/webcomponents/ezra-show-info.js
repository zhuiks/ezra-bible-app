import '@material/mwc-button';

const template = document.createElement('template');
template.innerHTML = `
  <mwc-button id="show-info" icon="info" outlined></mwc-icon-button-toggle>
`;

class EzraShowInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('ezra-show-info', EzraShowInfo);

export default EzraShowInfo;