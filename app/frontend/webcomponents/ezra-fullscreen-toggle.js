import '@material/mwc-icon-button-toggle';
import 'mousetrap';
// import i18n from 'i18next';

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
    if (typeof platformHelper !== 'undefined' &&platformHelper.isMac()) {
      return; // no fullscreen button for Mac
    }

    if (typeof platformHelper !== 'undefined' && (platformHelper.isWin() || platformHelper.isLinux()) && typeof Mousetrap !== 'undefined') { // Mousetrap should be globabl under window.Mousetrap
      Mousetrap.bind('f11', () => {
        this.toggleFullScreen();
        this.updateIcon();
      });
    }

    const platform = this.getPlatform();
    if (platform) {
      this.isFullscreen = platform.isFullScreen();
    }

    this.addEventListener('click', (e) => this.toggleFullScreen(e));
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.updateIcon();
    this.updateTitle();
  }

  toggleFullScreen(e) {
    const platform = this.getPlatform(); 
    if (!platform) {
      e.preventDefault();
      return;
    }

    this.isFullscreen = !this.isFullscreen;

    this.updateTitle();

    platform.toggleFullScreen();
  }

  updateIcon() {
    const button = this.shadowRoot.querySelector('#toggle-fullscreen');
    if (this.isFullscreen) {
      button.setAttribute('on', '');
    } else {
      button.removeAttribute('on');
    }
  }

  updateTitle() {
    this.setAttribute('title', i18n.t(this.isFullscreen ? 'menu.exit-fullscreen' : 'menu.fullscreen')); // TODO: refactor global var
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

customElements.define('ezra-fullscreen-toggle', EzraFullscreenToggle);

module.exports = EzraFullscreenToggle;