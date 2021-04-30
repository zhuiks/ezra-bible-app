import '@material/mwc-icon';
import '@material/mwc-slider';
import '@material/mwc-formfield';
import '@material/mwc-checkbox';
// import i18n from 'i18next';

const DEFAULT_TEXT_SIZE = 10; // in em*10 so not to deal with float
const MIN_SIZE = 7;
const MAX_SIZE = 20;
const INCREASE_SHORTCUT = ['mod+=', 'mod+shift+=']; // Ctrl/Cmd + 
const DECREASE_SHORTCUT = ['mod+-', 'mod+shift+-'];  // Ctrl/Cmd -
const RESET_SHORTCUT = 'mod+0';  // Ctrl/Cmd 0
const SETTINGS_KEY = 'verse-text-size';

const template = document.createElement('template');
template.innerHTML = `
<div class="container">
  <mwc-icon>format_size</mwc-icon>
  <mwc-slider 
    id="slider"
    markers
    step="1"
    min="${MIN_SIZE}"
    max="${MAX_SIZE}"
    value="${DEFAULT_TEXT_SIZE}"
  </mwc-slider>
</div>
`;

class EzraTextSize extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {

    let styleEl = document.querySelector('#dynamic-text-size');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('id', 'dynamic-text-size');
      document.head.appendChild(styleEl);
    }

    this.stylesheet = styleEl.sheet;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // const formfield = this.shadowRoot.querySelector('#dark-mode');
    // const localizedLabel = i18n.t(formfield.getAttribute('label')); // TODO: refactor global var
    // formfield.setAttribute('label', localizedLabel);
    // this.setAttribute('title', localizedLabel); 

    this.slider = this.shadowRoot.querySelector('#slider');
    if (window.ipcSettings) {
      this.slider.value = await window.ipcSettings.get(SETTINGS_KEY, DEFAULT_TEXT_SIZE);
     
      this._shouldTagsNotesResize = await window.ipcSettings.get('adjustTagsNotesTextSize', this._shouldTagsNotesResize);
    }

    this.updateStyle();

    this.slider.addEventListener('input', () => {
      this.saveTextSize();
      this.updateStyle();
    });

    await waitUntilIdle();
    this.slider.layout();

  }

  async saveTextSize() {
    if (window.ipcSettings) {
      await window.ipcSettings.set(SETTINGS_KEY, this.slider.value);
    }
  }

  updateStyle() {
    this.stylesheet.insertRule(
      `.verse-list ${this._shouldTagsNotesResize ? '' : '.verse-text '} {
        font-size: ${this.slider.value * 0.1}em 
      }`, this.stylesheet.cssRules.length);

    if (this.stylesheet.cssRules.length > 1) {
      this.stylesheet.deleteRule(0);
    }
  }


}

customElements.define('ezra-text-size', EzraTextSize);

module.exports = EzraTextSize;