import './ezra-show-info';
import './ezra-darkmode-toggle';
import './ezra-fullscreen-toggle';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  .wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background: transparent;
    z-index: 100;
  }
  </style>
  <div class="wrapper">
    <ezra-show-info disabled></ezra-show-info>
    <ezra-darkmode-toggle></ezra-darkmode-toggle>
    <ezra-fullscreen-toggle></ezra-fullscreen-toggle>
  </div>`;

class EzraControlPan extends HTMLElement {
  static get observedAttributes() {
    return ['translation-avaliable', 'theme'];
  }

  constructor() {
    // Always call super first in constructor
    super();
    this.attachShadow({ mode: 'open' });
    console.log('Ezra WC: EzraControlPan created');
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    console.log('Ezra WC: EzraControlPan attached');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'translation-avaliable') {
      const button = this.shadowRoot.querySelector('ezra-show-info');
      if (newValue === null) {
        button.setAttribute('disabled', '');
      } else {
        button.removeAttribute('disabled');
      }
      return;
    }

    if (name === 'theme' && newValue !== oldValue) {
      setTheme(newValue);
    }
  }

}

// Define the new element
customElements.define('ezra-control-pan', EzraControlPan);

function setTheme(theme = 'light') {
  const stylesheet = document.querySelector('#theme-vars').sheet;
  for (let i = stylesheet.cssRules.length - 1; i === 0; i--) {
    stylesheet.deleteRule(i);
  }

  const isDark = theme === 'dark';

  stylesheet.insertRule(`html {
    --mdc-theme-primary: ${isDark ? '#39ACDF' : '#2779AA'};
    --mdc-theme-secondary: #D7EBF9;
    --mdc-theme-surface: ${isDark ? '#424242' : '#E2F5FB'};
    --mdc-theme-background: ${isDark ? '#212121' : '#FFFFFF'};
    --mdc-theme-on-primary: #E2F5FB;
    --mdc-theme-on-secondary: #001D70;
    --mdc-theme-on-surface: ${isDark ? '#E2F5FB' : '#212121'};

    --mdc-dialog-scrim-color: rgba(0, 0, 0, ${isDark ? 0.88 : 0.32});
    --mdc-dialog-heading-ink-color: ${isDark ? '#E2F5FB' : '#212121'};
    --mdc-dialog-content-ink-color: ${isDark ? '#E2F5FB' : '#212121'};
    --mdc-dialog-scroll-divider-color: rgba(0, 0, 0, ${isDark ? 0.9 : 0.12});
  }`);

}

console.log('Ezra WC: EzraControlPan defined');

module.exports = EzraControlPan;