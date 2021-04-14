// Create a class for the element
class EzraControlPan extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({mode: 'open'});

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const info = document.createElement('span');
    info.setAttribute('class', 'info');
    info.textContent = 'Comming soon...';


    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');

    style.textContent = `
      .wrapper {
        position: absolute;
        top: 0;
        right: 0;
        min-height: 2em;
        min-width: 2em;
        background: gray;
        z-index: 100;
      }
      .info {
        font-size: 0.8rem;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(info);
  }
}

// Define the new element
customElements.define('ezra-control-pan', EzraControlPan);