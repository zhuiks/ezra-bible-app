import '@material/mwc-icon';
import '@material/mwc-slider';
import '@material/mwc-formfield';
import '@material/mwc-switch';
// import i18n from 'i18next';
import 'mousetrap';


const DEFAULT_TEXT_SIZE = 10; // in em*10 so not to deal with float
const MIN_SIZE = 7;
const MAX_SIZE = 20;
const INCREASE_SHORTCUT = ['mod+=', 'mod+shift+=']; // Ctrl/Cmd + 
const DECREASE_SHORTCUT = ['mod+-', 'mod+shift+-'];  // Ctrl/Cmd -
const RESET_SHORTCUT = 'mod+0';  // Ctrl/Cmd 0
const SETTINGS_KEY = 'verse-text-size';
const SETTINGS_KEY_CHECKOBOX = 'adjustTagsNotesTextSize';

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: flex;
    align-items: center;
    padding: 0 1em;
    margin: 0 1em;
    border-left: 1px solid var(--mdc-theme-surface);
    border-right: 1px solid var(--mdc-theme-surface);
  }
  #slider{
    margin-inline-end: 1em;
  }
</style>
<mwc-icon>format_size</mwc-icon>
<mwc-slider 
  id="slider"
  markers
  step="1"
  min="${MIN_SIZE}"
  max="${MAX_SIZE}"
  value="${DEFAULT_TEXT_SIZE}">
</mwc-slider>
<mwc-formfield id="tags-notes-resize" label="bible-browser.adjust-font-size-tags-notes">
  <mwc-switch id="should-tags-notes-resize"></mwc-switch>
</mwc-formfield>
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

    const formfield = this.shadowRoot.querySelector('#tags-notes-resize');
    const localizedLabel = i18n.t(formfield.getAttribute('label')); // TODO: refactor global var
    formfield.setAttribute('label', localizedLabel);

    this.textSizeSlider = this.shadowRoot.querySelector('#slider');
    this.shouldTagsNotesResize = this.shadowRoot.querySelector('#should-tags-notes-resize');

    if (window.ipcSettings) {
      this.textSizeSlider.value = await window.ipcSettings.get(SETTINGS_KEY, DEFAULT_TEXT_SIZE);
      this.shouldTagsNotesResize.checked = await window.ipcSettings.get(SETTINGS_KEY_CHECKOBOX, false);
    }

    this.updateStyle();

    this.textSizeSlider.addEventListener('input', () => {
      this.updateStyle();
      this.saveTextSize();
    });

    formfield.addEventListener('change', () => {
      console.log(this.shouldTagsNotesResize.checked);
      this.updateStyle();
      this.saveShouldTagsNotesResize();
    });

    if (window.Mousetrap) { // Mousetrap should be global under window
      Mousetrap.bind(INCREASE_SHORTCUT, () => {
        this.increaseSize();
        return false;
      });

      Mousetrap.bind(DECREASE_SHORTCUT, () => {
        this.decreaseSize();
        return false;
      });

      Mousetrap.bind(RESET_SHORTCUT, () => {
        this.resetSize();
        return false;
      });
    }

    await waitUntilIdle();
    this.textSizeSlider.layout();

  }

  increaseSize() {
    if (this.textSizeSlider.value >= MAX_SIZE) {
      return;
    }

    this.textSizeSlider.value += 1;
    this.updateStyle();
    this.saveTextSize();
  }

  decreaseSize() {
    if (this.textSizeSlider.value <= MIN_SIZE) {
      return;
    }

    this.textSizeSlider.value -= 1;
    this.updateStyle();
    this.saveTextSize();
  }

  resetSize() {
    this.textSizeSlider.value = DEFAULT_TEXT_SIZE;
    this.updateStyle();
    this.saveTextSize();
  }

  async saveTextSize() {
    if (window.ipcSettings) {
      await window.ipcSettings.set(SETTINGS_KEY, this.textSizeSlider.value);
    }
  }

  async saveShouldTagsNotesResize() {
    if (window.ipcSettings) {
      await window.ipcSettings.set(SETTINGS_KEY_CHECKOBOX, this.shouldTagsNotesResize.checked);
    }
  }

  updateStyle() {
    this.stylesheet.insertRule(
      `.verse-list ${this.shouldTagsNotesResize.checked ? '' : '.verse-text '} {
        font-size: ${this.textSizeSlider.value * 0.1}em 
      }`, this.stylesheet.cssRules.length);

    if (this.stylesheet.cssRules.length > 1) {
      this.stylesheet.deleteRule(0);
    }
  }


}

customElements.define('ezra-text-size', EzraTextSize);

module.exports = EzraTextSize;