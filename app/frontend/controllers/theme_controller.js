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
            this.toggleDarkModeIfNeeded();
            uiHelper.hideGlobalLoadingIndicator();
          }, 100);
        }
      });

      if (nativeTheme.shouldUseDarkColors != this.useNightMode) {
        console.log("Initializing night mode based on system settings ...");
        this.toggleDarkModeIfNeeded();
      }

    } else { // On other systems we initialize night mode based on the application settings
      if (this.useNightMode) {
        console.log("Initializing night mode based on app settings ...");
        this.useNightModeBasedOnOption(true);
      }
    }
  }

  async toggleDarkModeIfNeeded() {
    var isMojaveOrLater = await platformHelper.isMacOsMojaveOrLater();
    if (isMojaveOrLater) {
      const nativeTheme = require('electron').remote.nativeTheme;

      if (nativeTheme.shouldUseDarkColors) {
        app_controller.optionsMenu._nightModeOption.enableOption();
      } else {
        app_controller.optionsMenu._nightModeOption.disableOption();
      }

      this.useNightModeBasedOnOption();
    }
  }

  switchToDarkTheme() {
    this.switchToTheme('css/jquery-ui/dark-hive/jquery-ui.css');
    app_controller.notes_controller.setDarkTheme();
  }

  switchToRegularTheme() {
    this.switchToTheme('css/jquery-ui/cupertino/jquery-ui.css');
    app_controller.notes_controller.setLightTheme();
  }

  switchToTheme(theme) {
    var currentTheme = document.getElementById("theme-css").href;

    if (currentTheme.indexOf(theme) == -1) { // Only switch the theme if it is different from the current theme
      document.getElementById("theme-css").href = theme;
    }
  }

  async useNightModeBasedOnOption(force = false) {
    uiHelper.showGlobalLoadingIndicator();

    if (!force) {
      this.useNightMode = !this.useNightMode;
      await ipcSettings.set(SETTINGS_KEY, this.useNightMode);
    }

    setMaterialTheme(this.useNightMode);

    if (this.useNightMode) {
      this.switchToDarkTheme();
    } else {
      this.switchToRegularTheme();
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

    if (platformHelper.isCordova()) {
      // On Cordova we persist a basic night mode style in a CSS file 
      // which is then loaded on startup again
      await ipcSettings.storeNightModeCss();
    }

    await waitUntilIdle();
    uiHelper.hideGlobalLoadingIndicator();
  }

  async isNightModeUsed() {
    var useNightMode = false;

    var isMojaveOrLater = platformHelper.isMacOsMojaveOrLater();
    if (isMojaveOrLater) {
      const nativeTheme = require('electron').remote.nativeTheme;
      useNightMode = nativeTheme.shouldUseDarkColors;
    } else {
      var useNightModeSettingAvailable = await ipcSettings.has(SETTINGS_KEY);

      if (useNightModeSettingAvailable) {
        useNightMode = await ipcSettings.get(SETTINGS_KEY);
      }
    }

    return useNightMode;
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