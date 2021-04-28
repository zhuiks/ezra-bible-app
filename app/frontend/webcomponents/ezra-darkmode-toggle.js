import '@material/mwc-formfield';
import '@material/mwc-switch';

// import i18n from 'i18next';

const template = document.createElement('template');
template.innerHTML = `
<mwc-formfield id="dark-mode" label="bible-browser.use-night-mode">
  <mwc-switch></mwc-switch>
</mwc-formfield>
`;

class EzraDarkmodeToggle extends HTMLElement {
  constructor() {
    super();
    this.isDarkmode = false;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const formfield = this.shadowRoot.querySelector('#dark-mode');
    const localizedLabel = i18n.t(formfield.getAttribute('label')); // TODO: refactor global var
    formfield.setAttribute('label', localizedLabel);
    this.setAttribute('title', localizedLabel); 

    formfield.addEventListener('change', (e) => this.toggleDarkMode(e));
  }

  toggleDarkMode(e) {
    // const platform = this.getPlatform(); 
    // if (!platform) {
    //   e.preventDefault();
    //   return;
    // }

    this.isDarkmode = !this.isDarkmode;
    console.log('darkmode:', this.isDarkmode)

    // platform.toggleFullScreen();
  }

  getPlatform() { 
    // TODO: move to platformHelper && refactor global vars
    if (typeof platformHelper === 'undefined') {
      return null;
    }  

    if (platformHelper.isElectron()) {
      return electronPlatform;
    }
    
    if (platformHelper.isAndroid()) {
      return cordovaPlatform;
    }

    return undefined;
  }
}

customElements.define('ezra-darkmode-toggle', EzraDarkmodeToggle);

module.exports = EzraDarkmodeToggle;