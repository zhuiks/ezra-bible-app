import './ezra-control-pan.js';

window.initWebComponents = function () {
  const container = document.getElementById(('verse-list-tabs'));
  container.insertBefore(document.createElement('ezra-control-pan'), container.firstChild);
}