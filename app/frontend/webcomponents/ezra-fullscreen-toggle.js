import '@material/mwc-icon-button-toggle';

const template = document.createElement('template');
template.innerHTML = `
  <mwc-icon-button-toggle id="toggle-fullscreen" offIcon="fullscreen" onIcon="fullscreen_exit"></mwc-icon-button-toggle>
`;

class EzraFullscreenToggle extends HTMLElement {
  constructor() {
    super();
    this.isFullscreen = false;
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.addEventListener('click', (e) => this.toggleFullScreen(e));

    this.updateButton();
  }

  toggleFullScreen(e) {
    const platform = this.getPlatform(); 
    if (!platform) {
      e.preventDefault();
      return;
    }

    this.isFullscreen = !this.isFullscreen;

    platform.toggleFullScreen();
  }

  updateButton() {
    const platform = this.getPlatform();
    if (platform) {
      this.isFullscreen = platform.isFullScreen();
    }

    const button = this.shadowRoot.querySelector('#toggle-fullscreen');
    if (this.isFullscreen) {
      button.setAttribute('on', '');
    } else {
      button.removeAttribute('on');
    }

  }

  getPlatform() { 
    // TODO: refactor global vars
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

customElements.define('ezra-fullscreen-toggle', EzraFullscreenToggle);

module.exports = EzraFullscreenToggle;