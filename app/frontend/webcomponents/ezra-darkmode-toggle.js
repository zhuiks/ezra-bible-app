import '@material/mwc-formfield';
import '@material/mwc-switch';
// import i18n from 'i18next';

const template = document.createElement('template');
template.innerHTML = `
<mwc-formfield id="dark-mode" label="bible-browser.use-night-mode">
  <mwc-switch id="switch"></mwc-switch>
</mwc-formfield>
`;

class EzraDarkmodeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    if (!window.theme_controller) { // can't do anything without theme controller!
      return;
    }
    if (typeof platformHelper !== 'undefined' && platformHelper.isMacOsMojaveOrLater()) {
      return; // On macOS Mojave and later we do not give the user the option to switch night mode within the app, since it is controlled via system settings.
    }

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const formfield = this.shadowRoot.querySelector('#dark-mode');
    const localizedLabel = i18n.t(formfield.getAttribute('label')); // TODO: refactor global var
    formfield.setAttribute('label', localizedLabel);
    this.setAttribute('title', localizedLabel); 

    const trigger = formfield.querySelector('#switch');
    if (window.theme_controller.useNightMode) {
      trigger.setAttribute('checked', '');
    } else {
      trigger.removeAttribute('checked');
    }

    trigger.addEventListener('change', () => window.theme_controller.useNightModeBasedOnOption());
  }

}

customElements.define('ezra-darkmode-toggle', EzraDarkmodeToggle);

module.exports = EzraDarkmodeToggle;