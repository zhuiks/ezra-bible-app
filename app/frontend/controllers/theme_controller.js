/* This file is part of Ezra Bible App.

   Copyright (C) 2019 - 2021 Ezra Bible App Development Team <contact@ezrabibleapp.net>

   Ezra Bible App is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 2 of the License, or
   (at your option) any later version.

   Ezra Bible App is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Ezra Bible App. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */

const Darkmode = require('darkmode-js');

const SETTINGS_KEY = 'useNightMode';

/**
 * The ThemeController contains functions for switching between the standard (light theme)
 * and the dark "night" theme. Whenever the user switches the "night mode" in the options menu, this controller
 * processes the change.
 * 
 * Like all other controllers it is only initialized once. It is accessible at the
 * global object `window.theme_controller`.
 * 
 * @category Controller
 */
class ThemeController {
  constructor() {
    this.darkMode = null;
    this.useNightMode = false;
  }

  async init() {
    this.useNightMode = await ipcSettings.get(SETTINGS_KEY, this.useNightMode);
  }

  isDarkModeActive() {
    return this.useNightMode;
  }

  async earlyInitNightMode() {
    if (this.useNightMode) {
      document.body.classList.add('darkmode--activated');
    }
  }

  async initNightMode() {
    var isMojaveOrLater = await platformHelper.isMacOsMojaveOrLater();
    if (isMojaveOrLater) { // On macOS (from Mojave) we initialize night mode based on the system settings
      const nativeTheme = require('electron').remote.nativeTheme;

      // Set up a listener to react when the native theme has changed
      nativeTheme.on('updated', () => {
        if (nativeTheme.shouldUseDarkColors != this.useNightMode) {
          uiHelper.showGlobalLoadingIndicator();

          setTimeout(() => {
            this._updateDarkModeIfNeeded();
            uiHelper.hideGlobalLoadingIndicator();
          }, 100);
        }
      });

      if (nativeTheme.shouldUseDarkColors != this.useNightMode) {
        console.log("Initializing night mode based on system settings ...");
        this._updateDarkModeIfNeeded();
      }

    } else { // On other systems we initialize night mode based on the application settings
      console.log("Initializing night mode based on app settings ...");
      this._updateUI();
    }
  }

  async _updateDarkModeIfNeeded() {
    var isMojaveOrLater = await platformHelper.isMacOsMojaveOrLater();
    if (isMojaveOrLater) {
      const nativeTheme = require('electron').remote.nativeTheme;

      if (nativeTheme.shouldUseDarkColors) {
        app_controller.optionsMenu._nightModeOption.enableOption();
      } else {
        app_controller.optionsMenu._nightModeOption.disableOption();
      }

      this._updateUI();
    }
  }

  async toggleDarkMode() {
    uiHelper.showGlobalLoadingIndicator();
    
    this.useNightMode = !this.useNightMode;
    
    await this._updateUI();
    await this._saveSettings();

    await waitUntilIdle();
    uiHelper.hideGlobalLoadingIndicator();
  }

  async _updateUI() {
    setMaterialTheme(this.useNightMode);

    if (this.useNightMode) {
      switchJqueryUiTheme('css/jquery-ui/dark-hive/jquery-ui.css');
      app_controller.notes_controller.setDarkTheme();
    } else {
      switchJqueryUiTheme('css/jquery-ui/cupertino/jquery-ui.css');
      app_controller.notes_controller.setLightTheme();
    }

    if (this.darkMode == null) {
      this.darkMode = new Darkmode();
    }

    if (this.useNightMode && !this.darkMode.isActivated() ||
      !this.useNightMode && this.darkMode.isActivated()) {

      this.darkMode.toggle();
      // We need to repaint all charts, because the label color depends on the theme
      await app_controller.verse_statistics_chart.repaintAllCharts();
    }

  }

  async _saveSettings() {
    await ipcSettings.set(SETTINGS_KEY, this.useNightMode);
    
    if (platformHelper.isCordova()) {
      // On Cordova we persist a basic night mode style in a CSS file 
      // which is then loaded on startup again
      await ipcSettings.storeNightModeCss();
    }
  }

}

function switchJqueryUiTheme(theme) {
  var currentTheme = document.getElementById("theme-css").href;

  if (currentTheme.indexOf(theme) == -1) { // Only switch the theme if it is different from the current theme
    document.getElementById("theme-css").href = theme;
  }
}


function setMaterialTheme(isDark = false) {
  let themeStyleEl = document.querySelector('#theme-vars');
  if (themeStyleEl === null) {
    themeStyleEl = document.createElement('style');
    themeStyleEl.setAttribute('id', 'theme-vars');
    document.querySelector('head').appendChild(themeStyleEl);
  }

  const stylesheet = themeStyleEl.sheet;

  for (let i = stylesheet.cssRules.length - 1; i === 0; i--) {
    stylesheet.deleteRule(i);
  }

  stylesheet.insertRule(`html {
    --mdc-theme-primary: ${isDark ? '#39ACDF' : '#2779AA'};
    --mdc-theme-secondary: #D7EBF9;
    --mdc-theme-surface: ${isDark ? '#424242' : '#E2F5FB'};
    --mdc-theme-background: ${isDark ? '#212121' : '#FFFFFF'};
    --mdc-theme-on-primary: #E2F5FB;
    --mdc-theme-on-secondary: #001D70;
    --mdc-theme-on-surface: ${isDark ? '#E2F5FB' : '#212121'};
    
    --mdc-theme-text-primary-on-background: var(--mdc-theme-on-surface);

    --mdc-dialog-scrim-color: rgba(0, 0, 0, ${isDark ? 0.88 : 0.32});
    --mdc-dialog-heading-ink-color: var(--mdc-theme-on-surface);
    --mdc-dialog-content-ink-color: var(--mdc-theme-on-surface);
    --mdc-dialog-scroll-divider-color: rgba(0, 0, 0, ${isDark ? 0.9 : 0.12});
  }`);
}

module.exports = ThemeController;