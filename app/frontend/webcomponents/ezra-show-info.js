import '@material/mwc-icon-button';
import '@material/mwc-dialog';
import '@material/mwc-tab-bar';
import '@material/mwc-tab';
import '@material/mwc-button';
// import i18n from 'i18next';

const CommitInfo = require('./app/commit_info.js');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    #info-popup {
      --mdc-dialog-min-width: 720px;
    }
  </style>
  <mwc-icon-button id="show-info" icon="info" outlined></mwc-icon-button>
  <mwc-dialog id="info-popup">
    <mwc-tab-bar>
      <mwc-tab id="tab-1" icon="book"></mwc-tab>
      <mwc-tab id="tab-2" icon="import_contacts"></mwc-tab>
      <mwc-tab id="tab-3" icon="laptop"></mwc-tab>
    </mwc-tab-bar>
    <div id="info-popup-content">
      <div id="tab-1-content"></div>
      <div id="tab-2-content"></div>
      <div id="tab-3-content">
        <h2>Developers</h2>
        <a class='external' href='https://github.com/tobias-klein'>Tobias Klein (Maintainer)</a><br>
        <a class='external' href='https://github.com/zhuiks'>Evgen Kucherov</a>
  
        <h2>Translators</h2>
        <a class='external' href='https://github.com/tobias-klein'>Tobias Klein (English, German)</a><br>
        <a class='external' href='https://gitlab.com/lafricain79'>Br Cyrille (French)</a><br>
        <a class='external' href='https://github.com/lemtom'>Tom Lemmens (French, Dutch)</a><br>
        <a class='external' href='https://github.com/reyespinosa1996'>Reinaldo R. Espinosa (Spanish)</a><br>
        <a class='external' href='https://github.com/MartinIIOT'>MartinIIOT (Slovakian)</a><br>
        <a class='external' href='https://github.com/zhuiks'>Evgen Kucherov (Ukrainian, Russian)</a>
  
        <h2>Versions and Paths</h2>
            <table id="app-info-table">
            </table>
          </div>
    </div>
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

    this.dialog.querySelector('#tab-1').setAttribute('label', i18n.t('general.sword-module-description'));
    this.dialog.querySelector('#tab-2').setAttribute('label', i18n.t('general.sword-module-details'));
    this.dialog.querySelector('#tab-3').setAttribute('label', i18n.t('general.application-info'));
    this.dialog.querySelectorAll('h2').forEach(h => {
      h.innerHTML = i18n.t(`general.${h.innerHTML.toLowerCase().replace(/ /g, '-')}`);
    });

    this.dialog.querySelector('#close-info').innerHTML = i18n.t('general.ok');
  }

  async handleClick(event) {
    if (!this.dialog || this.dialog.getAttribute('open')) {
      return;
    }
    this.populateModuleInfo(this.dialog.querySelector('#tab-1-content'), this.dialog.querySelector('#tab-2-content'));
    this.populateAppInfo(this.dialog.querySelector('table#app-info-table'));

    this.dialog.show();
  }

  async populateModuleInfo(divInfo, divDetails) {
    //TODO: refactor global vars
    if (typeof app_controller === 'undefined' || !app_controller.tab_controller || !app_controller.translation_controller) {
      return;
    }

    const currentBibleTranslationId = app_controller.tab_controller.getTab().getBibleTranslationId();
    if (divInfo) {
      divInfo.innerHTML = await app_controller.translation_controller.getModuleDescription(currentBibleTranslationId);
    }
    if (divDetails) {
      divDetails.innerHTML = await app_controller.translation_controller.getModuleInfo(currentBibleTranslationId, false, false);
    }

  }

  async populateAppInfo(tableElement) {
    if (!tableElement || tableElement.innerHTML.trim() !== '') { // populate only if empty
      return;
    }

    //TODO: refactor global vars
    if(typeof uiHelper !== 'undefined') {
      uiHelper.initExternalLinkHandling(this.dialog);
    }

    let version = '';
    if (typeof platformHelper !== 'undefined') {
      if (platformHelper.isElectron() && typeof app !== 'undefined') {
        version = app.getVersion();
      } else if (platformHelper.isCordova() && typeof cordova !== 'undefined') {
        version = await cordova.getAppVersion.getVersionNumber();
      }
    }

    const gitCommit = CommitInfo.commit.slice(0, 8);
    const swordVersion = typeof ipcNsi !== 'undefined' ? await ipcNsi.getSwordVersion() : '';
    const chromiumVersion = typeof getChromiumVersion !== 'undefined' ? getChromiumVersion() : '';
    const databasePath = typeof ipcDb !== 'undefined' ? await ipcDb.getDatabasePath() : '';
    const configFilePath = typeof ipcSettings !== 'undefined' ? await ipcSettings.getConfigFilePath() : '';

    tableElement.innerHTML = `
    <tr><td style='width: 15em;'>${i18n.t("general.application-version")}:</td><td>${version}</td></tr>
    <tr><td>${i18n.t("general.git-commit")}:</td><td>${gitCommit}</td></tr>
    <tr><td>${i18n.t("general.sword-version")}:</td><td>${swordVersion}</td></tr>
    <tr><td>${i18n.t("general.chromium-version")}:</td><td>${chromiumVersion}</td></tr>
    <tr><td>${i18n.t("general.database-path")}:</td><td>${databasePath}</td></tr>
    <tr><td>${i18n.t("general.config-file-path")}:</td><td>${configFilePath}</td></tr>
    `;
  }
}

customElements.define('ezra-show-info', EzraShowInfo);

export default EzraShowInfo;