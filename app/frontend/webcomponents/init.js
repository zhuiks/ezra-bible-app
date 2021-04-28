import './ezra-control-pan.js';

window.initWebComponents = function () {
  const themeStyle = document.createElement('style');
  themeStyle.setAttribute('id', 'theme-vars');
  document.querySelector('head').appendChild(themeStyle);

  const container = document.getElementById(('verse-list-tabs'));
  container.insertBefore(document.createElement('ezra-control-pan'), container.firstChild);
}