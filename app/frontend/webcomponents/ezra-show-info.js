import '@material/mwc-icon-button';
import '@material/mwc-dialog';
import '@material/mwc-button';
// import i18n from 'i18next';


const template = document.createElement('template');
template.innerHTML = `
  <mwc-icon-button id="show-info" icon="info" outlined></mwc-icon-button>
  <mwc-dialog id="info-popup">
    <div id="info-popup-content">Some text</div>
    <mwc-button id="close-info" slot="primaryAction" dialogAction="close">Ok</mwc-button>
  </mwc-dialog>
`;

class EzraShowInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const button = this.shadowRoot.querySelector('#show-info')
    button.addEventListener('click', (e) => this.handleClick(e));
    button.setAttribute('label', i18n.t('menu.show-module-info'));
    button.setAttribute('title', i18n.t('menu.show-module-info'));

    this.dialog = this.shadowRoot.querySelector('#info-popup');
    this.dialog.setAttribute('heading', i18n.t('general.module-application-info'));

    this.dialog.querySelector('#close-info').innerHTML = i18n.t('general.ok');
  }

  handleClick(event) {
    if (!this.dialog || this.dialog.getAttribute('open')) {
      return;
    }
    
    this.dialog.show();
  }
}

customElements.define('ezra-show-info', EzraShowInfo);

export default EzraShowInfo;