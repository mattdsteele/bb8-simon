customElements.define('bb8-buttons', class extends HTMLElement {
  connectedCallback() {
    const buttons = `<div class="buttons">
        <div class="red button"></div>
        <div class="blue button"></div>
        <div class="yellow button"></div>
        <div class="green button"></div>
        <img class="bb8-logo button" src="img/bb8.svg">
      </div>`;

    this.innerHTML = buttons;
  }
  renderCallback() {
    return skate.h('div', { class: 'buttons' });
  }
});
