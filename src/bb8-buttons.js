import 'skatejs-web-components';
import { Component, h } from 'skatejs';

class BB8Buttons extends Component {
  connectedCallback() {
    super.connectedCallback();
    console.log('okay');
    /*
    button('.red', 'Red');
    button('.green', 'Green');
    button('.blue', 'Blue');
    button('.yellow', 'Yellow');
    */
  }

  button (selector, color) {
    document.querySelector(selector).addEventListener('click', () => {
      this.push(color);
    });
  }

  click(color) {
    console.log(color);
  }

  renderCallback() {
    const clk = (col) => () => this.click(col);
    return (<div class="buttons">
        <div class="red button" onclick={clk('red')}></div>
        <div class="blue button" onclick={clk('blue')}></div>
        <div class="yellow button" onclick={clk('yellow')}></div>
        <div class="green button" onclick={clk('green')}></div>
        <img class="bb8-logo button" src="img/bb8.svg"></img>
      </div>);
  }

  renderedCallback() {
    console.log('rendered');
    const red = this.querySelector('.red');
    console.log(this);
  }
}

customElements.define('bb8-buttons', BB8Buttons);
